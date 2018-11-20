import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import MakeQuery from "./MakeQuery";
import StartQuery from "./StartQuery";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Router>
            <Switch>
              <Route path="/makeQuery" component={MakeQuery} />
              <Route path="/startQuery" component={StartQuery} />
              <Route component={StartQuery} />{" "}
              {/*ADJUST AS APPLICABLE Default route*/}
            </Switch>
          </Router>
        </header>
      </div>
    );
  }
}

export default App;
