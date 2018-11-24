import React from 'react';
import Button from '@material-ui/core/Button';

const SelectTable = props => {
  const { handleModelChange, model } = props;
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
        <h1 className='Flex-End Column Grey'>SELECT RELATED TABLE</h1>
      </div>
      <div className='Row-buttons'>
        {relatedModels[0] && relatedModels.map(model => {
          return (
            <div>
              <Button
                className='Button'
                type="submit"
                name="selectedModel"
                value={model.model_name}
                onClick={() => handleModelChange(model.model_name)}
              >
                {model.model_name}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default SelectTable
