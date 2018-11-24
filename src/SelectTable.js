import React from "react";

const SelectTable = props => {
  const { handleChange, model, formatTableNames } = props;
  const relatedModels = model.related_models.map(relatedModel => {
    const found = props.schema.find(model => {
      return model.model_id === relatedModel.relatedmodel_id;
    });
    return found;
  });
  //what purpose does the below line have?
  relatedModels.filter(x => x);

  const modRelatedModels = relatedModels[0]
    ? formatTableNames(relatedModels.map(elem => elem.model_name))
    : "No related models";

  return Object.keys(modRelatedModels).length ? (
    <div className="Title Height-80">
      <div className="Column Center Height-50">
        <h1 className="Flex-End Column">Select Related Table</h1>
      </div>
      <div className="Row-buttons">
        {relatedModels[0]
          ? Object.keys(modRelatedModels).map(model => {
              return (
                <div>
                  <button
                    className="Button"
                    type="submit"
                    name="selectedModel"
                    value={model}
                    onClick={handleChange}
                  >
                    {modRelatedModels[model]}
                  </button>
                </div>
              );
            })
          : "There are no related tables available."}
      </div>
    </div>
  ) : null;
};

export default SelectTable;
