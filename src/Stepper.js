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
import MakeQuery from "./MakeQuery";
import FinalizeQuery from "./FinalizeQuery";
import StartQuery from "./StartQuery";
import OptionalModal from "./OptionalModal";
import FiberManualRecord from "@material-ui/icons";
import StartModal from "./StartModal";
import { FaQuestionCircle } from "react-icons/fa";
import InfoModal from "./InfoModal";

const electron = window.require("electron");
const sharedObject = electron.remote.getGlobal("sharedObj");
const ipcRenderer = electron.ipcRenderer;

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: "rgb(216, 249, 253)"
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
    backgroundColor: "rgb(216, 249, 253)"
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
      optionalModal: false,
      optionalModalViewed: false,
      startModal: true,
      startModalViewed: false,
      infoModal: false,
      shake: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.state !== this.props.location.state) {
      this.setState({ startQuery: false });
    }
  }

  getSteps = () => {
    return [
      "Select Table and Fields",
      "Connect a Table",
      "Aggregate Fields",
      "Filter by Field Value",
      "Sort by Field Value",
      "Finish"
    ];
  };

  handleNext = event => {
    const { activeStep, optionalModalViewed } = this.state;
    console.log("activeStep", activeStep);
    if (activeStep === 4) {
      this.handleSubmit();
    }
    let { skipped } = this.state;
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values());
      skipped.delete(activeStep);
    } else if (activeStep === 0 && optionalModalViewed === false) {
      this.setState({
        activeStep: activeStep + 1,
        optionalModal: true,
        optionalModalViewed: true,
        skipped
      });
    } else {
      this.setState({
        activeStep: activeStep + 1,
        skipped
      });
    }
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
    this.setState({ activeStep: 5 });
  };

  toggleOptionalModal = () => {
    this.setState({
      optionalModal: false
    });
  };

  loadPreview = event => {
    console.log("shared object", electron.remote.getGlobal("sharedObj"));
    ipcRenderer.send("async-new-query");
  };

  toggleStartModal = () => {
    this.setState({
      startModal: false,
      startModalViewed: true,
      shake: true
    });
  };

  openInfoModal = () => {
    this.setState({
      infoModal: true
    });
  };

  closeInfoModal = () => {
    console.log("here in closeInfoModal");
    this.setState({
      infoModal: false
    });
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
    console.log("infoModal", this.state.infoModal);
    console.log("startModal", this.state.startModal);
    return (
      <div className="Flex-Container Width-75  Height-50-fixed Margin-top-5 ">
        <div>
          {activeStep === steps.length ? null : (
            <div>
              <div className="Column Height-30-fixed">
                {activeStep === 0 &&
                  (this.state.startQuery ? (
                    <div className="Column Height-30-fixed">
                      {this.state.startModal && (
                        <StartModal toggleStartModal={this.toggleStartModal} />
                      )}
                      <StartQuery shake={this.state.shake} />
                    </div>
                  ) : (
                    <MakeQuery />
                  ))}
                {activeStep === 1 && (
                  <div>
                    {this.state.optionalModal && (
                      <OptionalModal
                        toggleOptionalModal={this.toggleOptionalModal}
                      />
                    )}
                    <MakeQuery nextView="true" />
                  </div>
                )}
                {activeStep === 2 && <Aggregate />}
                {activeStep === 3 && <Filter />}
                {activeStep === 4 && <Sort />}
                {activeStep === 5 && <FinalizeQuery />}
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
                <div className="">
                  <Button
                    disabled={activeStep === 0}
                    variant="contained"
                    color="secondary"
                    onClick={this.handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                </div>
                <div>
                  <Button
                    disabled={
                      activeStep === 5 ||
                      !electron.remote.getGlobal("sharedObj").currQuery.from
                    }
                    variant="contained"
                    color="secondary"
                    onClick={this.handleNext}
                    className={classes.button}
                  >
                    Next
                  </Button>
                </div>
                <div>
                  <Button
                    disabled={this.state.startQuery || activeStep === 5}
                    variant="contained"
                    color="secondary"
                    onClick={this.handleSubmit}
                    className={classes.button}
                  >
                    Finish
                  </Button>
                </div>
                {activeStep !== 5 && (
                  <div onClick={this.loadPreview}>
                    <PreviewModal />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="info">
          {this.state.infoModal && (
            <InfoModal
              activeStep={this.state.activeStep}
              closeInfoModal={this.closeInfoModal}
            />
          )}
          <FaQuestionCircle
            id="info-icon"
            className="info-icon"
            onClick={this.openInfoModal}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(HorizontalStepper);
