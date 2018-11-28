import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import PreviewTabs from "./PreviewTabs";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

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
  }
});

class PreviewModal extends React.Component {
  state = {
    open: false,
    data: [],
    numFields: 0,
    numRows: 0,
    sqlQuery: ""
  };

  componentDidMount() {
    ipcRenderer.on("async-query-reply", () => {
      // console.log('here')
      const data = electron.remote.getGlobal("sharedObj").data;
      this.setState({
        data: data,
        numFields: electron.remote.getGlobal("sharedObj").currQuery
          .qualifiedFields.length,
        numRows: data.length,
        sqlQuery: electron.remote.getGlobal("sharedObj").sqlQuery
      });
    });
  }

  // componentWillUnmount() {
  //   ipcRenderer.removeAllListeners();
  // }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        {this.props.buttonClass ? (
          <Button
            variant="contained"
            className={this.props.buttonClass}
            className="Button"
            color={this.props.color}
            onClick={this.handleOpen}
          >
            Preview
          </Button>
        ) : (
          <Button
            variant="contained"
            className="Button"
            color={this.props.color}
            onClick={this.handleOpen}
          >
            Preview
          </Button>
        )}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            {/* <Typography variant="h6" id="modal-title">Preview</Typography> */}
            <Typography variant="subtitle1" id="modal-preview">
              <PreviewTabs props={{ ...this.state }} preview={true} />
            </Typography>
          </div>
        </Modal>
      </div>
    );
  }
}

PreviewModal.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
export default withStyles(styles)(PreviewModal);
