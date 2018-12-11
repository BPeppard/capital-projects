import React from 'react';
import Link from 'next/link';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import Page from '../../components/Page';
import Layout from '../../components/Layout';
import RequestType from '../../models/requestType';

const styles = theme => ({
  formControl: {
    marginBottom: 10,
    minWidth: 200
  }
});

class RequestTypePage extends Page {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      displayText: '',
      codeValue: ''
    };
  }

  async componentDidMount() {
    await this.updateData();
  }

  updateData = async () => {
    this.setState({
      requestTypes: await RequestType.all()
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleCancel = () => {
    this.setState({ displayText: '', codeValue: '' });
    this.handleDialogClose();
  };

  handleCreateRequestType = () => {
    this.handleDialogClose();
  };

  render() {
    const { classes } = this.props;

    return (
      <Layout session={this.props.session}>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h4" gutterBottom>
              Request Types
            </Typography>
          </Grid>
          <Grid item xs={6} align="right">
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleDialogOpen}
            >
              New Request Type
            </Button>
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Display Value</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
        </Table>
        <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
          <DialogTitle>Request Type</DialogTitle>
          <DialogContent>
            <div>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Display Text"
                  value={this.state.displayText}
                  onChange={this.handleChange('displayText')}
                />
              </FormControl>
            </div>
            <div>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Value"
                  value={this.state.codeValue}
                  onChange={this.handleChange('codeValue')}
                />
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleCancel}>
              Cancel
            </Button>
            <Button color="primary" onClick={this.handleCreateRequestType}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    );
  }
}

export default withStyles(styles)(RequestTypePage);
