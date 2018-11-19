// import React, { Component } from "react";
// const electron = window.require("electron");
// const ipcRenderer = electron.ipcRenderer;
// import BootstrapTable from "react-bootstrap-table-next";

// const columns = (fieldsArray) => {
//   return columnsArray.map(field => ({ dataField: field, text: field }))
// }

// class Table extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       fields: [],
//       rows: []
//     };
//   }

//   componentDidMount() {
//     ipcRenderer.on("async-query-reply", (event, arg) => {
//       this.setState({ rows: arg, columns: Object.keys(arg[0]) });
//     });
//   }

//   render() {
//     const limit = this.props.limit;

//     return (
//       <div className="table">
//         <BootstrapTable
//           keyField="id"
//           data={}
//           columns={columns(this.props.fields}
//           bordered={false}
//         />
//       </div>
//     );
//   }
// }

// export default Table;
