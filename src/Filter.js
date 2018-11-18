import React from "react";
import ScrollMenu from "./ScrollMenu";
import squel from "squel";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

//this is a component for handling the Filter step of the query-builder process
//only handles basic filters right now
//the local state here is attrocious - we can likely cut this down
class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableToFilter: "",
      tableFields: [],
      fieldToFilter: "",
      query: this.props.query,
      selectedTablesAndFields: this.props.selectedTablesAndFields,
      operator: "",
      userEntered: "",
      selectedData: {},
      submitted: false,
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

  componentDidMount() {
    //was able to see the correct filtered reply in the console...after a delay
    ipcRenderer.on("async-query-reply", (event, arg) => {
      this.setState({ selectedData: arg });
      console.log("***********", this.state.selectedData);
    });
  }

  handleSelectedTable(table) {
    let selectedTable = table;
    this.setState({
      tableToFilter: selectedTable,
      tableFields: this.state.selectedTablesAndFields[selectedTable]
    });
  }

  handleSelectedField(field) {
    let selectedField = field;
    let existingQuery = this.state.query;
    this.setState({
      fieldToFilter: selectedField,
      query: existingQuery + " WHERE " + selectedField + " "
    });
  }

  handleFieldFiltering(operator) {
    let existingQuery = this.state.query;
    this.setState({
      operator: this.state.fieldFilterOptions[operator],
      query: existingQuery + this.state.fieldFilterOptions[operator] + " "
    });
  }

  //it is not ideal that we would have a user entry field, but I wasn't sure how to handle this right now
  //hopefully we can get rid of this eventually (or replace with predictive searching!)
  //a few choices (show all distinct values, for example), but dependent on data type - does not appear that it's possible to identify data type of column using squel.js
  handleUserEntry(event) {
    let userEntered = event.target.value;
    this.setState({
      userEntered
    });
  }

  handleSubmitQuery(event) {
    event.preventDefault();
    let existingQuery = this.state.query;
    const newQuery = squel
      .select()
      .from(this.state.tableToFilter)
      .fields(this.state.tableFields)
      .where(
        `${this.state.fieldToFilter} ${this.state.operator} '${
          this.state.userEntered
        }'`
      )
      .toString();
    ipcRenderer.send("async-new-query", newQuery);
    this.setState({
      query: existingQuery + this.state.userEntered,
      userEntered: "",
      submitted: !this.state.submitted
    });
  }

  render() {
    console.log("CURRENT QUERY", this.state.query);
    const selectedTablesAndFields = this.props.selectedTablesAndFields;
    const allTables = Object.keys(selectedTablesAndFields);

    return (
      <div>
        <div>
          {
            //step #1 - select table from tables previously selected - right now, this is only one b/c join feature is not written
          }
          <h3>Select table to filter</h3>
          <ScrollMenu
            items={allTables}
            handleChange={this.handleSelectedTable}
          />
          {
            //step #2 - once table has been selected, render all previously selected fields from that table for selection
          }
          {this.state.tableToFilter ? (
            <div>
              <h3>Select field from that table to filter</h3>
              <ScrollMenu
                items={selectedTablesAndFields[this.state.tableToFilter]}
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
                items={Object.keys(this.state.fieldFilterOptions)}
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
