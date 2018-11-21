import React, { Component } from "react";
import MakeQuery from "./MakeQuery";
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

  handleChange = evt => {
    evt.preventDefault();
    this.setState({ from: evt.target.value });
  };

  render() {
    const models = this.state.models;
    const handleChange = this.handleChange;
    console.log('state', this.state.models)

    return (
      <div className="Title Height-80">
        <div className="Column Center Height-50">
          <div className="Flex-End Column">
            Select a table to start your request
          </div>
        </div>
        <div className="Row-buttons">
          {models.length > 0
            ? models.map(model => {
                return (
                  <div>
                    <Link
                      to="/makeQuery"
                      render={routeProps => (
                        <MakeQuery {...routeProps} model={model.model_name} />
                      )}
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
