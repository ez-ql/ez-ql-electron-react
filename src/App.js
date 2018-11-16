import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './MakeQuery'
import MakeQuery from './MakeQuery';

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
