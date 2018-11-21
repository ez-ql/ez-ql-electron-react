import React from 'react'

const SelectFields = props => {
  const handleChange = props.handleChange;
  const fields = props.fields || []
  return (
    <div className='Title Height-80'>
      <div className='Column Center Height-50' >
        <h1 className='Flex-End Column '>Select Fields</h1>
      </div>
      <div className='Row-buttons Flex-Wrap'>
        {fields[0] &&
          fields.map(field => {
            return (
              <div>
                <button
                  className='Button'
                  type="submit"
                  name="fields"
                  value={field.field_name}
                  onClick={handleChange}
                >
                  {field.field_name}
                </button>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default SelectFields
