import React from "react";
import ScrollMenu from "./ScrollMenu";
import Button from "@material-ui/core/Button";
import withToast from "./Toasts";
const electron = window.require("electron");

const SubmitButton = props => {
  return (
    <Button
      className="Button"
      variant="contained"
      type="submit"
      disabled={props.isDisabled}
    >
      Submit
    </Button>
  );
};

const SubmitButtonWithToast = withToast(
  SubmitButton,
  "Your filter has been registered!"
);

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableToFilter: "",
      tableFields: [],
      fieldToFilter: "",
      fieldToFilterType: "",
      filteredFields: [],
      operator: "",
      userEntered: "",
      selectedFields: [],
      selectedModels: [],
      availableFilters: [],
      //we should be able to add a few more options here
      fieldFilterOptions: {
        equals: "=",
        "does not equal": "<>",
        "is before": "<",
        "is after": ">",
        "is less than": "<",
        "is greater than": ">"
      }
    };
    this.handleSelectedTable = this.handleSelectedTable.bind(this);
    this.handleSelectedField = this.handleSelectedField.bind(this);
    this.handleFieldFiltering = this.handleFieldFiltering.bind(this);
    this.handleUserEntry = this.handleUserEntry.bind(this);
    this.handleSubmitQuery = this.handleSubmitQuery.bind(this);
  }

  handleSelectedTable(table) {
    let tableFields = [];
    this.state.selectedModels.forEach(model => {
      if (table === model.model_name) {
        tableFields = tableFields.concat(model.fields);
      }
    });
    this.setState({
      tableToFilter: table,
      tableFields
    });
  }

  handleSelectedField(field) {
    const fieldToFilter = this.state.selectedFields.filter(
      globalField => globalField.field_name === field
    )[0];
    const availableFilters =
      fieldToFilter.field_type === "integer" ||
      fieldToFilter.field_type === "decimal" ||
      fieldToFilter.field_type === "date" ||
      fieldToFilter.field_type === "year"
        ? Object.keys(this.state.fieldFilterOptions)
        : ["equals", "does not equal"];
    this.setState({
      availableFilters,
      fieldToFilter: field,
      fieldToFilterType: fieldToFilter.field_type
    });
  }

  handleFieldFiltering(operator) {
    const fieldToFilter = `${this.state.fieldToFilter} ${
      this.state.fieldFilterOptions[operator]
    }`;
    this.setState({
      fieldToFilter,
      operator
    });
  }

  //it is not ideal that we would have a user entry field, but I wasn't sure how to handle this right now
  //hopefully we can get rid of this eventually (or replace with predictive searching!)
  //a few choices (show all distinct values, for example), but dependent on data type - does not appear that it's possible to identify data type of column using squel.js
  handleUserEntry(event) {
    const userEntered = event.target.value;
    this.setState({
      userEntered
    });
  }

  handleSubmitQuery(event) {
    event.preventDefault();
    const fieldToFilter = `${this.state.tableToFilter}.${
      this.state.fieldToFilter
    } ${
      this.state.fieldToFilterType === "integer" ||
      this.state.fieldToFilterType === "decimal" ||
      this.state.fieldToFilterType === "year"
        ? `${this.state.userEntered}`
        : `'${this.state.userEntered}'`
    }`;
    const filteredFields = [...this.state.filteredFields];
    filteredFields.push(fieldToFilter);
    const where = filteredFields.join(" AND ");
    electron.remote.getGlobal("sharedObj").currQuery.where = where;
    this.setState({
      userEntered: "",
      fieldToFilter: "",
      filteredFields
    });
  }

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
    this.setState({
      selectedFields,
      selectedModels
    });
  }

  render() {
    console.log("STATE", this.state);
    return (
      <div className="Min-height-75 Title Column Center Width-50">
        <div className="Display Column Center">
          {
            //step #1 - select table from tables previously selected - right now, this is only one b/c join feature is not written
          }
          <h3>SELECT TABLE TO FILTER</h3>
          <ScrollMenu
            items={this.state.selectedModels.map(model => model.model_name)}
            handleChange={this.handleSelectedTable}
          />
          {
            //step #2 - once table has been selected, render all previously selected fields from that table for selection
          }
          {this.state.tableToFilter ? (
            <div className="">
              <h3>SELECT FIELD TO FILTER</h3>
              <ScrollMenu
                items={this.state.tableFields}
                handleChange={this.handleSelectedField}
              />
            </div>
          ) : null}
        </div>
        <div>
          {
            //step #3 - once field has been selected, select field filtering operator
          }
          {this.state.fieldToFilter ? (
            <div className="Margin-top-3">
              <ScrollMenu
                items={this.state.availableFilters}
                handleChange={this.handleFieldFiltering}
              />
            </div>
          ) : null}
        </div>
        <div className="Row Align-self-center">
          {
            //step #4 - once operator has been selected, enter and submit user input
          }
          {this.state.operator ? (
            <div className="Row">
              <form onSubmit={this.handleSubmitQuery}>
                <div className="Margin-top-5 ">
                  <input
                    className="Input"
                    onChange={this.handleUserEntry}
                    type="text"
                    value={this.state.userEntered}
                  />
                </div>
                <div className="Margin-top-5">
                  <SubmitButtonWithToast isDisabled={!this.state.userEntered} />
                </div>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Filter;
