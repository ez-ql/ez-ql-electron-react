import React from "react";
import MUIDataTable from "mui-datatables";
import { formatNames } from "./MakeQuery.js";
const electron = window.require("electron");

const Table = props => {
  const { data } = props;
  let originalColumnNames;
  let prettyColumnNames;
  if (data.length > 0) {
    originalColumnNames = Object.keys(data[0]);
    prettyColumnNames = Object.values(formatNames(originalColumnNames));
  }

  const globalObj = electron.remote.getGlobal("sharedObj");
  const currQuery = globalObj.currQuery;
  const models = globalObj.models;
  let selectedFields = [];
  currQuery.selectedModelsAndFields.forEach(model => {
    const modelDetail = models.filter(
      globalModel => globalModel.model_name === model.model_name
    );
    modelDetail[0].fields.forEach(globalField => {
      if (model.fields.includes(globalField.field_name)) {
        selectedFields.push(globalField);
      }
    });
  });

  console.log("*****selectedFields*******", selectedFields);

  const rowValuesOnly = data.map(row => Object.values(row));

  const options = {
    responsive: "scroll"
  };

  return (
    <MUIDataTable
      className="table"
      title={"Preview results"}
      data={rowValuesOnly}
      columns={prettyColumnNames}
      options={options}
    />
  );
};

export default Table;
