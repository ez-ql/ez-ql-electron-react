import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const getColumns = fieldsArray => {
  return fieldsArray.map(field => ({ dataField: field, text: field }));
};

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      rows: []
    };
  }

  componentDidMount() {
    ipcRenderer.on("async-query-reply", (event, arg) => {
      console.log("***arg", arg);
      this.setState({ rows: arg, fields: Object.keys(arg[0]) });
    });
  }

  render() {
    const limit = this.props.limit;
    console.log("**state with fields and rows", this.state);
    const columns = getColumns(this.state.fields);

    return (
      <div className="table">
        {this.state.fields.length > 0 ? (
          <BootstrapTable
            keyField="id"
            data={this.state.rows}
            columns={columns}
            bordered={false}
            noDataIndication="Table is Empty"
          />
        ) : (
          "No data selected"
        )}
      </div>
    );
  }
}

export default Table;
