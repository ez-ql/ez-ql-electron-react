import React, { Component } from "react";
import squel from "squel";
import Aggregate from "./Aggregate";
import Filter from "./Filter";
import Joins from "./Joins";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

//this will be a re-usable component for beginning the aggregates and filtering process
//vision:
//with each refinement, the selected object will hold all tables selected and its respective fields
//assumptions:
//data and/or query passed to component from previous components as props
class RefineQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {},
      tables: [],
      fields: [],
      agg: false,
      filter: false,
      anotherTable: false,
      selectedData: this.props.selectedData
    };
  }

  componentDidMount() {
    const selectedTable = this.props.query.split("FROM")[1].slice(1);
    const selectedFields = this.props.query
      .split("FROM")[0]
      .slice(7, -1)
      .split(", ");
    const updatedSelected = { ...this.state.selected };
    updatedSelected[selectedTable] = selectedFields;
    this.setState({
      //may not need the tables and fields keys - we can just use selected I think
      tables: [...this.state.tables, selectedTable],
      fields: [...this.state.fields].concat(selectedFields),
      selected: updatedSelected
    });
  }

  render() {
    return this.state.agg ? (
      <Aggregate
        tables={this.state.tables}
        fields={this.state.fields}
        query={this.props.query}
        selected={this.state.selected}
      />
    ) : this.state.filter ? (
      <Filter
        tables={this.state.tables}
        fields={this.state.fields}
        query={this.props.query}
        selected={this.state.selected}
      />
    ) : this.state.anotherTable ? (
      <Joins
        tables={this.state.tables}
        fields={this.state.fields}
        query={this.props.query}
        selected={this.state.selected}
      />
    ) : (
      <div>
        <h1>Refine Your Selection</h1>
        <h3>Aggregates, Filters, and Joins</h3>
        <button
          type="button"
          onClick={() => this.setState({ agg: !this.state.agg })}
        >
          Aggregates
        </button>
        <button
          type="button"
          onClick={() => this.setState({ filter: !this.state.filter })}
        >
          Filter
        </button>
        {
          //we should be careful with the button below - we need to gray out or remove the buttons for the tables they've already selected...unless we want to enable self-referencing joins//
        }
        <button
          type="button"
          onClick={() =>
            this.setState({ anotherTable: !this.state.anotherTable })
          }
        >
          Select Data from Another Table
        </button>
      </div>
    );
  }
}

export default RefineQuery;
