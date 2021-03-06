import React from "react";
// import Button from "@material-ui/core/Button";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

class Visualize extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const data = electron.remote.getGlobal("sharedObj").data;
    this.setState({
      data: data
    });
  }

  render() {

    return (
      <div className="Flex-Container Min-width-30 Height-75">
        <div className="Column Center Height-50">
          <h1>YOUR CHART OPTIONS</h1>
        </div>
      </div>
    );
  }
}

export default Visualize;
