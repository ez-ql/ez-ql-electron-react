import React, { Component } from "react";
import squel from "squel";
import MakeQuery from './MakeQuery';
import ReactScrollableList from 'react-scrollable-list';
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;



//this will be a re-usable component for aggregates and filtering
//vision:
//show all selected fields (some sort of static scrolling menu)
//some sort of ad-lib form for further selection refinement
//assumptions:
//data passed to component from previous components as props

// const Joins = props => {
//     // let currentTables = 
// }

const Joins = props => {
    return (
        <h1>PLACEHOLDER</h1>
        // <MakeQuery anotherTable={true}/>
    )
}

// class Joins extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//         on: ''
//     };
//   }

//   render() {
//     return (
//       <div>
//         <MakeQuery anotherTable={true}/>
//       </div>
//     );
//   }
// }

export default Joins;
