import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { formatNames } from "./MakeQuery.js";

const getColumns = fieldsArray => {
  const formatedNames = formatNames(fieldsArray);
  return fieldsArray.map(field => ({
    dataField: field,
    text: formatedNames[field]
  }));
};
const Table = props => {
  const { data } = props;
  const columns = data[0] ? getColumns(Object.keys(data[0])) : 0;

  return (
    <div className="table">
      {columns.length > 0 ? (
        <BootstrapTable
          keyField={columns.find(field => field.dataField.indexOf("id") > 0)}
          data={data}
          columns={columns}
          bordered={true}
          noDataIndication="Table is Empty"
        />
      ) : (
        "No data selected"
      )}
    </div>
  );
};

export default Table;
