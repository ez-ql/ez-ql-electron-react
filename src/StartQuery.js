import React, { Component } from "react";
import { Link } from "react-router-dom";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

class StartQuery extends Component {
  state = {
    models: []
  };

  componentDidMount() {
    ipcRenderer.send(
      "async-selected-db-schema",
      "SELECT models.model_id, models.model_name, foreignKeys.relatedModel_id, foreignKeys.model_foreign_field , foreignKeys.relatedModel_primary_field FROM models LEFT JOIN foreignKeys on models.model_id = foreignKeys.model_id"
    );
    ipcRenderer.on("async-db-schema-reply", (event, arg) => {
      this.setState({ models: arg });
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners("async-db-schema-reply");
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

    return (
      <div className="Height-80 Title Column">
        <div className="Column Center Height-50">
          <div className="Flex-End Column ">
            <h1>Select a table</h1>
          </div>
        </div>
        <div className="Row-buttons Flex-Wrap">
          {models.length > 0
            ? Object.keys(modModels).map((model, idx) => {
                console.log("***MODEL", model);
                return (
                  // DELETE AFTER MERGE DUE TO BETTER SOLUTION - TESTING ONLY
                  //replace with <div> or incoming solution
                  <div
                    key={idx}
                    onClick={() => {
                      window
                        .require("electron")
                        .remote.getGlobal("sharedObj").currQuery.from = model;
                    }}
                  >
                    <Link
                      to={{
                        pathname: "/makeQuery",
                        state: { model: model }
                      }}
                    >
                      <button className="Button">{modModels[model]}</button>
                    </Link>
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
