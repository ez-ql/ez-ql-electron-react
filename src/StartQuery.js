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

  render() {
    const models = this.state.models;

    return (
      <div className="Height-80 Title Column">
        <div className="Column Center Height-50">
          <div className="Flex-End Column ">
            <h1>Select a table</h1>
          </div>
        </div>
        <div className="Row-buttons Flex-Wrap">
          {models.length > 0
            ? models.map(model => {
                return (
                  <div
                    key={model.model_id}
                    onClick={() => {
                      window
                        .require("electron")
                        .remote.getGlobal("sharedObj").currQuery.from =
                        model.model_name;
                    }}
                  >
                    <Link
                      to={{
                        pathname: "/makeQuery",
                        state: { model: model.model_name }
                      }}
                    >
                      <button className="Button">{model.model_name}</button>
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
