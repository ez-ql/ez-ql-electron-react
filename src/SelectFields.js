import React from "react";
import FieldButtons from "./FieldButtons";

const SelectFields = props => {
  const handleChange = props.handleChange;
  const fields = props.fields || [];
  const fieldNames = fields.map(elem => elem.field_name);
  const modFields = props.formatFieldNames(fieldNames);
  return (
    <div className="Title Height-80">
      <div className="Column Center Height-50">
        <h1 className="Flex-End Column ">Select Fields</h1>
      </div>
      <FieldButtons
        fields={fields}
        modFields={modFields}
        handleChange={handleChange}
      />
    </div>
  );
};

export default SelectFields;
