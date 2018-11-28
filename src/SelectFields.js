// import React from 'react';
// import Button from '@material-ui/core/Button';

// const SelectFields = props => {
//   const { handleFieldChange } = props;
//   const fields = props.fields || []

//   return (
//     <div className='Title Min-height-75'>
//       <div className='Column Center Height-50' >
//         <h1 className='Flex-End Column  Grey'
//         >
//           SELECT FIELDS
//         </h1>
//       </div>
//       <div className='Row-buttons Flex-Wrap'>
//         {fields[0] &&
//           fields.map(field => {
//             return (
//               <div>
//                 <Button
//                   className='Button'
//                   type="submit"
//                   name="fields"
//                   value={field.field_name}
//                   onClick={() => handleFieldChange(field.field_name)}
//                 >
//                   {field.field_name}
//                 </Button>
//               </div>
//             )
//           })
//         }
//         <div>
//           <Button
//             className='Button Black'
//             type="submit"
//             name="fields"
//             value='selectAll'
//             onClick={props.selectAll}
//           >
//             SELECT ALL
//           </Button>
//         </div>

import React from "react";
import FieldButtons from "./FieldButtons";

const SelectFields = props => {
  const handleFieldChange = props.handleFieldChange;
  const fields = props.fields || [];
  const fieldNames = fields.map(elem => elem.field_name);
  const modFields = props.formatFieldNames(fieldNames);
  return (
    <div className="Title Min-height-50 Align-self-center Margin-top-3">
      <div className="Column Center Height-50">
        <h1 className="Flex-End Column Grey">SELECT FIELDS</h1>
      </div>
      <div>
      <FieldButtons
        fields={fields}
        modFields={modFields}
        handleFieldChange={handleFieldChange}
        selectAll={props.selectAll}
      />
      </div>
    </div>
  );
};

export default SelectFields;
