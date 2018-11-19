import React, { Component } from "react";
import squel from "squel";
import RefineQuery from "./RefineQuery";
import Joins from "./Joins";
import Selector from './Selector/Selector'

const electron = window.require("electron");
const Store = window.require("electron-store");
const store = new Store();
const ipcRenderer = electron.ipcRenderer;


const database = {
  id: 1,
  name: "BikeStores",
  organizationId: 1,
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
      query: "",
      fields: [],
      database: {},
      selectedModel: {},
      selectedData: {},
      anotherTable: false,
      nextView: false,
      tables: [],
      selectedTablesAndFields: [{model:'stt', category: []}, {model: 'st', category: []}, {model: 'st', category: [] }],

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const data = getData();
    this.setState({ database: data });
    ipcRenderer.on("async-query-reply", (event, arg) => {
      this.setState({ selectedData: arg });
      console.log("***********", this.state.selectedData);
    });
  }

  handleChange(e) {
    if (e.target.name === "selectedModel") {
      const modelName = e.target.value;
      const selectedModel = this.state.database.models.find(
        model => model.name === modelName
      );
      const selectedTablesAndFields = [...this.state.selectedTablesAndFields];
      selectedTablesAndFields.push({ model: modelName, categories: [] })
      this.setState({ from: modelName, selectedModel, selectedTablesAndFields });
    } else {
      let fields = [...this.state.fields];
      fields.push(e.target.value);
      this.setState({ fields });
    }
  }

  // createTable(e){
  //   const
  // }

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

  render() {
    //one issue: right now, in order to pass selectedData and query as props to RefineQuery and Joins, you need to click Submit - we should change that
    console.log('selected', this.state.selectedTablesAndFields)
    const items = this.state.selectedTablesAndFields
    return (
      <div className='Flex-Container'>
        {this.state.nextView ? (
          <RefineQuery
            data={this.state.selectedData}
            query={this.state.query}
          />
        ) : this.state.anotherTable ? (
          <Joins data={this.state.selectedData} query={this.state.query} />
        ) : (
          <div className='Column'>
          <div className='Row'>
              <div className='Title'>
              <div >
            <h1>Select Table</h1>
              </div>
            <div className='Row-buttons'>
                    {this.state.database.models &&
                      this.state.database.models.map(model => {
                        return (
                          <div>
                            <button
                              type="submit"
                              name="selectedModel"
                              value={model.name}
                              onClick={this.handleChange}
                            >
                              {model.name}
                            </button>
                          </div>
                        );
                      })}
                  </div>
                  <div>
                    {this.state.tables[0] && this.state.tables.map(table => {
                      return (
                        <div className='Table-box'>
                        <h6>{table}</h6>
                        </div>
                      )
                    })}
                  </div>
            {/* <div> */}
            {/* <div> */}


                </div>

                <div className='Title'>
                <div  >
                <h1>Select Fields</h1>
                </div>

                <div className='Row-buttons'>
              {this.state.selectedModel.fields &&
                this.state.selectedModel.fields.map(field => {
                  return (
                    <div>
                      <button
                        type="submit"
                        name="fields"
                        value={field.name}
                        onClick={this.handleChange}
                      >
                        {field.name}
                      </button>
                    </div>

                  );
                })}
            </div>
            </div>
            {/* <div>
              {
                //current bug: sometimes you need to click Submit twice in order to log query results to console
              }
              <button type="submit" onClick={this.handleSubmit}>
                Submit
              </button>
              {
                //assuming this button is temporary - just added it to feign the flow for development
              }
              <button
                type="button"
                onClick={() =>
                  this.setState({ nextView: !this.state.nextView })
                }
              >
                Refine Selection
              </button> */}
            {/* </div> */}
          </div>
          <div className='Container'>
          <Selector subSelector items={this.state.selectedTablesAndFields} add={{model: 'ab'}}/>
          </div>
          </div>

        )}

      </div>
    );
  }
}

export default MakeQuery;
