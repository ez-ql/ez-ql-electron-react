import React from "react";
import MUIDataTable from "mui-datatables";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  table: {
    height: 300,
    width: "auto%",
    overflow: "auto"
  }
});

const Table = props => {
  const { preview, classes, prettyColumnNames, data } = props;

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
    <MUIDataTable
      title={preview ? "Preview results" : "Results"}
      data={data}
      columns={prettyColumnNames}
      options={options}
      className={classes.table}
    />
  );
};

export default withStyles(styles)(Table);
