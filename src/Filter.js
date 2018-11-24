import React from "react";
import ScrollMenu from "./ScrollMenu";
const electron = window.require("electron");

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableToFilter: "",
      tableFields: [],
      fieldToFilter: "",
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
    const selectedTable = table;
    const models = electron.remote.getGlobal("sharedObj").models;
    const fields = models
      .filter(globalModel => globalModel.model_name === selectedTable)[0]
      .fields.map(field => field.field_name);
    const selectedFields = this.state.selectedFields.map(
      field => field.field_name
    );
    const filteredFields = fields.filter(field =>
      selectedFields.includes(field)
    );
    this.setState({
      tableToFilter: selectedTable,
      tableFields: filteredFields
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
      fieldToFilter: field
    });
  }

  handleFieldFiltering(operator) {
    const fieldToFilter = `${this.state.fieldToFilter} ${operator}`;
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
    } ${this.state.userEntered}`;
    const filteredFields = [...this.state.filteredFields];
    filteredFields.push(fieldToFilter);
    const mainModel = electron.remote.getGlobal("sharedObj").currQuery.from;
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
    const models = globalObj.models;
    const currQuery = globalObj.currQuery;
    const selectedModels = [...currQuery.addedTables];
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
        <div>
          {
            //step #1 - select table from tables previously selected - right now, this is only one b/c join feature is not written
          }
          <h3>Select table to filter</h3>
          <ScrollMenu
            items={this.state.selectedModels}
            handleChange={this.handleSelectedTable}
          />
          {
            //step #2 - once table has been selected, render all previously selected fields from that table for selection
          }
          {this.state.tableToFilter ? (
            <div>
              <h3>Select field from that table to filter</h3>
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
            <div>
              <ScrollMenu
                items={this.state.availableFilters}
                handleChange={this.handleFieldFiltering}
              />
            </div>
          ) : null}
        </div>
        <div>
          {
            //step #4 - once operator has been selected, enter and submit user input
          }
          {this.state.operator ? (
            <div>
              <form onSubmit={this.handleSubmitQuery}>
                <input
                  onChange={this.handleUserEntry}
                  type="text"
                  value={this.state.userEntered}
                />
                <button type="submit">Submit</button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Filter;
