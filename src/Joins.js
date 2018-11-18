import React, { Component } from "react";
import squel from "squel";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

//this can be a component joining additional tables to existing data set
//vision:
//show all tables that are not included in data set thus far
//user selects initial table, somehow selects which fields to join on, and selects type of join (we will need to figure out how to phrase this)
//can include ScrollMenu component
//assumptions:
//data passed to component from previous components as props

class Joins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      on: ""
    };
  }
  render() {
    return <h1>PLACEHOLDER</h1>;
  }
}

export default Joins;
