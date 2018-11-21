import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Page from '../../components/Page';
import Layout from '../../components/Layout';

const styles = theme => ({});

class NewRequest extends Page {
  render() {
    const { classes } = this.props;

    return (
      <Layout session={this.props.session}>
        <Typography variant="h4" gutterBottom>
          New Request
        </Typography>
      </Layout>
    );
  }
}

export default withStyles(styles)(NewRequest);
