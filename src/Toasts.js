import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2
  }
});

const withToast = Component => {
  class Toasts extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false
      };
    }

    handleClick = () => {
      this.setState({ open: true });
    };

    handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }

      this.setState({ open: false });
    };

    render() {
      const { classes } = this.props;
      return (
        <div>
            <span onClick={this.handleClick}><Component /></span>
          {/* <Button >Submit</Button> */}
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={this.state.open}
            autoHideDuration={3000}
            onClose={this.handleClose}
            ContentProps={{ "aria-describedby": "message-id" }}
            message={<span id="message-id">Success!</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        </div>
      );
    }
  }

  Toasts.PropTypes = {
    classes: PropTypes.object.isRequired
  };
  return withStyles(styles)(Toasts);
};

export default withToast;
