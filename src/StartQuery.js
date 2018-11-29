import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

const electron = window.require("electron");
const sharedObject = electron.remote.getGlobal("sharedObj");

class StartQuery extends Component {
  state = {
    models: []
  };

  componentDidMount() {
    const models = electron.remote.getGlobal("sharedObj").models;
    console.log("**********HERE*******");
    console.log("MODELS", models);
    this.setState({ models });
  }

  addModel(modelName) {
    console.log("modelName", modelName)
    electron.remote.getGlobal("sharedObj").currQuery.selectedModelsAndFields = []
    console.log('SELECTEDMF in CDM', electron.remote.getGlobal("sharedObj").currQuery.selectedModelsAndFields)
    const selectedModel = electron.remote
      .getGlobal("sharedObj")
      .models.find(model => model.model_name === modelName);

      electron.remote
      .getGlobal("sharedObj").currQuery.selectedModel = selectedModel;
      electron.remote
      .getGlobal("sharedObj").currQuery.from = modelName;

      console.log("selectedModel", electron.remote
      .getGlobal("sharedObj").currQuery.selectedModel = selectedModel)
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
<div className="Title Min-height-50 Align-self-center Margin-top-3">
      <div className="Column Center Height-50 ">
          <div className="Column Center Height-50">
            <h1 className=" Flex-End Column">CHOOSE A TABLE TO BEGIN</h1>
          </div>
        </div>
        <div className="Row-buttons Flex-Wrap">
          {models.length > 0
            ? Object.keys(modModels).map(model => {
                console.log("MODEL IN START QUERY", modModels[model]);
                return (
                  <div>
                    <Button
                      onClick={() => this.addModel(model)}
                      className="Row-buttons Button"
                      component={Link}
                      to={{
                        pathname:"/refineQuery",
                        state:'false'
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

export default StartQuery;
