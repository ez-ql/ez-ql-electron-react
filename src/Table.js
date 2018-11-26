import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700,
    maxWidth: "80%"
  }
});

// let id = 0;
// function createData(rowValues) {
//   id += 1;
//   return { id, ...rowValues };
// }

let id = 0;
function createData(
  name,
  calories,
  fat,
  carbs,
  protein,
  test1,
  test2,
  test3,
  test4
) {
  id += 1;
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
    test1,
    test2,
    test3,
    test4
  };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0, 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3, 0, 0, 0, 0),
  createData("Eclair", 262, 16.0, 24, 6.0, 0, 0, 0, 0),
  createData("Cupcake", 305, 3.7, 67, 4.3, 0, 0, 0, 0),
  createData("Gingerbread", 356, 16.0, 49, 3.9, 0, 0, 0, 0)
];

function SimpleTable(props) {
  const { classes } = props;
  console.log(createData("Frozen yoghurt", 159, 6.0, 24, 4.0, 0, 0, 0, 0));

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell numeric>Calories</TableCell>
            <TableCell numeric>Fat (g)</TableCell>
            <TableCell numeric>Carbs (g)</TableCell>
            <TableCell numeric>Protein (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => {
            return (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell numeric>{row.calories}</TableCell>
                <TableCell numeric>{row.fat}</TableCell>
                <TableCell numeric>{row.carbs}</TableCell>
                <TableCell numeric>{row.protein}</TableCell>
                <TableCell numeric>{row.test1}</TableCell>
                <TableCell numeric>{row.test2}</TableCell>
                <TableCell numeric>{row.test3}</TableCell>
                <TableCell numeric>{row.test4}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTable);
