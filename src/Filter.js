import React from "react";
import ScrollMenu from "./ScrollMenu";
import squel from "squel";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableToFilter: "",
      tableFields: [],
      fieldToFilter: "",
      query: this.props.query,
      selected: this.props.selected,
      operator: "",
      userEntered: "",
      selectedData: {},
      submitted: false,
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
    this.handleSubmitQuery = this.handleSubmitQuery.bind(this);
    this.handleUserEntry = this.handleUserEntry.bind(this);
  }

  componentDidMount() {
    //was able to see the reply in the console after a delay
    ipcRenderer.on("async-query-reply", (event, arg) => {
      this.setState({ selectedData: arg });
      console.log("***********", this.state.selectedData);
    });
  }

  handleSelectedTable(selected) {
    let selectedTable = selected;
    this.setState({
      tableToFilter: selectedTable,
      tableFields: this.state.selected[selectedTable]
    });
  }

  handleSelectedField(selected) {
    let selectedField = selected;
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
    console.log("WE ARE HERE");
  }

  render() {
    console.log("CURRENT QUERY", this.state.query);
    const selected = this.props.selected;
    const allTables = Object.keys(selected);

    return (
      <div>
        <div>
          <h3>Select table to filter</h3>
          <ScrollMenu
            items={allTables}
            handleChange={this.handleSelectedTable}
          />
          {this.state.tableToFilter ? (
            <div>
              <h3>Select field from that table to filter</h3>
              <ScrollMenu
                items={selected[this.state.tableToFilter]}
                handleChange={this.handleSelectedField}
              />
            </div>
          ) : null}
        </div>
        <div>
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
