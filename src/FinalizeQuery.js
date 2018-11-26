import React from 'react'
import Button from "@material-ui/core/Button";

const electron = window.require("electron");
// const sharedObject = electron.remote.getGlobal('sharedObj')

class FinalizeQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModelsAndFields: []
    }
  }

  componentDidMount (){
    const selectedModelsAndFields = electron.remote.getGlobal('sharedObj').currQuery.selectedModelsAndFields
    this.setState({ selectedModelsAndFields })
  }

  render(){
    return (
      <div className="Height-40 Title Column Center Width-50 Grey">
        <h1>COMPLETE YOUR QUERY</h1>
        <div>
        <Button
          value='save'
        >
          Save
        </Button>
        <Button
          value='export'
        >
          Export
        </Button>
        <Button
          value='export'
        >
          Visualize
        </Button>
        </div>

      </div>

    )

  }

}

export default FinalizeQuery
