import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

class MySnackbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open,
      message: this.props.message
    };
  }

  handleClose = () => {
    this.setState({
      open: false
    });
    this.props.onClose();
  };

  componentDidUpdate = prevProps => {
    if (this.props.open !== this.state.open) {
      this.setState({ open: this.props.open });
    }
  };

  render() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={this.state.open}
        autoHideDuration={3000}
        onClose={this.handleClose}
        message={this.props.message}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    );
  }
}

export default MySnackbar;
