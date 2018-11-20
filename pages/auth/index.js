import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import Link from 'next/link';
import Cookies from 'universal-cookie';
import { NextAuth } from 'next-auth/client';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Page from '../../components/Page';
import Layout from '../../components/Layout';
import SignIn from '../../components/SignIn';

const styles = theme => ({
  bottomPadding: {
    paddingBottom: theme.spacing.unit * 3
  }
});

class Index extends Page {
  static async getInitialProps({ req, res, query }) {
    let props = await super.getInitialProps({ req });
    props.session = await NextAuth.init({ force: true, req: req });
    props.providers = await NextAuth.providers({ req });

    // If signed in already, redirect to account management page.
    if (props.session.user) {
      if (req) {
        res.redirect('/account');
      } else {
        Router.push('/account');
      }
    }

    // If passed a redirect parameter, save it as a cookie
    if (query.redirect) {
      const cookies = new Cookies(
        req && req.headers.cookie ? req.headers.cookie : null
      );
      cookies.set('redirect_url', query.redirect, { path: '/' });
    }

    return props;
  }

  render() {
    const { classes } = this.props;

    if (this.props.session.user) {
      return (
        <Layout>
          <p className="lead text-center mt-5 mb-5">
            <Link href="/auth">
              <a>Manage your profile</a>
            </Link>
          </p>
        </Layout>
      );
    } else {
      return (
        <Layout signinButton={false}>
          <Typography className={classes.bottomPadding} variant="h3">
            Sign up / Sign in
          </Typography>
          <div>
            <SignIn
              session={this.props.session}
              providers={this.props.providers}
            />
          </div>
        </Layout>
      );
    }
  }
}

export default withStyles(styles)(Index);
