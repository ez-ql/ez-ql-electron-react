import React from "react";
import Button from "@material-ui/core/Button";
import PreviewTabs from "./PreviewTabs";
import StartOverButton from "./StartOverButton";
import { Link } from "react-router-dom";
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
    ipcRenderer.on("async-query-reply", () => {
      const data = electron.remote.getGlobal("sharedObj").data;
      this.setState({
        data: data,
        numFields: electron.remote.getGlobal("sharedObj").currQuery
          .qualifiedFields.length,
        numRows: data.length,
        sqlQuery: electron.remote.getGlobal("sharedObj").sqlQuery,
        selectedModelsAndFields: electron.remote.getGlobal("sharedObj")
          .currQuery.selectedModelsAndFields
      });
    });
  }

  // componentWillUnmount() {
  //   ipcRenderer.removeAllListeners()
  // }

  render() {
    console.log("DATA", this.state.data);

    return (
      <div className="Flex-Container Min-width-30 Height-75">
        <div className="Column Center Height-50">
          <div>
            <h1>COMPLETE YOUR QUERY</h1>
          </div>
          <div className="Row self-align-center">
            <div className="">
              <Button variant="contained" className="Button" value="save">
                Save
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                component={Link}
                to="/visualize"
                className="Button"
                value="export"
              >
                Visualize
              </Button>
              {/* <Visualization data={this.state.data} */}
            </div>
            <div>
              <StartOverButton />
            </div>
          </div>
          <div>
            <PreviewTabs {...this.state} preview={false} />
          </div>
        </div>
      </div>
    );
  }
}

export default FinalizeQuery;
