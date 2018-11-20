/**
 * This is an example of a simple (read only) user dashboard. To acess this page
 * page you need to use MongoDB and set '"admin": true' on your account.
 **/
import { NextAuth } from 'next-auth/client';
import Router from 'next/router';
import Link from 'next/link';
import fetch from 'isomorphic-fetch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Page from '../components/Page';
import Layout from '../components/Layout';
import User from '../models/user';
import Snackbar from '../components/Snackbar';

export default class extends Page {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      newUserOpen: false,
      name: '',
      email: '',
      snackOpen: false,
      snackMessage: ''
    };

    this.options = {
      onPageChange: this.onPageChange.bind(this),
      onSizePerPageList: this.sizePerPageListChange.bind(this),
      page: 1,
      pageStartIndex: 1,
      paginationPosition: 'top',
      paginationSize: 5,
      sizePerPage: 10,
      sizePerPageList: [10, 50, 100]
    };
  }

  async componentDidMount() {
    await this.updateData();
  }

  async onPageChange(page, sizePerPage) {
    this.options.page = page;
    this.options.sizePerPage = sizePerPage;
    await this.updateData();
  }

  async sizePerPageListChange(sizePerPage) {
    this.options.sizePerPage = sizePerPage;
    await this.updateData();
  }

  // async updateData() {
  updateData = async () => {
    this.setState({
      data: await User.all()
    });
    // this.setState({
    //   data: await User.list({
    //     page: this.options.page,
    //     size: this.options.sizePerPage
    //   })
    // });
  };

  handleNewUserOpen = () => {
    this.setState({
      newUserOpen: true
    });
  };

  handleNewUserClose = () => {
    this.setState({
      newUserOpen: false
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  createNewUser = async () => {
    const formData = {
      _csrf: await NextAuth.csrfToken(),
      name: this.state.name,
      email: this.state.email
    };

    fetch('/account/create', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        console.log('Created user. res:');
        console.log(res);
        if (res) {
          this.setState({
            snackOpen: true,
            snackMessage:
              'User Created. They will receive an email with a link to log in'
          });
          this.updateData();
        }
      })
      .catch(err => {
        console.log('Error creating user. error:');
        console.log(err);
        this.setState({
          snackOpen: true,
          snackMessage: 'Error creating user'
        });
      });

    this.handleNewUserClose();
  };

  onDelete = message => {
    this.updateData();
    this.setState({
      snackOpen: true,
      snackMessage: message
    });
  };

  onPasswordReset = message => {
    this.setState({
      snackOpen: true,
      snackMessage: message
    });
  };

  handleSnackbarClose = () => {
    this.setState({
      snackOpen: false
    });
  };

  render() {
    if (!this.props.session.user || this.props.session.user.admin !== true)
      return super.adminAcccessOnly();

    const data =
      this.state.data && this.state.data.users ? this.state.data.users : [];
    const totalSize =
      this.state.data && this.state.data.total ? this.state.data.total : 0;

    return (
      <Layout session={this.props.session}>
        <h1 className="display-4">Administration</h1>
        <p className="lead text-muted ">
          This is an example read-only admin page which lists user accounts.
        </p>
        {/*<Table data={data} totalSize={totalSize} options={this.options} />*/}
        <Button variant="contained" onClick={this.handleNewUserOpen}>
          New User
        </Button>
        <Dialog open={this.state.newUserOpen} onClose={this.handleNewUserClose}>
          <DialogTitle>New User</DialogTitle>
          <DialogContent>
            <div>
              <TextField
                label="Name"
                value={this.state.name}
                onChange={this.handleChange('name')}
              />
            </div>
            <div>
              <TextField
                label="Email"
                value={this.state.email}
                onChange={this.handleChange('email')}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.createNewUser} color="primary">
              Save
            </Button>
            <Button onClick={this.handleNewUserClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.admin ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Actions
                    user={user}
                    onDelete={this.onDelete}
                    onPasswordReset={this.onPasswordReset}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Snackbar
          open={this.state.snackOpen}
          message={this.state.snackMessage}
          onClose={this.handleSnackbarClose}
        />
      </Layout>
    );
  }
}

export class Actions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      user: props.user
    };
  }

  handleOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handlePasswordReset = async () => {
    const formData = {
      _csrf: await NextAuth.csrfToken(),
      userId: this.state.user._id
    };
    fetch('/admin/user/resetpassword', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        console.log('Reset Password res:');
        console.log(res);
        if (res.status === 200) {
          this.handleClose();
          this.props.onPasswordReset(
            'User has been emailed link to enter a new password'
          );
        } else {
          this.props.onPasswordReset('Error in reset password response');
        }
      })
      .catch(err => {
        console.log('Error resetting password, error:');
        console.log(err);
        this.props.onPasswordReset('Error resetting users password');
      });
  };

  handleDeleteUser = async () => {
    const formData = {
      _csrf: await NextAuth.csrfToken(),
      userId: this.state.user._id
    };
    fetch('/admin/delete', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        console.log('Delete User res:');
        console.log(res);
        if (res.status === 200) {
          this.handleClose();
          this.props.onDelete('Deleted User');
        }
      })
      .catch(err => {
        console.log('Error deleting user, error:');
        console.log(err);
        this.props.onDelete('Error deleting user');
      });
  };

  render() {
    return (
      <React.Fragment>
        <Button onClick={this.handleOpen}>Actions</Button>
        <Menu
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handlePasswordReset}>Reset Password</MenuItem>
          <MenuItem onClick={this.handleDeleteUser}>Delete User</MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

// export class Table extends React.Component {
//   render() {
//     if (typeof window === 'undefined')
//       return <p>This page requires JavaScript.</p>;
//
//     if (!this.props.data || this.props.data.length < 1) return <Loader />;
//
//     const numberTo =
//       this.props.options.page * this.props.options.sizePerPage <
//       this.props.totalSize
//         ? this.props.options.page * this.props.options.sizePerPage
//         : this.props.totalSize;
//     const numberFrom = numberTo - this.props.data.length + 1;
//     return (
//       <React.Fragment>
//         <BootstrapTable
//           pagination
//           hover
//           bordered={false}
//           remote={true}
//           data={this.props.data}
//           fetchInfo={{ dataTotalSize: this.props.totalSize }}
//           options={this.props.options}
//         >
//           <TableHeaderColumn isKey dataField="_id">
//             ID
//           </TableHeaderColumn>
//           <TableHeaderColumn dataField="name">Name</TableHeaderColumn>
//           <TableHeaderColumn dataField="email">Email</TableHeaderColumn>
//         </BootstrapTable>
//         <p className="mt-2 text-muted text-right">
//           Displaying{' '}
//           <strong>
//             {numberFrom}-{numberTo}
//           </strong>{' '}
//           of <strong>{this.props.totalSize}</strong>
//         </p>
//       </React.Fragment>
//     );
//   }
// }
