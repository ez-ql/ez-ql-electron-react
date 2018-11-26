import React, { Component } from "react";
import Selector from "./Selector/Selector";
import SelectTable from "./SelectTable";
import SelectFields from "./SelectFields";
import { Link } from "react-router-dom";
import FormDialog from "./FormDialog";
import Button from "@material-ui/core/Button";
import PreviewPanel from "./PreviewPanel";
import PreviewModal from "./PreviewModal";
import JoinModal from "./JoinModal";
const electron = window.require("electron");
const sharedObject = electron.remote.getGlobal("sharedObj");
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
      previewExpanded: false,
      joinModal: false
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
    copy.fields = [];
    const schema = electron.remote.getGlobal("sharedObj").models;
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
    const copy = { ...selectedModel, fields: [] };
    const selectedModelsAndFields = [...this.state.selectedModelsAndFields];
    const [includesSelectedModel] = selectedModelsAndFields.filter(
      model => model.model_name === modelName
    );
    if (!includesSelectedModel) {
      selectedModelsAndFields.unshift(copy);
      this.toggleView();
      electron.remote.getGlobal(
        "sharedObj"
      ).currQuery.selectedModel = selectedModel;
      electron.remote.getGlobal(
        "sharedObj"
      ).currQuery.selectedModelsAndFields = selectedModelsAndFields;
      this.setState({
        //from: modelName,
        nextView: false,
        selectedModel,
        selectedModelsAndFields,
        joinModal: true
      });
    }
  }

  handleFieldChange(newField) {
    let { fields } = this.state;
    let qualifiedFields = [...electron.remote.getGlobal('sharedObj').currQuery.qualifiedFields]
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
      electron.remote.getGlobal(
        "sharedObj"
      ).currQuery.selectedModelsAndFields = selectedModelsAndFields;
      electron.remote.getGlobal("sharedObj").currQuery.fields = fields;
      qualifiedFields.push(`${this.state.selectedModel.model_name}.${newField}`)
      electron.remote.getGlobal("sharedObj").currQuery.qualifiedFields = qualifiedFields
      this.setState({
        fields,
        selectedModelsAndFields
      });
    }
  }

  toggleView() {
    const bool = this.state.nextView;
    this.setState({ nextView: !bool });
  }

  toggleJoinModal = () => {
    this.setState({
      joinModal: false
    });
  };

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
    const selectedModel = this.state.schema.find(
      model => model.model_name === modelName
    );
    this.setState({
      selectedModel,
      nextView: false
    });
  }

  removeField(fieldName, modelName) {
    let selectedModelsAndFields = this.state.selectedModelsAndFields;
    //will currently remove field from both tables if it has the same name, not ideal but let's go with it for now
    const fields = this.state.fields.filter(field => field !== fieldName);
    selectedModelsAndFields = selectedModelsAndFields.map(model => {
      model.fields = model.fields.filter(field => field !== fieldName)
      return model;
    });
    electron.remote.getGlobal(
      "sharedObj"
    ).currQuery.selectedModelsAndFields = selectedModelsAndFields;
    electron.remote.getGlobal("sharedObj").currQuery.fields = fields;
    electron.remote.getGlobal(
      "sharedObj"
    ).currQuery.qualifiedFields = electron.remote
      .getGlobal("sharedObj")
      .currQuery.qualifiedFields.filter(
        field => field.split('.')[1] !== fieldName
      );
    this.setState({ selectedModelsAndFields, fields });
  }

  selectAll() {
    const globalFields = [...electron.remote.getGlobal("sharedObj").currQuery.fields]
    const globalQualifiedFields = [...electron.remote.getGlobal("sharedObj").currQuery.qualifiedFields]
    const fields = [...this.state.selectedModel.fields].map(
      field => field.field_name
    );
    const updated = this.state.selectedModelsAndFields.map(model => {
      return model.model_name === this.state.selectedModel.model_name
        ? { ...model, fields }
        : model;
    });
    const qualifiedFields = fields.map(field => `${this.state.selectedModel.model_name}.${field}`)
    electron.remote.getGlobal("sharedObj").currQuery.fields = globalFields.concat(fields)
    electron.remote.getGlobal("sharedObj").currQuery.selectedModelsAndFields = updated
    electron.remote.getGlobal("sharedObj").currQuery.qualifiedFields = globalQualifiedFields.concat(qualifiedFields)
    this.setState({ selectedModelsAndFields: updated, fields: globalFields.concat(fields) });
  }

  joinStep() {
    electron.remote.getGlobal(
      "sharedObj"
    ).currQuery.selectedModelsAndFields = this.state.selectedModelsAndFields;
    electron.remote.getGlobal("sharedObj").currQuery.fields = this.state.fields;
  }

  loadPreview = event => {
    console.log("*****SHARED OBJECT******", sharedObject);
    //only do this if panel is about to expand
    if (!this.state.previewExpanded) {
      const [qualifiedFieldsToAdd] = this.state.selectedModelsAndFields.map(
        modelAndFields =>
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
  };

  render() {
    //one issue: right now, in order to pass selectedData and query as props to RefineQuery and Joins, you need to click Submit - we should change that
    return (
      <div>
        <div className="Flex-Container Width-75 Height-75">
          <div className="Column Center Height-50">
            {this.state.joinModal && (
              <JoinModal toggleJoinModal={this.toggleJoinModal} />
            )}
            {this.state.nextView ? (
              <SelectTable
                handleModelChange={this.handleModelChange}
                model={this.state.selectedModel}
                schema={this.state.schema}
                formatTableNames={formatNames}
              />
            ) : (
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
            <div>
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
                {this.state.selectedModelsAndFields.length === 2 && (
                  <div>
                    <FormDialog onClick={this.joinStep} />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Button className="Button" component={Link} to="/startQuery">
                START OVER
              </Button>
            </div>
            <div>
              <Button className="Button" component={Link} to="/refineQuery">
                REFINE QUERY
              </Button>
            </div>
            <div onClick={this.loadPreview}>
              <PreviewModal />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MakeQuery;
