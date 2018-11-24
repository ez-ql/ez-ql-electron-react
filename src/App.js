import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import MakeQuery from "./MakeQuery";
import StartQuery from "./StartQuery";
import { Route, Switch } from "react-router-dom";
import AppBar from './AppBar'
import Project1 from './Project1'
import FinalizeQuery from './FinalizeQuery'
// import { ContentLink } from "material-ui/svg-icons";
import { Link } from 'react-router-dom'
// import Drawer from './Drawer'

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header Flex-Container">
          <AppBar />
        </header>
        <div className='App-body'>
        <Switch>
          <Route path="/startQuery" component={StartQuery} />
          <Route path="/makeQuery" component={MakeQuery} />
          <Route path="/project1" component={Project1} />
          <Route path='/finalizeQuery' component={FinalizeQuery} />
          {/*ADJUST AS APPLICABLE Default route*/}
        </Switch>
        </div>
      </div>
    );
  }
}

export default App;
