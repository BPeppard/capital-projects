import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Page from '../../components/Page';
import Layout from '../../components/Layout';

const styles = theme => ({
  formControl: {
    marginBottom: 10,
    minWidth: 200
  },
  button: {
    marginRight: 10
  }
});

class NewRequest extends Page {
  constructor(props) {
    super(props);
    this.state = {
      requestId: '{Auto-Generated}',
      requestName: '',
      requestStatus: '',
      totalCityCost: '',
      requestorsName: '',
      requestingDepartment: '',
      requestType: ''
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleCreateRequest = () => {};

  render() {
    const { classes } = this.props;

    return (
      <Layout session={this.props.session}>
        <Typography variant="h4" gutterBottom>
          New Request
        </Typography>
        <Grid container>
          <Grid item xs={6}>
            <div>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Request Id"
                  value={this.state.requestId}
                  onChange={this.handleChange('requestId')}
                  disabled
                />
              </FormControl>
            </div>
            <div>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Request Name"
                  value={this.state.requestName}
                  onChange={this.handleChange('requestName')}
                />
              </FormControl>
            </div>
            <div>
              <FormControl className={classes.formControl}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={this.state.requestStatus}
                  onChange={this.handleChange('requestStatus')}
                >
                  <MenuItem value={1}>Status 1</MenuItem>
                  <MenuItem value={2}>Status 2</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Total City Cost"
                  value={this.state.totalCityCost}
                  onChange={this.handleChange('totalCityCost')}
                  disabled
                />
              </FormControl>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Requestor's Name"
                  value={this.state.requestorsName}
                  onChange={this.handleChange('requestorsName')}
                />
              </FormControl>
            </div>
            <div>
              <FormControl className={classes.formControl}>
                <InputLabel>Requesting Department</InputLabel>
                <Select
                  value={this.state.requestingDepartment}
                  onChange={this.handleChange('requestingDepartment')}
                >
                  <MenuItem value={1}>Department 1</MenuItem>
                  <MenuItem value={2}>Department 2</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl className={classes.formControl}>
                <InputLabel>Request Type</InputLabel>
                <Select
                  value={this.state.requestType}
                  onChange={this.handleChange('requestType')}
                >
                  <MenuItem value={1}>Type 1</MenuItem>
                  <MenuItem value={2}>Type 2</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Grid>
        </Grid>
        <Button variant="contained" className={classes.button}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleCreateRequest}
        >
          Create
        </Button>
      </Layout>
    );
  }
}

export default withStyles(styles)(NewRequest);
