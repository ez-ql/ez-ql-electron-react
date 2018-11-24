import React, { Component } from "react";
import ScrollMenu from "./ScrollMenu";
const electron = window.require("electron");

class Aggregate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableAggregators: ["COUNT", "SUM", "AVG", "MAX", "MIN"],
      selectedFields: [],
      selectedModels: [],
      aggregates: "",
      groupBy: [],
      having: "",
      selectedAggregator: "",
      availableFields: [],
      aggregatedFields: [],
      selectNextAggregator: false
    };
  }

  handleSelectedAggregator = aggregator => {
    const availableFields =
      aggregator === "COUNT"
        ? this.state.selectedFields.map(field => field.field_name)
        : aggregator === "SUM"
        ? this.state.selectedFields
            .filter(
              field =>
                field.field_type === "integer" || field.type === "decimal"
            )
            .map(field => field.field_name)
        : this.state.selectedFields //all other aggregator types, e.g. MAX, MIN, AVG
            .filter(
              field =>
                field.field_type === "integer" ||
                field.field_type === "decimal" ||
                field.field_type === "date" ||
                field.field_type === "year"
            )
            .map(field => field.field_name);
    this.setState({
      selectedAggregator: aggregator,
      availableFields
    });
  };

  handleSelectedFields = field => {
    let parentModel = "";
    electron.remote.getGlobal("sharedObj").models.forEach(model => {
      const filteredFields = model.fields.filter(
        globalField => globalField.field_name === field
      );
      if (
        filteredFields.length &&
        this.state.selectedModels.includes(model.model_name)
      )
        parentModel = model.model_name;
    });
    const aggregatedFields = [...this.state.aggregatedFields];
    aggregatedFields.push(field);
    const groupBy = this.state.selectedFields
      .filter(field => !aggregatedFields.includes(field.field_name))
      .map(field => field.field_name);
    const aggregates =
      this.state.aggregates === ""
        ? `${this.state.selectedAggregator}(${parentModel}.${field})`
        : `${this.state.aggregates}, ${
            this.state.selectedAggregator
          }(${parentModel}.${field})`;
    this.setState({
      aggregatedFields,
      aggregates,
      groupBy
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const fields = [...this.state.groupBy].map(field => {
      let parentModel = "";
      electron.remote.getGlobal("sharedObj").models.forEach(model => {
        const filteredFields = model.fields.filter(
          globalField => globalField.field_name === field
        );
        console.log("selected models", this.state.selectedModels);
        if (
          filteredFields.length &&
          this.state.selectedModels.includes(model.model_name)
        )
          parentModel = model.model_name;
      });
      return `${parentModel}.${field}`;
    });
    fields.push(this.state.aggregates);
    const group = [...this.state.groupBy]
      .map(field => {
        let parentModel = "";
        electron.remote.getGlobal("sharedObj").models.forEach(model => {
          const filteredFields = model.fields.filter(
            globalField => globalField.field_name === field
          );
          if (
            filteredFields.length &&
            this.state.selectedModels.includes(model.model_name)
          )
            parentModel = model.model_name;
        });
        return `${parentModel}.${field}`;
      })
      .join(", ");
    const availableAggregators = this.state.availableAggregators.filter(
      aggregator => aggregator !== this.state.selectedAggregator
    );
    electron.remote.getGlobal("sharedObj").currQuery.qualifiedFields = fields;
    electron.remote.getGlobal("sharedObj").currQuery.group = this.state.groupBy
      .length
      ? group
      : "";
    this.setState({
      availableAggregators,
      selectNextAggregator: true
    });
  };

  handleNextAggregator = event => {
    event.preventDefault();
    this.setState({
      selectedAggregator: "",
      selectNextAggregator: false
    });
  };

  componentDidMount() {
    const globalObj = electron.remote.getGlobal("sharedObj");
    const models = globalObj.models;
    const currQuery = globalObj.currQuery;
    console.log("currQuery", currQuery);
    const selectedModels = [currQuery.addedModel[0].model_name];
    selectedModels.push(currQuery.from);
    let selectedFields = [];
    selectedModels.forEach(model => {
      const fields = models.filter(
        globalModel => globalModel.model_name === model
      )[0].fields;
      const currentSelectedFields = selectedFields.map(
        field => field.field_name
      );
      const filteredFields = fields.filter(
        field =>
          currQuery.fields.includes(field.field_name) &&
          !currentSelectedFields.includes(field.field_name)
      );
      selectedFields = selectedFields.concat(filteredFields);
    });
    this.setState({
      selectedFields,
      selectedModels
    });
  }

  render() {
    return (
      <div>
        <h3>Select Aggregator</h3>
        <ScrollMenu
          items={this.state.availableAggregators}
          handleChange={this.handleSelectedAggregator}
        />
        {this.state.selectedAggregator !== "" ? (
          <div>
            <div>
              <h3>Select Field for {this.state.selectedAggregator}</h3>
              <ScrollMenu
                items={this.state.availableFields}
                handleChange={this.handleSelectedFields}
              />
            </div>
            <div>
              <button onClick={this.handleSubmit} type="submit">
                Submit
              </button>
            </div>
          </div>
        ) : null}
        {this.state.selectNextAggregator ? (
          <div>
            <button onClick={this.handleNextAggregator} type="submit">
              Select Another Aggregator
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Aggregate;
