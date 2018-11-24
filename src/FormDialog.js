import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Aggregate from "./Aggregate";
import Joins from "./Joins";
import Filter from "./Filter";
import { withStyles } from "@material-ui/core/styles";
import { Link } from 'react-router-dom'

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

  componentDidMount() {

  }

  handleClickOpen = () => {
    this.props.onClick();
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
        <Button className='Button Row-buttons' onClick={this.handleClickOpen}>Next</Button>
        {/* <button className='Button Row-buttons' onClick={this.handleClickOpen}>Next</button> */}
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
              <Button value="joins" onClick={this.handleNext}>
                Aggregate
              </Button>
            </div>
          ) : this.state.step === "aggregate" ? (
            <div>
              <Aggregate />
              <Button value="aggregate" onClick={this.handleNext}>
                Filter
              </Button>
            </div>
          ) : (
                <div>
                  <Filter />
                  <Button value="filter" >
                    Finalize
              </Button>
                </div>
              )
          }
          {/* testing finalize button */}
          <div>
            <Button
              value="finalize"
              component={Link}
              to="/finalizeQuery"
            >
              Finalize
          </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(FormDialog);
