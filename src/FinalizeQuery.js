import React from "react";
import Button from "@material-ui/core/Button";
import PreviewTabs from "./PreviewPanel";
import StartOverButton from "./StartOverButton";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

class FinalizeQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModelsAndFields: [],
      data: [],
      numFields: 0,
      numRows: 0,
      sqlQuery: ""
    };
  }

  componentDidMount() {
    ipcRenderer.on("async-query-reply", (event, arg) => {
      this.setState({
        data: arg,
        numFields: Object.keys(arg).length,
        numRows: arg.length,
        sqlQuery: electron.remote.getGlobal("sharedObj").sqlQuery
      });
    });
    const selectedModelsAndFields = electron.remote.getGlobal("sharedObj")
      .currQuery.selectedModelsAndFields;
    this.setState({ selectedModelsAndFields });
  }

  render() {
    return (
      <div className="Flex-Container Width-75 Height-75">
        <div className="Column Center Height-50">
          <h1>COMPLETE YOUR QUERY</h1>
          <div>
            <Button className="Button" value="save">Save</Button>
            <Button className="Button" value="export">Visualize</Button>
            <StartOverButton />
          </div>
          <div>
            <PreviewTabs props={{ ...this.state }} />
          </div>
        </div>
      </div>
    );
  }
}

export default FinalizeQuery;
