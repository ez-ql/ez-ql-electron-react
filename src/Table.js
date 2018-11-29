import React from "react";
import MUIDataTable from "mui-datatables";
import { formatNames } from "./MakeQuery.js";
import moment from "moment";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
const electron = window.require("electron");

const styles = theme => ({
  paper: {
    height: 350,
    width: "auto%",
    marginTop: theme.spacing.unit * 3,
    overflow: "auto"
  }
});

const Table = props => {
  const { preview, classes } = props;
  let { data } = props;

  let originalColumnNames;
  let prettyColumnNames;

  console.log("******preview*****", preview);
  if (preview) data = data.slice(0, 10);
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
        if (!selectedFields.includes(globalField))
          selectedFields.push(globalField);
      }
    });
  });

  const dateColumns = selectedFields
    .filter(field => field.field_type === "date")
    .map(field => field.field_name);

  data.forEach(row => {
    dateColumns.forEach(dateColumn => {
      const newFormat = moment(row[dateColumn])
        .format("l")
        .toString();
      row[dateColumn] = newFormat;
    });
  });

  const rowValuesOnly = data.map(row => Object.values(row));

  const options = {
    responsive: "scroll",
    filter: false,
    sort: false,
    print: false,
    selectableRows: false,
    pagination: false,
    rowsPerPage: Infinity,
    viewColumns: false,
    customFooter: (selectedRows, displayData, setSelectedRows) => {}
  };

  return (
    <Paper className={classes.paper}>
      <MUIDataTable
        className="table"
        id="muiDataTable"
        title={preview ? "Preview results" : "Results"}
        data={rowValuesOnly}
        columns={prettyColumnNames}
        options={options}
      />
    </Paper>
  );
};

export default withStyles(styles)(Table);
