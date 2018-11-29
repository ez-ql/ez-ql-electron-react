import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const SelectTable = props => {
  const { handleModelChange, model, formatTableNames } = props;
  const relatedModels = model.related_models.map(relatedModel => {
    const found = props.schema.find(model => {
      return model.model_id === relatedModel.relatedmodel_id;
    });
    return found;
  });

  // return (
  //   <div className='Title Min-height-75'>
  //     <div className='Column Center Height-50'  >
  //       <h1 className='Flex-End Column Grey'>SELECT RELATED TABLE</h1>
  //     </div>
  //     <div className='Row-buttons'>
  //       {relatedModels[0] && relatedModels.map(model => {
  //         return (
  //           <div>
  //             <Button
  //               className='Button'
  //               type="submit"
  //               name="selectedModel"
  //               value={model.model_name}
  //               onClick={() => handleModelChange(model.model_name)}
  //             >
  //               {model.model_name}
  //             </Button>
  //           </div>
  //         );
  //       })}

  const modRelatedModels = relatedModels[0]
    ? formatTableNames(relatedModels.map(elem => elem.model_name))
    : "No related models";
  console.log("modRelatedModels", modRelatedModels);

  return Object.keys(modRelatedModels).length ? (
    <div className="Column Title Min-height-50 Align-self-center Margin-top-3">
      <div className="Column Center Height-50">
        <h1 className="Flex-End Column ">SELECT RELATED TABLE</h1>
      </div>
      <div className="Row-buttons">
        {relatedModels[0]
          ? Object.keys(modRelatedModels).map((model, idx) => {
              return (
                <div key={idx}>
                  <Button
                    color="primary"
                    variant="contained"
                    className="Button"
                    type="submit"
                    name="selectedModel"
                    value={model}
                    onClick={() => handleModelChange(model)}
                  >
                    {modRelatedModels[model]}
                  </Button>
                </div>
              );
            })
          : "There are no related tables available."}
      </div>
    </div>
  ) : null;
};

export default SelectTable;
