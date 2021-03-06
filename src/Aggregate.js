import React, { Component } from "react";
import ScrollMenu from "./ScrollMenu";
import Button from "@material-ui/core/Button";
import theme from "./colortheme.js";
import withToast from "./Toasts";
const electron = window.require("electron");

const SubmitButton = props => {
  return (
    <Button
      variant="contained"
      onClick={props.handleSubmit}
      type="button"
      disabled={props.isDisabled}
    >
      Submit
    </Button>
  );
};

const SubmitButtonWithToast = withToast(
  SubmitButton,
  "Your calculation method has been registered!"
);

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
      selectedField: "",
      availableFields: [],
      aggregatedFields: [],
      readyToSubmit: false
    };
  }

  handleSelectedAggregator = aggregator => {
    const availableFields =
      aggregator === "COUNT"
        ? this.state.selectedFields.map(field => field.field_name)
        : aggregator === "SUM" || aggregator === "AVG"
        ? this.state.selectedFields
            .filter(
              field =>
                field.field_type === "integer" || field.field_type === "decimal"
            )
            .map(field => field.field_name)
        : this.state.selectedFields //all other aggregator types, e.g. MAX, MIN
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
      availableFields,
      selectedField: ""
    });
  };

  handleSelectedField = field => {
    let parentModel = "";
    this.state.selectedModels.forEach(model => {
      const filteredFields = model.fields.filter(
        globalField => globalField === field
      );
      filteredFields.length && (parentModel = model.model_name);
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
      selectedField: field,
      readyToSubmit: true,
      aggregatedFields,
      aggregates,
      groupBy
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const fields = [...this.state.groupBy].map(field => {
      let parentModel = "";
      this.state.selectedModels.forEach(model => {
        const filteredFields = model.fields.filter(
          globalField => globalField === field
        );
        filteredFields.length && (parentModel = model.model_name);
      });
      return `${parentModel}.${field}`;
    });
    fields.push(this.state.aggregates);
    const group = [...this.state.groupBy]
      .map(field => {
        let parentModel = "";
        this.state.selectedModels.forEach(model => {
          const filteredFields = model.fields.filter(
            globalField => globalField === field
          );
          filteredFields.length && (parentModel = model.model_name);
        });
        return `${parentModel}.${field}`;
      })
      .join(", ");
    electron.remote.getGlobal("sharedObj").currQuery.qualifiedFields = fields;
    electron.remote.getGlobal("sharedObj").currQuery.group = group.length
      ? group
      : "";
    this.setState({
      selectedAggregator: "",
      selectedField: "",
      readyToSubmit: false
    });
  };

  componentDidMount() {
    const globalObj = electron.remote.getGlobal("sharedObj");
    const currQuery = globalObj.currQuery;
    const models = globalObj.models;
    const selectedModels = currQuery.selectedModelsAndFields;
    let selectedFields = [];
    currQuery.selectedModelsAndFields.forEach(model => {
      const modelDetail = models.filter(
        globalModel => globalModel.model_name === model.model_name
      );
      modelDetail[0].fields.forEach(globalField => {
        if (model.fields.includes(globalField.field_name)) {
          selectedFields.push(globalField);
        }
      });
    });
    let availableAggregators = ["COUNT"];
    selectedFields.forEach(field => {
      if (field.field_type === "integer" || field.field_type === "decimal") {
        if (!availableAggregators.includes("AVG")) {
          availableAggregators = availableAggregators.concat(["AVG", "SUM"]);
          if (!availableAggregators.includes("MAX")) {
            availableAggregators = availableAggregators.concat(["MAX", "MIN"]);
          }
        }
      } else if (field.filed_type === "date" || field.field_type === "year") {
        if (!availableAggregators.includes("MAX")) {
          availableAggregators = availableAggregators.concat(["MAX", "MIN"]);
        }
      }
    });
    this.setState({
      selectedFields,
      selectedModels,
      availableAggregators
    });
  }

  render() {
    return (
      <div className="Min-height-75 Title Column Center Width-50">
        <div className="Display Column Center">
          <h3>SELECT A CALCULATION METHOD</h3>
          <ScrollMenu
            items={this.state.availableAggregators}
            handleChange={this.handleSelectedAggregator}
          />
          {this.state.selectedAggregator !== "" ? (
            <div className="Margin-top-5">
              <div>
                <h3>SELECT FIELD FOR {this.state.selectedAggregator}</h3>
                <ScrollMenu
                  items={this.state.availableFields}
                  handleChange={this.handleSelectedField}
                />
              </div>
            </div>
          ) : null}
          <div className="Margin-top-3">
            <SubmitButtonWithToast
              handleSubmit={this.handleSubmit}
              isDisabled={!this.state.readyToSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Aggregate;
