import React, { Component } from "react";
import squel from "squel";
import Selector from './Selector/Selector'
import SelectTable from './SelectTable'
import SelectFields from './SelectFields'
import { Link } from "react-router-dom";
import FormDialog from './FormDialog'
import Button from "@material-ui/core/Button";

const electron = window.require("electron");
const sharedObject = electron.remote.getGlobal('sharedObj')
const Store = window.require("electron-store");
const store = new Store();

class MakeQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: "",
      // query: "",
      fields: [],
      selectedModel: {},
      selectedData: {},
      anotherTable: false,
      nextView: false,
      tables: [],
      selectedModelsAndFields: [],
      selectedSlide: 0,
      schema: []
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
    const selectedModel = electron.remote.getGlobal('sharedObj').currQuery.selectedModel
    const copy = { ...selectedModel };
    copy.fields = []
    const schema = sharedObject.models
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
    const [ includesSelectedModel ] = selectedModelsAndFields.filter(model => model.model_name === modelName)
    if (!includesSelectedModel) {
      selectedModelsAndFields.unshift(copy)
      this.toggleView();
      this.setState({
        from: modelName,
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
      let selectedModelsAndFields = this.state.selectedModelsAndFields
        .map(table => {
          if (this.state.selectedModel.model_name === table.model_name) {
            table.fields.push(newField);
            return table
          }
          return table
        })
      this.setState({
        fields,
        selectedModelsAndFields
      });
    }
  }

  toggleView() {
    const bool = this.state.nextView
    this.setState({ nextView: !bool })
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
    const selectedModel = this.state.schema.find(
      model => model.model_name === modelName
    );
    this.setState({
      selectedModel,
      nextView: false
    })
  }

  removeField(fieldName, modelName) {
    let selectedModelsAndFields = this.state.selectedModelsAndFields
    const [model] = selectedModelsAndFields.filter(model => (
      model.model_name === modelName)
    );
    const fields = model.fields.filter(field => field !== fieldName)
    selectedModelsAndFields = selectedModelsAndFields.map(model => {
      return model.model_name === modelName ?
        { ...model, fields } : model
    })
    this.setState({ selectedModelsAndFields })
  }

  selectAll() {
    const fields = [...this.state.selectedModel.fields].map(field => field.field_name)
    const updated = this.state.selectedModelsAndFields.map(model => {
      return model.model_name === this.state.selectedModel.model_name ?
        { ...model, fields } : model
    })
    this.setState({ selectedModelsAndFields: updated })
  }

  joinStep() {
    electron.remote.getGlobal('sharedObj').currQuery.selectedModelsAndFields = this.state.selectedModelsAndFields;
    electron.remote.getGlobal('sharedObj').currQuery.from = this.state.from;
    electron.remote.getGlobal('sharedObj').currQuery.fields = this.state.fields;
  }

  render() {
    //one issue: right now, in order to pass selectedData and query as props to RefineQuery and Joins, you need to click Submit - we should change that
    console.log('SELECTED', this.state.selectedModel)
    return (
      <div className='Flex-Container Width-75 Height-75'>
        <div className='Column Center'>
          {
            this.state.nextView ?
              <SelectTable
                handleModelChange={this.handleModelChange}
                model={this.state.selectedModel}
                schema={this.state.schema}
              /> :
              <SelectFields
                handleFieldChange={this.handleFieldChange}
                fields={this.state.selectedModel.fields}
                schema={this.state.schema}
                selectAll={this.selectAll}
              />
          }
          <div className='Container'>
            {
              this.state.selectedModelsAndFields[0] &&
                <Selector
                  items={this.state.selectedModelsAndFields}
                  selectedModel={this.state.selectedModel}
                  selectedSlide={this.selectedSlide}
                  removeField={this.removeField}
                />
            }
          </div>
          <div>
            {
              !this.state.nextView &&
              <div>
                <Button
                  type='submit'
                  className='Button'
                  onClick={this.toggleView}>
                  connect another table
                </Button>
              </div>
            }
            <div>
              {
                this.state.selectedModelsAndFields.length === 2 &&
                <div>
                  <FormDialog onClick={this.joinStep} />
                </div>
              }
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
        </div>
      </div>
    );
  }
}

export default MakeQuery;
