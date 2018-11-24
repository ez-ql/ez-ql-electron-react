import React from "react";

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
      <div className="Row-buttons Flex-Wrap">
        {fields[0] &&
          Object.keys(modFields).map(field => {
            return (
              <div>
                <button
                  className="Button"
                  type="submit"
                  name="fields"
                  value={field}
                  onClick={handleChange}
                >
                  {modFields[field]}
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SelectFields;
