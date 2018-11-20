import React from "react";
import Router from "next/router";
import Link from "next/link";
import PropTypes from "prop-types";
import classNames from "classnames";
import Cookies from "universal-cookie";
import { NextAuth } from "next-auth/client";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import AccountIcon from "@material-ui/icons/AccountCircle";

import Drawer from "../components/Drawer";
import SignIn from "../components/SignIn";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  appFrame: {
    // height: '100%',
    height: "100vh",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  appBar: {
    position: "absolute",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  appBarShiftLeft: {
    marginLeft: drawerWidth
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflow: "auto"
  },
  noGutters: {
    padding: 0
  },
  contentLeft: {
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  contentShift: {
    marginLeft: 0
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  }
});

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerOpen: true,
      modal: false,
      providers: null
    };
  }

  handleDrawerOpen = () => {
    this.setState({ isDrawerOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ isDrawerOpen: false });
  };

  toggleModal = async event => {
    console.log("Called toggleModal");
    if (event) {
      event.preventDefault();
    }

    // Save current URL so user is redirected back here after signing in
    if (this.state.modal !== true) {
      const cookies = new Cookies();
      cookies.set("redirect_url", window.location.pathname, { path: "/" });
    }

    this.setState({
      providers: this.state.providers || (await NextAuth.providers()),
      modal: !this.state.modal
    });
  };

  render() {
    const { classes, noGutters } = this.props;
    const { isDrawerOpen } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar
            position="static"
            className={classNames(classes.appBar, {
              [classes.appBarShift]: isDrawerOpen,
              [classes.appBarShiftLeft]: isDrawerOpen
            })}
          >
            <Toolbar disableGutters={!isDrawerOpen}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  isDrawerOpen && classes.hide
                )}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                color="inherit"
                className={classes.flex}
                noWrap
              >
                Capital Projects
              </Typography>
              <UserMenu
                session={this.props.session}
                toggleModal={this.toggleModal}
              />
            </Toolbar>
          </AppBar>
          <Drawer
            open={isDrawerOpen}
            handleDrawerClose={this.handleDrawerClose}
          />
          <main
            className={classNames(classes.content, classes.contentLeft, {
              [classes.contentShift]: isDrawerOpen,
              [classes.contentShiftLeft]: isDrawerOpen,
              [classes.noGutters]: noGutters
            })}
          >
            <div className={classes.drawerHeader} />
            {this.props.children}
          </main>
          <SigninModal
            modal={this.state.modal}
            toggleModal={this.toggleModal}
            session={this.props.session}
            providers={this.state.providers}
          />
        </div>
      </div>
    );
  }
}

export class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  handleOpenMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleSignout = async event => {
    event.preventDefault();

    const formData = {
      _csrf: await NextAuth.csrfToken()
    };
    fetch("/auth/signout", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then(async res => {
        console.log("Signout user res:");
        console.log(res);
        if (res.status === 200) {
          // Save current URL so user is redirected back here after signing out
          const cookies = new Cookies();
          cookies.set("redirect_url", window.location.pathname, { path: "/" });

          await NextAuth.signout();
          Router.push("/");
        } else {
          console.log("Error in signout response. res:");
          console.log(res);
        }
      })
      .catch(err => {
        console.log("Error signing user out. error:");
        console.log(err);
      });
  };

  render() {
    if (this.props.session && this.props.session.user) {
      // If signed in display user dropdown menu
      const session = this.props.session;
      // return (
      //   <Nav className="ml-auto" navbar>
      //     {/*<!-- Uses .nojs-dropdown CSS to for a dropdown that works without client side JavaScript ->*/}
      //     <div tabIndex="2" className="dropdown nojs-dropdown">
      //       <div className="nav-item">
      //         <span className="dropdown-toggle nav-link d-none d-md-block">
      //           <span
      //             className="icon ion-md-contact"
      //             style={{
      //               fontSize: '2em',
      //               position: 'absolute',
      //               top: -5,
      //               left: -25
      //             }}
      //           />
      //         </span>
      //         <span className="dropdown-toggle nav-link d-block d-md-none">
      //           <span className="icon ion-md-contact mr-2" />
      //           {session.user.name || session.user.email}
      //         </span>
      //       </div>
      //       <div className="dropdown-menu">
      //         <Link prefetch href="/account">
      //           <a href="/account" className="dropdown-item">
      //             <span className="icon ion-md-person mr-1" /> Your Account
      //           </a>
      //         </Link>
      //         <AdminMenuItem {...this.props} />
      //         <div className="dropdown-divider d-none d-md-block" />
      //         <div className="dropdown-item p-0">
      //           <Form
      //             id="signout"
      //             method="post"
      //             action="/auth/signout"
      //             onSubmit={this.handleSignoutSubmit}
      //           >
      //             <input
      //               name="_csrf"
      //               type="hidden"
      //               value={this.props.session.csrfToken}
      //             />
      //             <Button
      //               type="submit"
      //               block
      //               className="pl-4 rounded-0 text-left dropdown-item"
      //             >
      //               <span className="icon ion-md-log-out mr-1" /> Sign out
      //             </Button>
      //           </Form>
      //         </div>
      //       </div>
      //     </div>
      //   </Nav>
      // );
      return (
        <div>
          <IconButton onClick={this.handleOpenMenu} color="inherit">
            <AccountIcon fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={this.state.anchorEl}
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleCloseMenu}
          >
            <Link prefetch href="/account">
              <MenuItem>Your Account</MenuItem>
            </Link>
            <AdminMenuItem {...this.props} />
            <MenuItem onClick={this.handleSignout}>Sign Out</MenuItem>
          </Menu>
        </div>
      );
    }
    if (this.props.signinBtn === false) {
      // If not signed in, don't display sign in button if disabled
      return null;
    } else {
      // If not signed in, display sign in button
      // return (
      //   <Nav className="ml-auto" navbar>
      //     <NavItem>
      //       {/**
      //        * @TODO Add support for passing current URL path as redirect URL
      //        * so that users without JavaScript are also redirected to the page
      //        * they were on before they signed in.
      //        **/}
      //       <a
      //         href="/auth?redirect=/"
      //         className="btn btn-outline-primary"
      //         onClick={this.props.toggleModal}
      //       >
      //         <span className="icon ion-md-log-in mr-1" /> Sign up / Sign in
      //       </a>
      //     </NavItem>
      //   </Nav>
      // );
      return (
        <Button
          color="inherit"
          href="/auth?redirect=/"
          onClick={this.props.toggleModal}
        >
          Sign up / Sign in
        </Button>
      );
    }
  }
}

export class AdminMenuItem extends React.Component {
  render() {
    if (this.props.session.user && this.props.session.user.admin === true) {
      return (
        <React.Fragment>
          <Link prefetch href="/admin">
            <MenuItem>Admin</MenuItem>
          </Link>
        </React.Fragment>
      );
    } else {
      return <div />;
    }
  }
}

export class SigninModal extends React.Component {
  render() {
    if (this.props.providers === null) return null;

    // return (
    //   <Modal isOpen={this.props.modal} toggle={this.props.toggleModal} style={{maxWidth: 700}}>
    //     <ModalHeader>Sign up / Sign in</ModalHeader>
    //     <ModalBody style={{padding: '1em 2em'}}>
    //       <Signin session={this.props.session} providers={this.props.providers}/>
    //     </ModalBody>
    //   </Modal>
    // )
    return (
      <Dialog open={this.props.modal} onClose={this.props.toggleModal}>
        <DialogTitle>Sign up / Sign In</DialogTitle>
        <DialogContent>
          <SignIn
            session={this.props.session}
            providers={this.props.providers}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(Layout);
