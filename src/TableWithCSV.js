import React from "react";
import MUIDataTable from "mui-datatables";
import { formatNames } from "./MakeQuery.js";

const getColumns = fieldsArray => {
  const formatedNames = formatNames(fieldsArray);
  return fieldsArray.map(field => ({
    dataField: field,
    text: formatedNames[field]
  }));
};

const TableWithCSV = props => {
  console.log("******props***", props);
  const { data } = props;
  let originalColumnNames;
  let prettyColumnNames;
  if (data.length > 0) {
    originalColumnNames = Object.keys(data[0]);
    prettyColumnNames = Object.values(formatNames(originalColumnNames));
  }

  console.log("***originalColumnNames***", originalColumnNames);
  console.log("***prettyColumnNames***", prettyColumnNames);

  const rowValuesOnly = data.map(row => Object.values(row));
  console.log("***rowValuesOnly***", rowValuesOnly);

  // const options = {
  //   //unsure
  // };

  return (
    // <div>hello!</div>
    <MUIDataTable
      title={"Preview results"}
      data={rowValuesOnly}
      columns={prettyColumnNames}
      //options={options}
    />
  );
};

export default TableWithCSV;
