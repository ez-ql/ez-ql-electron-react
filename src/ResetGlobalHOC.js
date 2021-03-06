import React from "react";
const electron = window.require("electron");

const initialCurrQuery = {
  from: "",
  fields: [],
  where: "",
  qualifiedFields: [],
  joinType: "",
  leftRef: "",
  rightRef: "",
  group: "",
  order: [],
  selectedModelsAndFields: [],
  selectedModel: {
    // fields: [],
    // model_id: null,
    // model_name: "",
    // related_models: []
  }
};

const withResetGlobal = Component => {
  const WrappedComponent = props => {
    return (
      <span
        onClick={() => {
          electron.remote.getGlobal("sharedObj").currQuery = initialCurrQuery;
          electron.remote.getGlobal("sharedObj").sqlQuery = "";
        }}
      >
        <Component {...props} />
      </span>
    );
  };
  return WrappedComponent;
};

export default withResetGlobal;
