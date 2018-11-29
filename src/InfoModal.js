import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import {FaQuestionCircle} from 'react-icons/fa';

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
    width: theme.spacing.unit * 50,
    height: theme.spacing.unit * 30,
    backgroundColor: "white",
    padding: theme.spacing.unit * 4,
    borderRadius: 40,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    height: "40px"
  },
  title: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  grid: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  }
});

class InfoModal extends React.Component {
  state = {
    open: true
  };

  handleClose = () => {
    this.props.closeInfoModal();
    this.setState({ open: false });
  };

  getInfo = () => {
    return [
      {
        title: "Start Your Query",
        message:
          "In this step you can start your query by selecting a table from which to see data and then selecting the specific data fields you would like to see"
      },
      { title: "TBD", message: "TBD" },
      { title: "TBD", message: "TBD" },
      { title: "TBD", message: "TBD" },
      { title: "TBD", message: "TBD" },
      { title: "TBD", message: "TBD" }
    ];
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
                <FaQuestionCircle id="large-info-icon"/>
              <Typography variant="h6" className={classes.title}>
                {this.getInfo()[this.props.activeStep].title}
              </Typography>
              <Typography>
              {this.getInfo()[this.props.activeStep].message}
              </Typography>
              <div className="Row-buttons">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleClose}
                  className={classes.button}
                >
                  Close
                </Button>
              </div>
            </Typography>
          </div>
        </Modal>
      </div>
    );
  }
}

InfoModal.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
export default withStyles(styles)(InfoModal);
