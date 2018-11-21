import React from 'react'

const database = {
  id: 1,
  name: "BikeStores",
  organizationId: 1,
  related_models: [2],
  models: [
    {
      id: 1,
      name: "orders",
      databaseId: 1,
      fields: [
        {
          id: 1,
          name: "order_id",
          modelId: 1
        },
        {
          id: 2,
          name: "customer_id",
          modelId: 1
        },
        {
          id: 3,
          name: "order_status",
          modelId: 1
        },
        {
          id: 4,
          name: "order_date",
          modelId: 1
        }
      ]
    },
    {
      id: 2,
      name: "stores",
      databaseId: 1,
      related_models: [1],
      fields: [
        {
          id: 1,
          name: "store_id",
          modelId: 2
        },
        {
          id: 2,
          name: "store_name",
          modelId: 2
        },
        {
          id: 3,
          name: "phone",
          modelId: 2
        },
        {
          id: 4,
          name: "email",
          modelId: 2
        }
      ]
    }
  ]
};



const SelectFields = props => {
  const { handleChange, model } = props;

  console.log('model', model)
  const relatedModels = model.related_models.map(modelId => {
      console.log('modelId', modelId, 'model.id', model.id)
      // return allModels.find(model => model.id === modelId )
      const found = database.models.find(model => {
        console.log('model', model)
        return model.id === modelId
      })
      console.log('found', found)
      return found
    })

  console.log('relatedModels', relatedModels)

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
                value={model.name}
                onClick={handleChange}
              >
                {model.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default SelectFields
