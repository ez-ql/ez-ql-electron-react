import MUIDataTable from "mui-datatables";
import { formatNames } from "./MakeQuery.js";

const getColumns = fieldsArray => {
  const formatedNames = formatNames(fieldsArray);
  return fieldsArray.map(field => ({
    dataField: field,
    text: formatedNames[field]
  }));
};

const columns = data[0] ? getColumns(Object.keys(data[0])) : 0;

const { data } = props;
////TODOOO
rowValuesOnly = data.map(row => row.map(cellData => ))
  
const data = [
 ["Joe James", "Test Corp", "Yonkers", "NY"],
 ["John Walsh", "Test Corp", "Hartford", "CT"],
 ["Bob Herm", "Test Corp", "Tampa", "FL"],
 ["James Houston", "Test Corp", "Dallas", "TX"],
];

const options = {
  filterType: 'checkbox',
};

<MUIDataTable
  title={"Employee List"}
  data={data}
  columns={columns}
  options={options}
/>
Or customize columns:

import MUIDataTable from "mui-datatables";

const columns = [
 {
  name: "Name",
  options: {
   filter: true,
   sort: true,
  }
 },
 {
  name: "Company",
  options: {
   filter: true,
   sort: false,
  }
 },
 {
  name: "City",
  options: {
   filter: true,
   sort: false,
  }
 },
 {
  name: "State",
  options: {
   filter: true,
   sort: false,
  }
 },
];

const data = [
 ["Joe James", "Test Corp", "Yonkers", "NY"],
 ["John Walsh", "Test Corp", "Hartford", "CT"],
 ["Bob Herm", "Test Corp", "Tampa", "FL"],
 ["James Houston", "Test Corp", "Dallas", "TX"],
];

const options = {
  filterType: 'checkbox',
};

<MUIDataTable
  title={"Employee List"}
  data={data}
  columns={columns}
  options={options}
/>