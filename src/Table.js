import React from "react";
import MUIDataTable from "mui-datatables";
import { formatNames } from "./MakeQuery.js";

const Table = props => {
  const { data } = props;
  let originalColumnNames;
  let prettyColumnNames;
  if (data.length > 0) {
    originalColumnNames = Object.keys(data[0]);
    prettyColumnNames = Object.values(formatNames(originalColumnNames));
  }
  const rowValuesOnly = data.map(row => Object.values(row));

  // const options = {
  //   //tbd
  // };

  return (
    <MUIDataTable
      title={"Preview results"}
      data={rowValuesOnly}
      columns={prettyColumnNames}
      //options={options}
    />
  );
};

export default Table;
