import React, { Component } from "react";
import Selector from "./Selector/Selector";
import SelectTable from "./SelectTable";
import SelectFields from "./SelectFields";
import { Link } from "react-router-dom";
import FormDialog from "./FormDialog";
import Button from "@material-ui/core/Button";
import PreviewPanel from "./PreviewPanel";

const electron = window.require("electron");
const sharedObject = electron.remote.getGlobal("sharedObj");
const Store = window.require("electron-store");
const store = new Store();
const ipcRenderer = electron.ipcRenderer;

//func to convert table and field labels to human-readable format
//takes an array
//no regex necessary (for our sample data set)
export const formatNames = arr => {
  let nameDict = {};
  let mod;
  arr.forEach(elem => {
    if (elem.includes("_")) {
      let [first, second] = elem.split("_");
      mod = `${first.charAt(0).toUpperCase()}${first.slice(1)} ${second
        .charAt(0)
        .toUpperCase()}${second.slice(1)}`;
    } else {
      mod = `${elem.charAt(0).toUpperCase()}${elem.slice(1)}`;
    }
    nameDict[elem] = mod;
  });
  return nameDict;
};

class MakeQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      selectedModel: {},
      selectedData: {},
      anotherTable: false,
      nextView: false,
      tables: [],
      selectedModelsAndFields: [],
      selectedSlide: 0,
      schema: [],
      previewExpanded: false
    };
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.selectedSlide = this.selectedSlide.bind(this);
    this.joinStep = this.joinStep.bind(this);
    this.removeField = this.removeField.bind(this);
    this.selectAll = this.selectAll.bind(this);
  }

  componentDidMount() {
    const selectedModel = electron.remote.getGlobal("sharedObj").currQuery
      .selectedModel;
    const copy = { ...selectedModel };
    copy.fields = []
    const schema = electron.remote.getGlobal('sharedObj').models
    this.setState({
      schema,
      selectedModel,
      selectedModelsAndFields: [copy]
    });
  }

  handleModelChange(modelName) {
    const selectedModel = this.state.schema.find(
      model => model.model_name === modelName
    );
    console.log('selectedModel in HMC', selectedModel)
    const copy = { ...selectedModel, fields: [] };
    const selectedModelsAndFields = [...this.state.selectedModelsAndFields];
    const [includesSelectedModel] = selectedModelsAndFields.filter(
      model => model.model_name === modelName
    );
    if (!includesSelectedModel) {
      selectedModelsAndFields.unshift(copy);
      this.toggleView();
      console.log('in handleModelChange')
      electron.remote.getGlobal('sharedObj').currQuery.selectedModel = selectedModel
      this.setState({
        //from: modelName,
        nextView: false,
        selectedModel,
        selectedModelsAndFields
      });
    }
  }

  handleFieldChange(newField) {
    let { fields } = this.state;
    if (!fields.some(field => field === newField)) {
      fields.push(newField);
      let selectedModelsAndFields = this.state.selectedModelsAndFields.map(
        table => {
          if (this.state.selectedModel.model_name === table.model_name) {
            table.fields.push(newField);
            return table;
          }
          return table;
        }
      );
      this.setState({
        fields,
        selectedModelsAndFields
      });
    }
  }

  toggleView() {
    console.log('GLOBAL selected', electron.remote.getGlobal('sharedObj').currQuery.selectedModel)
    const bool = this.state.nextView;
    this.setState({ nextView: !bool });
  }

  // handleSubmit(e) {
  //   e.preventDefault();
  //   const query = squel
  //     .select()
  //     .from(this.state.from)
  //     .fields(this.state.fields)
  //     .toString();
  // ipcRenderer.send("async-new-query", query);
  // this.setState({ query });
  // store.set("query", query);
  // this.setState({
  //   from: "",
  //   fields: []
  // })
  // }

  selectedSlide(modelName) {

    console.log('SELECTEDSLIDE', modelName)
    const selectedModel = this.state.schema.find(
      model => model.model_name === modelName
    );
    console.log('selectedModel in SS', selectedModel)
    this.setState({
      selectedModel,
      nextView: false
    });
  }

  removeField(fieldName, modelName) {
    let selectedModelsAndFields = this.state.selectedModelsAndFields;
    const [model] = selectedModelsAndFields.filter(
      model => model.model_name === modelName
    );
    const fields = model.fields.filter(field => field !== fieldName);
    selectedModelsAndFields = selectedModelsAndFields.map(model => {
      return model.model_name === modelName ? { ...model, fields } : model;
    });
    this.setState({ selectedModelsAndFields });
  }

  selectAll() {
    const fields = [...this.state.selectedModel.fields].map(
      field => field.field_name
    );
    const updated = this.state.selectedModelsAndFields.map(model => {
      return model.model_name === this.state.selectedModel.model_name
        ? { ...model, fields }
        : model;
    });
    this.setState({ selectedModelsAndFields: updated });
  }

  joinStep() {
    electron.remote.getGlobal(
      "sharedObj"
    ).currQuery.selectedModelsAndFields = this.state.selectedModelsAndFields;
    electron.remote.getGlobal("sharedObj").currQuery.fields = this.state.fields;
  }

  render() {
    //one issue: right now, in order to pass selectedData and query as props to RefineQuery and Joins, you need to click Submit - we should change that
    console.log("SELECTED", this.state.selectedModel);
    console.log(
      "GLOBAL selected",
      electron.remote.getGlobal("sharedObj").currQuery.selectedModel
    );
    console.log("FROM", electron.remote.getGlobal("sharedObj").currQuery.from);

    return (
      <div>
      <div className='Flex-Container Width-75 Height-75'>
        <div className='Column Center Height-50'>
          {
            this.state.nextView ?
              <SelectTable
                handleModelChange={this.handleModelChange}
                model={this.state.selectedModel}
                schema={this.state.schema}
                formatTableNames={formatNames}
              />
             : (
              <SelectFields
                handleFieldChange={this.handleFieldChange}
                fields={this.state.selectedModel.fields}
                schema={this.state.schema}
                selectAll={this.selectAll}
                formatFieldNames={formatNames}
              />
            )}
            <div className="Container">
              {this.state.selectedModelsAndFields[0] && (
                <Selector
                  items={this.state.selectedModelsAndFields}
                  selectedModel={this.state.selectedModel}
                  selectedSlide={this.selectedSlide}
                  removeField={this.removeField}
                />
              )}
            </div>
            <div className='Margin-top-10'>
              {!this.state.nextView && (
                <div>
                  <Button
                    type="submit"
                    className="Button"
                    onClick={this.toggleView}
                  >
                    connect another table
                  </Button>
                </div>
              )}
              <div>
              <Button
                component={Link}
                to="/joins"
                className="Button Row-buttons"
                onClick={() =>this.joinStep()}
              >
                Joins
              </Button>
              </div>
              <div>
                {this.state.selectedModelsAndFields.length === 2 && (
                  <div>
                    <FormDialog onClick={this.joinStep} />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Button
                className="Button"
                component={Link}
                to="/startQuery"
              >
                START OVER
              </Button>
            </div>
            <div>
              <Button className="Button" component={Link} to="/refineQuery">
                REFINE QUERY
              </Button>
            </div>
          </div>
        </div>
        <div
          className="Margin-top Light-blue"
          onClick={event => {
            console.log("*****SHARED OBJECT******", sharedObject);
            //only do this if panel is about to expand
            if (!this.state.previewExpanded) {
              const [
                qualifiedFieldsToAdd
              ] = this.state.selectedModelsAndFields.map(modelAndFields =>
                modelAndFields.fields.map(
                  field => `${modelAndFields.model_name}.${field}`
                )
              );
              const newQualifiedFields = [
                ...sharedObject.currQuery.qualifiedFields,
                ...qualifiedFieldsToAdd
              ];
              sharedObject.currQuery.qualifiedFields = newQualifiedFields;

              ipcRenderer.send("async-new-query");
            }
            this.setState(state => ({
              previewExpanded: !state.previewExpanded
            }));
          }}
        >
          <PreviewPanel />
        </div>
      </div>
    );
  }
}

export default MakeQuery;
