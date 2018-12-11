import React from 'react';
import Link from 'next/link';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Page from '../../components/Page';
import Layout from '../../components/Layout';

const styles = theme => ({});

class Index extends Page {
  render() {
    const { classes } = this.props;

    return (
      <Layout session={this.props.session}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <List>
          <Link href="/settings/requestType">
            <ListItem button>
              <ListItemText primary="Request Types" />
            </ListItem>
          </Link>
        </List>
      </Layout>
    );
  }
}

export default withStyles(styles)(Index);
