import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Joins from "./Joins";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const styles = theme => ({
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 80,
    height: theme.spacing.unit * 50,
    backgroundColor: "white",
    padding: theme.spacing.unit * 4,
    borderRadius: 40,
    "&:focus": {
      outline: 0
    }
  }
});

class JoinModal extends React.Component {
  state = {
    open: true
  };

  handleClose = () => {
    this.props.toggleJoinModal();
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            {/* <Typography variant="h6" id="modal-title">Preview</Typography> */}
            <Typography variant="subtitle1" id="simple-modal-description">
              <Joins handleClose={this.handleClose} />
            </Typography>
          </div>
        </Modal>
      </div>
    );
  }
}

JoinModal.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
export default withStyles(styles)(JoinModal);
