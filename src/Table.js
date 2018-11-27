import React from "react";
import MUIDataTable from "mui-datatables";
import { formatNames } from "./MakeQuery.js";
import Paper from '@material-ui/core/Paper';
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  paper: {
    height: 350,
    width: 'auto%',
    marginTop: theme.spacing.unit * 3,
    overflow: 'auto',
  },
});

const Table = props => {
  const { data, classes } = props;
  let originalColumnNames;
  let prettyColumnNames;
  if (data.length > 0) {
    originalColumnNames = Object.keys(data[0]);
    prettyColumnNames = Object.values(formatNames(originalColumnNames));
  }
  const rowValuesOnly = data.map(row => Object.values(row));

  const options = {
    customFooter: (selectedRows, displayData, setSelectedRows) => {}
  };

  return (
    <Paper className={classes.paper}>
    <MUIDataTable
      title={"Preview results"}
      data={rowValuesOnly}
      columns={prettyColumnNames}
      options={options}
    />
    </Paper>
  );
};

export default withStyles(styles)(Table);
