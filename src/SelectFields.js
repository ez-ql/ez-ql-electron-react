import React from 'react';
import Button from '@material-ui/core/Button';

const SelectFields = props => {
  const { handleFieldChange } = props;
  const fields = props.fields || []

  return (
    <div className='Title Height-80'>
      <div className='Column Center Height-50' >
        <h1 className='Flex-End Column  Grey'
        >
          SELECT FIELDS
        </h1>
      </div>
      <div className='Row-buttons Flex-Wrap'>
        {fields[0] &&
          fields.map(field => {
            return (
              <div>
                <Button
                  className='Button'
                  type="submit"
                  name="fields"
                  value={field.field_name}
                  onClick={() => handleFieldChange(field.field_name)}
                >
                  {field.field_name}
                </Button>
              </div>
            )
          })
        }
        <div>
          <Button
            className='Button Black'
            type="submit"
            name="fields"
            value='selectAll'
            onClick={props.selectAll}
          >
            SELECT ALL
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SelectFields
