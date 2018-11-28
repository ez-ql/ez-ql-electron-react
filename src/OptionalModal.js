import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

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
    width: theme.spacing.unit * 100,
    height: theme.spacing.unit * 60,
    backgroundColor: "white",
    padding: theme.spacing.unit * 4,
    borderRadius: 40
  },
  button: {
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit
  }
});

class OptionalModal extends React.Component {
  state = {
    open: true
  };

  handleClose = () => {
    this.props.toggleOptionalModal();
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
            <Typography variant="subtitle1" id="simple-modal-description">
              The following steps are optional. If you have the data you need,
              click finish to view your finalized query. If you would like to
              add another data table or aggregate, filter, and sort any of your
              selected fields, please click continue.
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleClose}
                  className={classes.button}
                >
                  Continue
                </Button>
              </div>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/finalizeQuery"
                  className={classes.button}
                >
                  Finish
                </Button>
              </div>
            </Typography>
          </div>
        </Modal>
      </div>
    );
  }
}

OptionalModal.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
export default withStyles(styles)(OptionalModal);
