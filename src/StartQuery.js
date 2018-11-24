import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';

const electron = window.require("electron");
const sharedObject = electron.remote.getGlobal('sharedObj')

class StartQuery extends Component {
  state = {
    models: []
  };

  componentDidMount() {
    const models = sharedObject.models
    console.log('**********HERE*******')
    console.log('MODELS', models)
    this.setState({ models })
  }

  addModel(modelName) {
    const selectedModel = sharedObject.models.find(
      model => model.model_name === modelName
    );
    electron.remote.getGlobal('sharedObj').currQuery.selectedModel = selectedModel;
    electron.remote.getGlobal('sharedObj').currQuery.from = modelName;
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
    console.log('shared', sharedObject)
    const models = this.state.models;
    let modModels;
    models.length
      ? (modModels = this.formatModelAndFieldNames(
          models.map(elem => elem.model_name)
        ))
      : console.log("no models yet");

    return (
      <div className="Height-40 Title Column Center Width-50">
        <div className="Column Center Height-20">
          <div className="Flex-End Column ">
            <h1 className='Grey'>SELECT A TABLE</h1>
          </div>
        </div>
        <div className="Row-buttons Flex-Wrap">
          {models.length > 0
            ? models.map(model => {
              return (
                <div>
                  <Button
                    onClick={() => this.addModel(model.model_name)}
                    className="Row-buttons Button"
                    component={Link}
                    to="/makeQuery"
                  >
                    {model.model_name}
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
