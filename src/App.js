import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css"; //what is this line about?
import "./MakeQuery"; //what is this line about?
import MakeQuery from "./MakeQuery";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <MakeQuery />
        </header>
      </div>
    );
  }
}

export default App;
