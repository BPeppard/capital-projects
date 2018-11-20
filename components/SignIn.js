import React from 'react';
import Router from 'next/router';
import Cookies from 'universal-cookie';
import { NextAuth } from 'next-auth/client';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  bottomPadding: {
    paddingBottom: theme.spacing.unit * 3
  }
});

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      session: this.props.session,
      providers: this.props.providers,
      submitting: false,
      error: null
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value.trim(),
      error: null
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    if (!this.state.email) return;

    this.setState({
      submitting: true
    });

    // Save current URL so user is redirected back here after signing in
    const cookies = new Cookies();
    cookies.set('redirect_url', window.location.pathname, { path: '/' });

    // NextAuth.signin(this.state.email)
    //   .then(() => {
    //     Router.push(`/auth/check-email?email=${this.state.email}`);
    //   })
    //   .catch(error => {
    //     Router.push(
    //       `/auth/error?action=signin&type=email&email=${this.state.email}`
    //     );
    //   });
    NextAuth.signin({
      email: this.state.email,
      password: this.state.password
    })
      .then(res => {
        console.log('NextAuth.signin result:');
        console.log(res);
        if (res) {
          Router.push('/auth/callback');
        }
      })
      .catch(err => {
        console.log('Error signing in:');
        console.log(err);
        this.setState({
          error: 'Wrong email or password',
          submitting: false
        });
      });
  };

  render() {
    const { classes } = this.props;

    if (this.props.session && this.props.session.user) {
      return <div />;
    } else {
      // return (
      //   <React.Fragment>
      //     <p className="text-center" style={{marginTop: 10, marginBottom: 30}}>{`If you don't have an account, one will be created when you sign in.`}</p>
      //     <Row>
      //       <Col xs={12} md={6}>
      //         <SignInButtons providers={this.props.providers}/>
      //       </Col>
      //       <Col xs={12} md={6}>
      //         <Form id="signin" method="post" action="/auth/email/signin" onSubmit={this.handleSubmit}>
      //           <Input name="_csrf" type="hidden" value={this.state.session.csrfToken}/>
      //           <p>
      //             <Label htmlFor="email">Email address</Label><br/>
      //             <Input name="email" disabled={this.state.submitting} type="text" placeholder="j.smith@example.com" id="email" className="form-control" value={this.state.email} onChange={this.handleEmailChange}/>
      //           </p>
      //           <p className="text-right">
      //             <Button id="submitButton" disabled={this.state.submitting} outline color="dark" type="submit">
      //               {this.state.submitting === true && <span className="icon icon-spin ion-md-refresh mr-2"/>}
      //               Sign in with email
      //             </Button>
      //           </p>
      //         </Form>
      //       </Col>
      //     </Row>
      //   </React.Fragment>
      // )

      return (
        <React.Fragment>
          <Typography>Please sign in.</Typography>
          <div>
            <form id="signin" onSubmit={this.handleSubmit}>
              <input
                name="_csrf"
                type="hidden"
                value={this.state.session.csrfToken}
              />
              <div>
                <TextField
                  label="Email"
                  disabled={this.state.submitting}
                  placeholder="j.smith@example.com"
                  id="email"
                  value={this.state.email}
                  onChange={this.handleChange('email')}
                />
              </div>
              <div className={classes.bottomPadding}>
                <TextField
                  error={Boolean(this.state.error)}
                  label={Boolean(this.state.error) ? 'Error' : 'Password'}
                  helperText={
                    Boolean(this.state.error) ? this.state.error : null
                  }
                  disabled={this.state.submitting}
                  id="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.handleChange('password')}
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                disabled={this.state.submitting}
                type="submit"
              >
                Sign in with email
              </Button>
            </form>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default withStyles(styles)(SignIn);
