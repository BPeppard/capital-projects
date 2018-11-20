import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Link from 'next/link';

import Page from '../components/Page';
import Layout from '../components/Layout';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20
  }
});

class Index extends Page {
  render() {
    const { classes } = this.props;

    return (
      <Layout session={this.props.session}>
        <Typography variant="h4" gutterBottom>
          Home Page
        </Typography>
      </Layout>
    );
  }
}

export default withStyles(styles)(Index);
