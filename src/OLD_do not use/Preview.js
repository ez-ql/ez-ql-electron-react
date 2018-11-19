import React, { Component } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import "./Preview.css";
// import Table from "./Table.js";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedData: [],
      queryString: this.props.squelQuery || "", //unclear where exactly this will be passed down
      sqlPreview: false,
      tablePreview: false
    };
    this.handleExpandClick = this.handleExpandClick.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on("async-query-reply", (event, arg) => {
      this.setState({ selectedData: arg });
    });
  }

  //potential efficiency issue:
  //in order to display the number of rows and columns I understand
  //that we'll have to query the database, the option to toggle the
  //preview and/or only show the first 10 rows therefore becomes a pure UX feature with the goal not to overwhelm the user

  handleExpandClick(name) {
    this.setState({ [name]: !this.state[name] });
  }

  render() {
    const numOfInstances = this.state.selectedData.length;
    const numOfFields = this.props.numOfFields;

    return (
      <div>
        <div className="header flex-row">
          <div className="volume">
            <div>Instances (rows): {numOfInstances}</div>
            <div>Fields (columns): {numOfFields}</div>
          </div>

          <div
            className={
              this.state.tablePreview
                ? "togglePreview expanded"
                : "togglePreview"
            }
            name="tablePreview"
            onClick={() => this.handleExpandClick("tablePreview")}
            aria-expanded={this.state.tablePreview}
            aria-label="Show table preview"
          >
            Preview data
            <IconButton>
              <ExpandMoreIcon
                className={this.state.tablePreview ? "expandIconOpen" : ""}
              />
            </IconButton>
          </div>
          <div
            className={
              this.state.sqlPreview ? "togglePreview expanded" : "togglePreview"
            }
            name="tablePreview"
            onClick={() => this.handleExpandClick("sqlPreview")}
            aria-expanded={this.state.sqlPreview}
            aria-label="Show SQL query"
          >
            Show SQL query
            <IconButton>
              <ExpandMoreIcon
                className={this.state.sqlPreview ? "expandIconOpen" : ""}
              />
            </IconButton>
          </div>
        </div>
        <div className="expandedInfo">
          {this.state.sqlPreview ? (
            <div>{this.props.squelQuery}</div>
          ) : (
            this.state.tablePreview && <div>test</div>
          )}
        </div>
      </div>
    );
  }
}

export default Preview;
