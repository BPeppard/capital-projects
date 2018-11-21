import React from 'react';
import Link from 'next/link';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Page from '../../components/Page';
import Layout from '../../components/Layout';

const styles = theme => ({});

class Index extends Page {
  render() {
    const { classes } = this.props;

    return (
      <Layout session={this.props.session}>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h4" gutterBottom>
              Requests
            </Typography>
          </Grid>
          <Grid item xs={6} align="right">
            <Link href="/requests/new">
              <Button variant="contained" color="primary">
                New Request
              </Button>
            </Link>
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Cost</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </Layout>
    );
  }
}

export default withStyles(styles)(Index);
