import React, { Component } from "react";
import squel from "squel";
import Selector from './Selector/Selector'
import SelectTable from './SelectTable'
import SelectFields from './SelectFields'

const electron = window.require("electron");
const Store = window.require("electron-store");
const store = new Store();
const ipcRenderer = electron.ipcRenderer;


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

const getData = () => {
  return database;
};

class MakeQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: "",
      // query: "",
      fields: [],
      database: {},
      selectedModel: {
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
          }]},
      selectedData: {},
      anotherTable: false,
      nextView: false,
      tables: [],
      selectedModelsAndFields: [],
      selectedSlide: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.selectedSlide = this.selectedSlide.bind(this);
  }

  componentDidMount() {
    const data = getData();
    this.setState({ database: data });
    ipcRenderer.on("async-query-reply", (event, arg) => {
      this.setState({ selectedData: arg });
      console.log("***********", this.state.selectedData);
    });
    ipcRenderer.send("async-selected-db-schema", 'SELECT models.model_id, models.model_name, foreignKeys.relatedModel_id, foreignKeys.model_foreign_field , foreignKeys.relatedModel_primary_field FROM models LEFT JOIN foreignKeys on models.model_id = foreignKeys.model_id');
    ipcRenderer.on("async-db-schema-reply", (event, arg) => {
      this.setState({ clientDatabase: arg });
      console.log("***rendered db schema***", arg);
    });
  }

  handleChange(e) {
    if (e.target.name === "selectedModel") {
      const modelName = e.target.value;
      const selectedModel = this.state.database.models.find(
        model => model.name === modelName
      );
      const selectedModelsAndFields = [...this.state.selectedModelsAndFields];
      const includesSelectedModel = selectedModelsAndFields.filter(model => model.model === modelName)
      if (!includesSelectedModel[0]) {
        selectedModelsAndFields.unshift({ model: modelName, fields: [] })
        this.setState({ from: modelName, nextView: true, selectedModel, selectedModelsAndFields });
      }
    } else {
      let newField = e.target.value;
      let fields = [...this.state.fields];
      const includes = fields.filter(field => field === newField)
      if(!includes[0]){
        fields.push(newField);
        let selectedModelsAndFields = this.state.selectedModelsAndFields
          .map(table => {
            if (this.state.selectedModel.name === table.model) {
              table.fields.push(newField);
              return table
            }
            return table
          })
          this.setState({ fields, selectedModelsAndFields });
      }
    }
  }

  toggleView() {
    this.setState({ nextView: false })
  }

  handleSubmit(e) {
    e.preventDefault();
    const query = squel
      .select()
      .from(this.state.from)
      .fields(this.state.fields)
      .toString();
    ipcRenderer.send("async-new-query", query);
    this.setState({ query });
    store.set("query", query);
    // this.setState({
    //   from: "",
    //   fields: []
    // })
  }

  selectedSlide (modelName) {
    console.log('here')
    const selectedModel = this.state.database.models.find(
      model => model.name === modelName
    );
    this.setState({ selectedModel })
  }

  render() {
    //one issue: right now, in order to pass selectedData and query as props to RefineQuery and Joins, you need to click Submit - we should change that
    console.log('selected', this.state.selectedModelsAndFields);
    console.log('selectedModel', this.state.selectedModel)
    console.log('next', this.state.nextView)
    return (
      <div className='Flex-Container'>
        <div className='Column Center'>
          {
            !this.state.nextView ?
              <SelectTable handleChange={this.handleChange} model={this.state.selectedModel}  />
              : <SelectFields handleChange={this.handleChange} fields={this.state.selectedModel.fields} />
          }
          <div className='Container'>
            {
              this.state.selectedModelsAndFields[0] &&
              <Selector subSelector items={this.state.selectedModelsAndFields} selectedModel={this.state.selectedModel} selectedSlide={this.selectedSlide}/>
            }
          </div>
          {
            this.state.nextView &&
            <div>
              <button
                type='submit'
                className='Button'
                onClick={this.toggleView}>
                connect another table
              </button>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default MakeQuery;
