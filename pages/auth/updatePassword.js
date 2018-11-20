import React from 'react';
import { NextAuth } from 'next-auth/client';
import Router from 'next/router';
import fetch from 'isomorphic-fetch';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Page from '../../components/Page';
import Layout from '../../components/Layout';

const styles = theme => ({
  bottomPadding: {
    paddingBottom: theme.spacing.unit * 3
  },
  error: {
    color: 'red'
  }
});

class UpdatePassword extends Page {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: '',
      error: null
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value.trim(),
      error: null
    });
  };

  passwordValidation = () => {
    if (this.state.password === this.state.confirmPassword) {
      this.setState({ error: null });
      return true;
    }
    return false;
  };

  handleSubmit = async () => {
    // Check to make sure passwords match
    if (!this.passwordValidation()) {
      this.setState({
        error: 'Passwords do not match'
      });
      return;
    }

    const formData = {
      _csrf: await NextAuth.csrfToken(),
      password: this.state.password
    };

    fetch('/account/user/updatepassword', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        console.log('resetPassword res:');
        console.log(res);
        if (res.status === 200) {
          Router.push('/');
        }
      })
      .catch(err => {
        console.log('resetPassword error:');
        console.log(err);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <Layout session={this.props.session}>
        <div>
          <Typography variant="h5">Reset Password</Typography>
        </div>
        <div>
          <TextField
            label="New Password"
            value={this.state.password}
            onChange={this.handleChange('password')}
            type="password"
          />
        </div>
        <div className={classes.bottomPadding}>
          <TextField
            error={Boolean(this.state.error)}
            label={Boolean(this.state.error) ? 'Error' : 'Confirm Password'}
            helperText={Boolean(this.state.error) ? this.state.error : null}
            value={this.state.confirmPassword}
            onChange={this.handleChange('confirmPassword')}
            type="password"
          />
        </div>
        <Button variant="contained" color="primary" onClick={this.handleSubmit}>
          Update Password
        </Button>
      </Layout>
    );
  }
}

export default withStyles(styles)(UpdatePassword);
