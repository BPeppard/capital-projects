import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import fetch from 'isomorphic-fetch';
import { NextAuth } from 'next-auth/client';
import Cookies from 'universal-cookie';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';

import Page from '../components/Page';
import Layout from '../components/Layout';
import Snackbar from '../components/Snackbar';

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit * 3
  }
});

class Account extends Page {
  static async getInitialProps({ req }) {
    let props = await super.getInitialProps({ req });
    props.linkedAccounts = await NextAuth.linked({ req });
    return props;
  }

  constructor(props) {
    super(props);
    this.state = {
      session: props.session,
      isSignedIn: props.session.user ? true : false,
      name: '',
      email: '',
      emailVerified: false,
      snackMessage: '',
      snackOpen: false
    };
    if (props.session.user) {
      this.state.name = props.session.user.name || '';
      this.state.email = props.session.user.email;
    }
  }

  async componentDidMount() {
    const session = await NextAuth.init({ force: true });
    this.setState({
      session: session,
      isSignedIn: session.user ? true : false
    });

    // If the user bounces off to link/unlink their account we want them to
    // land back here after signing in with the other service / unlinking.
    const cookies = new Cookies();
    cookies.set('redirect_url', window.location.pathname, { path: '/' });

    this.getProfile();
  }

  getProfile = () => {
    fetch('/account/user', {
      credentials: 'include'
    })
      .then(r => r.json())
      .then(user => {
        if (!user.name || !user.email) return;
        this.setState({
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified
        });
      });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSaveChanges = async event => {
    event.preventDefault();

    const formData = {
      _csrf: await NextAuth.csrfToken(),
      name: this.state.name || '',
      email: this.state.email || ''
    };

    fetch('/account/user', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(async res => {
      if (res.status === 200) {
        this.getProfile();
        // Force update session so that changes to name or email are reflected
        // immediately in the navbar (as we pass our session to it).
        this.setState({
          session: await NextAuth.init({ force: true }), // Update session data
          snackMessage: 'Changes to your profile have been saved',
          snackOpen: true
        });
      } else {
        this.setState({
          session: await NextAuth.init({ force: true }), // Update session data
          snackMessage: 'Failed to save changes to your profile',
          snackOpen: true
        });
      }
    });
  };

  handleSnackbarClose = () => {
    this.setState({
      snackOpen: false
    });
  };

  render() {
    if (this.state.isSignedIn === true) {
      return (
        <Layout session={this.props.session}>
          <Typography variant="h3">Your Account</Typography>
          <Typography variant="h5">Edit your profile</Typography>
          <div>
            <TextField
              label="Name"
              value={this.state.name}
              onChange={this.handleChange('name')}
              margin="normal"
            />
          </div>
          <div>
            <TextField
              label="Email"
              value={this.state.email}
              onChange={this.handleChange('email')}
              margin="normal"
            />
          </div>
          <div className={this.props.classes.button}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>
          <Snackbar
            open={this.state.snackOpen}
            message={this.state.snackMessage}
            onClose={this.handleSnackbarClose}
          />
        </Layout>
      );
    } else {
      return (
        <Layout session={this.props.session}>
          <Link prefetch href="/auth">
            <Button variant="contained" color="primary">
              Sign in to manage your profile
            </Button>
          </Link>
        </Layout>
      );
    }
  }
}

export default withStyles(styles)(Account);
