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
      console.log('HEEEERE')
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
      <div className="Column Title Min-height-50 Align-self-center Margin-top-3">
      <div className="Column Displauy Center Height-50">
          <div className="Align-self-center Width-30" >
            <h1>
            <div className="Row Flex-space-around ">
            <div className="Larger-font">
              {/* <Button
                className="Button"
                value="save">
                Save
              </Button> */}
            </div>
            <div className="Larger-font">
              {/* <Button
                component={Link}
                to="/visualize"
                className="Button"
                value="export"
              >
                Visualize
              </Button> */}
              {/* <Visualization data={this.state.data} */}
            </div>
            {/* <div className="Larger-font">
              <StartOverButton />
            </div> */}
          </div>
              </h1>
          </div>

          <div>
            <PreviewTabs props={{ ...this.state }} preview={false} />
          </div>
        </div>
      </div>
    );
  }
}

export default FinalizeQuery;
