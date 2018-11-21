import React from 'react'

const SelectTable = props => {
  const { handleChange, model } = props;
  const relatedModels = model.related_models.map(relatedModel => {
    const found = props.schema.find(model => {
      return model.model_id === relatedModel.relatedmodel_id
    })
    return found
  })
  relatedModels.filter(x => x);

  return (
    <div className='Title Height-80'>
      <div className='Column Center Height-50'  >
        <h1 className='Flex-End Column'>Select Related Table</h1>
      </div>
      <div className='Row-buttons'>
        {relatedModels[0] && relatedModels.map(model => {
          return (
            <div>
              <button
                className='Button'
                type="submit"
                name="selectedModel"
                value={model.model_name}
                onClick={handleChange}
              >
                {model.model_name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default SelectTable
