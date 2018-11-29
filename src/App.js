import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import MakeQuery from "./MakeQuery";
import StartQuery from "./StartQuery";
import { Route, Switch } from "react-router-dom";
import AppBar from './AppBar'
import Project from './Project'
import Joins from './Joins'
import FinalizeQuery from './FinalizeQuery'
import HorizontalStepper from './Stepper'
import Visualization from './Visualization'
import Homepage from './Homepage'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header Flex-Container">
          <AppBar />
        </header>
        <div className="App-body">
          <Switch>
            <Route path="/makeQuery" component={MakeQuery} />
            <Route path="/project" component={Project} />
            <Route path="/finalizeQuery" component={FinalizeQuery} />
            <Route path="/refineQuery" component={HorizontalStepper} />
            <Route path="/visualize" component={Visualization} />
            <Route path="/homepage" component={Homepage} />
            <Route component={Homepage} />
            {/*ADJUST LAST LINE AS APPLICABLE Default route*/}
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
