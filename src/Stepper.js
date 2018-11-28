import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Aggregate from "./Aggregate";
import Filter from "./Filter";
import Sort from "./Sort";
import { Link } from "react-router-dom";
import StepConnector from "@material-ui/core/StepConnector";
import PreviewModal from "./PreviewModal";
import MakeQuery from './MakeQuery'
import FinalizeQuery from './FinalizeQuery'
import StartQuery from './StartQuery'


const electron = window.require("electron");
const sharedObject = electron.remote.getGlobal("sharedObj");
const ipcRenderer = electron.ipcRenderer;

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: "rgb(181, 228, 228)"
  },
  button: {
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  stepperColor: {
    backgroundColor: "rgb(181, 228, 228)"
  }
});

class HorizontalStepper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      steps: [],
      skipped: new Set(),
      previewExpanded: false,
      selectedModelsAndFields: [],
      startQuery: true,
    };
  }

  componentDidUpdate(prevProps){
    if(prevProps.location.state !== this.props.location.state){
      this.setState({startQuery : false})
    }
  }

  getSteps = () => {
    return ["Select Table and Fields", "Connect a Table", "Aggregate Fields", "Filter by Field Value", "Sort by Field Value", "Finish"];
  };

  handleNext = event => {
    const { activeStep } = this.state;
    let { skipped } = this.state;
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values());
      skipped.delete(activeStep);
    }
    this.setState({
      activeStep: activeStep + 1,
      skipped
    });
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleSkip = () => {
    const { activeStep } = this.state;
    this.setState(state => {
      const skipped = new Set(state.skipped.values());
      skipped.add(activeStep);
      return {
        activeStep: state.activeStep + 1,
        skipped
      };
    });
  };

  isStepSkipped = step => {
    return this.state.skipped.has(step);
  };

  handleSubmit = () => {
    ipcRenderer.send("async-new-query");
  };

  componentDidMount() {
    const steps = this.getSteps();
    const selectedModelsAndFields = electron.remote.getGlobal("sharedObj")
      .currQuery.selectedModelsAndFields;
    this.setState({
      steps,
      selectedModelsAndFields
    });
  }

  render() {
    const { activeStep, steps } = this.state;
    const { classes } = this.props;
    console.log('stepper props', this.props)
    return (
      <div className="Flex-Container Width-100vw Height-50-fixed  ">
        {/* <div className="Column Height-50 Display Center "> */}
           {/* <div> */}
            <div>
              <div>
              <div>
              {activeStep === steps.length ? null : (
                // <div>
                /* <Button value="finalize" component={Link} to="/finalizeQuery">
                  Review Query Results
                </Button>
                <Button value="finalize" component={Link} to="/makeQuery">
                  Revise Table Selection
                </Button> */
                // </div>
                // <div className="Column Display Width-60 ">
                //   <div className="Align-self-center Width-30 Column Min-height-30 ">
                  <div>
                    <div>
                    {
                      activeStep === 0 &&
                      (
                        this.state.startQuery ?
                         <StartQuery /> :
                         <MakeQuery />

                      )
                    }
                    {
                      activeStep === 1 &&
                        <MakeQuery  nextView='true' />
                    }
                    {
                      activeStep === 2 &&
                        <Aggregate />
                    }
                    {
                      activeStep === 3 &&
                        <Filter />
                    }
                    {
                      activeStep === 4 &&
                        <Sort />
                    }
                    {
                      activeStep === 5 &&
                        <FinalizeQuery />
                    }
                  </div>
                  <div className="Display Margin-top-5 Column Width-100 Center Align-self-end ">
                    <div className={classes.root}>
                      <Stepper
                        className={classes.stepperColor}
                        activeStep={activeStep}
                        orientation="horizontal"
                      >
                        {steps.map((label, index) => {
                          const props = {};
                          const labelProps = {};
                          // labelProps.optional = (
                          //   <Typography variant="caption">Optional</Typography>
                          // );
                          if (this.isStepSkipped(index)) {
                            props.completed = false;
                          }
                          return (
                            <Step key={label} {...props}>
                              <StepLabel
                                {...labelProps}
                                classes={{
                                  iconContainer: classes.iconContainer
                                }}
                              >
                                {label}
                              </StepLabel>
                            </Step>
                          );
                        })}
                      </Stepper>
                    </div>
                  </div>
                  <div className="Row-buttons Margin-top-1">
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        variant="contained"
                        color="primary"
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        Back
                      </Button>
                    </div>
                    <div>
                      <Button
                        disabled={activeStep === 5}
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                        className={classes.button}
                      >
                        Next
                      </Button>
                    </div>
                    <div>
                      <Button
                        // disabled={activeStep === 0}
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/finalizeQuery"
                        onClick={this.handleSubmit}
                        className={classes.button}
                      >
                        Finish
                      </Button>
                      {/* <div>
                        <PreviewModal
                          variant="contained"
                          color="primary"
                          buttonClass={classes.button}
                          onClick={this.loadPreview}
                        />
                      </div> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(HorizontalStepper);
