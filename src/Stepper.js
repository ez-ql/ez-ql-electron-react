import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import PreviewPanel from "./PreviewPanel";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Aggregate from "./Aggregate";
import Filter from "./Filter";
import Sort from "./Sort";
import { Link } from "react-router-dom";
import StepConnector from '@material-ui/core/StepConnector';
import PreviewModal from "./PreviewModal";

const electron = window.require("electron");
const sharedObject = electron.remote.getGlobal("sharedObj");
const ipcRenderer = electron.ipcRenderer;



const styles = theme => ({
  // iconContainer: {
  //   transform: "scale(1.5)"
  // },
  root: {
    width: '90%',
    backgroundColor: "rgb(181, 228, 228)",
  },
  button: {
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  stepperColor: {
    backgroundColor: "rgb(181, 228, 228)",
    // justifyContent: 'flex-end'
    // alignSelf: 'flex-end'
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
      selectedModelsAndFields: []
    };
  }

  getSteps = () => {
    return ["Aggregate Fields", "Filter by Field Value", "Sort by Field Value"];
  };

  handleNext = () => {
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

    return (
      <div className="Flex-Container Width-75 Height-75 Column Center ">
        <div className="Column Height-50 Display Center ">
          <div >
            <div >
              {activeStep === steps.length ? (
                <div>
                  {/* <Button value="finalize" component={Link} to="/finalizeQuery">
                    Review Query Results
                  </Button>
                  <Button value="finalize" component={Link} to="/makeQuery">
                    Revise Table Selection
                  </Button> */}
                </div>
              ) : (
                  <div className='Column Display Width-60 ' >
                    <div className="Align-self-center Width-30 Column Height-22 ">
                      {activeStep === 0 ? (
                        <Aggregate />
                      ) : activeStep === 1 ? (
                        <Filter />
                      ) : (
                            <Sort />
                          )}
                    </div>
                    <div className="Column Width-30 Align-self-center ">
                      <div className={classes.root}>
                        <Stepper
                          className={classes.stepperColor}
                          activeStep={activeStep}
                          orientation="horizontal"
                        >
                          {steps.map((label, index) => {
                            const props = {};
                            const labelProps = {};
                            labelProps.optional = (
                              <Typography variant="caption">Optional</Typography>
                            );
                            if (this.isStepSkipped(index)) {
                              props.completed = false;
                            }
                            return (
                              <Step key={label} {...props}>
                                <StepLabel
                                  {...labelProps}
                                  classes={{ iconContainer: classes.iconContainer }}
                                >
                                  {label}
                                </StepLabel>
                              </Step>
                            );
                          })}
                        </Stepper>
                      </div>
                    </div>
                    <div className="Row-buttons">
                      <div >
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
                      <div >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.handleNext}
                          className={classes.button}
                        >
                          Next
                      </Button>
                      </div>
                      <div >
                        <Button
                          // disabled={activeStep === 0}
                          variant="contained"
                          color="primary"
                          component={Link}
                          to="/finalizeQuery"
                          className={classes.button}
                        >
                          Finish
                    </Button>
                      </div>
                      <div onClick={this.loadPreview}
                      >
                        <PreviewModal buttonClass={classes.button}  color="primary"/>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
        {/* <div
          className="Margin-top Light-blue"
          onClick={event => {
            console.log("*****SHARED OBJECT******", sharedObject);
            //only do this if panel is about to expand
            if (!this.state.previewExpanded) {
              const [
                qualifiedFieldsToAdd
              ] = this.state.selectedModelsAndFields.map(modelAndFields =>
                modelAndFields.fields.map(
                  field => `${modelAndFields.model_name}.${field}`
                )
              );
              const newQualifiedFields = [
                ...sharedObject.currQuery.qualifiedFields,
                ...qualifiedFieldsToAdd
              ];
              sharedObject.currQuery.qualifiedFields = newQualifiedFields;

              ipcRenderer.send("async-new-query");
            }
            this.setState(state => ({
              previewExpanded: !state.previewExpanded
            }));
          }}
        >
          <PreviewPanel />
        </div> */}
      </div>
    );
  }
}

export default withStyles(styles)(HorizontalStepper);
