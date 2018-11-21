import React from 'react'

const SelectFields = props => {
  const { handleChange, fields } = props

  return (
    <div className='Title Height-80'>
      <div className='Column Center Height-50' >
        <h1 className='Flex-End Column'>Select Fields</h1>
      </div>
      <div className='Row-buttons'>
        {fields &&
          fields.map(field => {
            return (
              <div>
                <button
                  className='Button'
                  type="submit"
                  name="fields"
                  value={field.name}
                  onClick={handleChange}
                >
                  {field.name}
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
