import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const electron = window.require("electron");
const sharedObject = electron.remote.getGlobal("sharedObj");

const styles = theme => ({
  button: {
    marginRight: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit
  }
});

class StartQuery extends Component {
  state = {
    models: [],
    shake: false
  };

  componentDidMount() {
    const models = electron.remote.getGlobal("sharedObj").models;
    console.log("**********HERE*******");
    console.log("MODELS", models);
    this.setState({ models });
  }

  addModel(modelName) {
    console.log("modelName", modelName);
    electron.remote.getGlobal(
      "sharedObj"
    ).currQuery.selectedModelsAndFields = [];
    console.log(
      "SELECTEDMF in CDM",
      electron.remote.getGlobal("sharedObj").currQuery.selectedModelsAndFields
    );
    const selectedModel = electron.remote
      .getGlobal("sharedObj")
      .models.find(model => model.model_name === modelName);

    electron.remote.getGlobal(
      "sharedObj"
    ).currQuery.selectedModel = selectedModel;
    electron.remote.getGlobal("sharedObj").currQuery.from = modelName;

    console.log(
      "selectedModel",
      (electron.remote.getGlobal(
        "sharedObj"
      ).currQuery.selectedModel = selectedModel)
    );
  }

  //func to format field and table names @start of query builder
  //redefined here b/c of unilateral data flow of react
  //method to fix could be to pass func to MakeQuery as props via Link - maybe we could switch to using Route instead
  formatModelAndFieldNames = arr => {
    let fieldDict = {};
    let mod;
    arr.forEach(elem => {
      if (elem.includes("_")) {
        let [first, second] = elem.split("_");
        mod = `${first.charAt(0).toUpperCase()}${first.slice(
          1
        )} ${second.charAt(0).toUpperCase()}${second.slice(1)}`;
      } else {
        mod = `${elem.charAt(0).toUpperCase()}${elem.slice(1)}`;
      }
      fieldDict[elem] = mod;
    });
    return fieldDict;
  };

  render() {
    const models = this.state.models;
    const { classes } = this.props;
    let modModels;
    models.length
      ? (modModels = this.formatModelAndFieldNames(
          models.map(elem => elem.model_name)
        ))
      : console.log("no models yet");
    console.log(
      " ************    SHARED OBJECT **************",
      electron.remote.getGlobal("sharedObj")
    );
    return (
      <div className="Column Title Min-height-50 Align-self-center Margin-top-3">
        <div className="Column Center Height-50">
          <h1 className="Flex-End Column">SELECT A TABLE</h1>
        </div>
        <div
          className={
            this.props.shake
              ? "Start-button Row-buttons Flex-Wrap Center-buttons"
              : "Row-buttons Flex-Wrap Center-buttons"
          }
        >
          {models.length > 0
            ? Object.keys(modModels).map(model => {
                console.log("MODEL IN START QUERY", modModels[model]);
                return (
                  <div className="">
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => this.addModel(model)}
                      className={classes.button}
                      component={Link}
                      to={{
                        pathname: "/refineQuery",
                        state: "false"
                      }}
                    >
                      {modModels[model]}
                    </Button>
                  </div>
                );
              })
            : "Loading..."}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(StartQuery);
