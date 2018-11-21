import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Aggregate from "./Aggregate";
import Joins from "./Joins";
import Filter from "./Filter";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  dialog: {
    width: "80vw",
    minHeight: "80vh",
    maxHeight: "80vh"
  }
};

class FormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      step: "joins"
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleNext = event => {
    console.log(event.target);
    event.target.value === "joins"
      ? this.setState({ step: "aggregate" })
      : this.setState({ step: "filter" });
  };

  render() {
    const { classes } = this.props
    return (
      <div>
        <Button onClick={this.handleClickOpen}>Next</Button>
        <Dialog
          className="dialog"
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          classes={{ paper: classes.dialog }}
        >
          {this.state.step === "joins" ? (
            <div>
              <Joins />
              <button value="joins" onClick={this.handleNext}>
                Aggregate
              </button>
            </div>
          ) : this.state.step === "aggregate" ? (
            <div>
              <Aggregate />
              <button value="aggregate" onClick={this.handleNext}>
                Filter
              </button>
            </div>
          ) : (
            <div>
              <Filter />
              <button value="filter" onClick={this.handleNext}>
                Done
              </button>
            </div>
          )}
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(FormDialog);
