import React, { Component } from "react";
import squel from "squel";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

//this can be a component handle data aggregations
//vision:
//user somehow selects aggregate (min/max/count/groupBy...)
//we run adjusted query against db and return aggregated data
//assumptions:
//data passed to component from previous components as props

class Aggregate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agg: "",
      groupBy: "",
      having: ""
    };
  }
  render() {
    return <h1>PLACEHOLDER</h1>;
  }
}

export default Aggregate;
