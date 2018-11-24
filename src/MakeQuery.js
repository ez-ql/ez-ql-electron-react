import React, { Component } from "react";
import Selector from "./Selector/Selector";
import SelectTable from "./SelectTable";
import SelectFields from "./SelectFields";
import { Link } from "react-router-dom";
import FormDialog from "./FormDialog";
import PreviewPanel from "./PreviewPanel";

const electron = window.require("electron");
const sharedObject = electron.remote.getGlobal("sharedObj");
const ipcRenderer = electron.ipcRenderer;

class MakeQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: "",
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
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.selectedSlide = this.selectedSlide.bind(this);
    this.joinStep = this.joinStep.bind(this);
  }

  componentDidMount() {
    const modelName = sharedObject.currQuery.from;
    const selectedModel = sharedObject.models.find(
      model => model.model_name === modelName
    );
    const copy = { ...selectedModel };
    copy.fields = [];
    const schema = sharedObject.models;
    const from = modelName;
    this.setState({
      from,
      schema,
      selectedModel,
      selectedModelsAndFields: [copy]
    });
  }

  handleChange(e) {
    // if (this.state.expanded) this.setState({ previewExpanded: false });  ///TODO collapse preview panel when one of the fields are clicked
    if (e.target.name === "selectedModel") {
      const modelName = e.target.value;
      const selectedModel = this.state.schema.find(
        model => model.model_name === modelName
      );
      const copy = { ...selectedModel };
      copy.fields = [];
      const selectedModelsAndFields = [...this.state.selectedModelsAndFields];
      const [includesSelectedModel] = selectedModelsAndFields.filter(
        model => model.model_name === modelName
      );

      if (!includesSelectedModel) {
        selectedModelsAndFields.unshift(copy);
        this.toggleView();
        this.setState({
          //from: modelName,
          nextView: false,
          selectedModel,
          selectedModelsAndFields
        });
      }
    } else {
      let newField = e.target.value;
      let fields = [...this.state.fields];
      const [includes] = fields.filter(field => field === newField);

      if (!includes) {
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
        this.setState({ fields, selectedModelsAndFields });
      }
    }
  }

  toggleView() {
    const bool = this.state.nextView;
    this.setState({ nextView: !bool });
  }

  handleSubmit(e) {
    e.preventDefault();
    ipcRenderer.send("async-new-query");

    // this.setState({
    //   from: "",
    //   fields: []
    // })
  }

  selectedSlide(modelName) {
    console.log("here");
    const selectedModel = this.state.schema.find(
      model => model.model_name === modelName
    );
    this.setState({ selectedModel, nextView: false });
  }

  joinStep() {
    electron.remote.getGlobal(
      "sharedObj"
    ).currQuery.selectedModelsAndFields = this.state.selectedModelsAndFields;
    electron.remote.getGlobal("sharedObj").currQuery.from = this.state.from;
    electron.remote.getGlobal("sharedObj").currQuery.fields = this.state.fields;
  }

  render() {
    const sharedObject = electron.remote.getGlobal("sharedObj");
    console.log("global models", sharedObject.models);
    //one issue: right now, in order to pass selectedData and query as props to RefineQuery and Joins, you need to click Submit - we should change that
    console.log("next", this.state.nextView);
    return (
      <div className="Flex-Container">
        <div className="Column Center">
          {this.state.nextView ? (
            <SelectTable
              handleChange={this.handleChange}
              model={this.state.selectedModel}
              schema={this.state.schema}
            />
          ) : (
            <SelectFields
              handleChange={this.handleChange}
              fields={this.state.selectedModel.fields}
              schema={this.state.schema}
            />
          )}
          <div className="Container">
            {this.state.selectedModelsAndFields[0] && (
              <Selector
                items={this.state.selectedModelsAndFields}
                selectedModel={this.state.selectedModel}
                selectedSlide={this.selectedSlide}
              />
            )}
          </div>
          {!this.state.nextView && (
            <div>
              <button
                type="submit"
                className="Button"
                onClick={this.toggleView}
              >
                connect another table
              </button>
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
          {
            <div>
              <Link to="/startQuery">
                <button className="Button">start over</button>
              </Link>
            </div>
          }
        </div>
        <div
          onClick={event => {
            //only do this if panel is about to expand
            if (!this.state.previewExpanded) {
              //
              //TODO
              // add qualifiedFields to global Object
              // --> first fields need to be added correctly to local state
              //
              // the below should work once fields are on the selectedModelsAndFields array.
              //
              // sharedObject.currQuery.qualifiedFields = this.state.selectedModelsAndFields.map(
              //   modelAndFields => modelAndFields.fields.map(field => `${modelsAndFields.model_name}.${field})
              // );

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
