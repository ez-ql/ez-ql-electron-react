import React, { Component } from "react";
import squel from "squel";
import RefineQuery from "./RefineQuery";
import Joins from "./Joins";
import PreviewPanel from "./PreviewPanel";
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
      tables: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTablePreview = this.handleTablePreview.bind(this);
    this.handleScopePreview = this.handleScopePreview.bind(this);
  }

  componentDidMount() {
    const data = getData();
    this.setState({ database: data });
    ipcRenderer.on("async-query-reply", (event, arg) => {
      this.setState({ selectedData: arg });
    });
  }

  handleChange(e) {
    if (e.target.name === "selectedModel") {
      const modelName = e.target.value;
      const selectedModel = this.state.database.models.find(
        model => model.name === modelName
      );
      this.setState({ from: modelName, selectedModel });
    } else {
      let fields = [...this.state.fields];
      fields.push(e.target.value);
      this.setState({ fields });
    }
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
  }

  handleScopePreview() {
    let query = squel
      .select()
      .from(this.state.from)
      .fields(this.state.fields)
      .toString();
    ipcRenderer.send("async-new-scope-preview-query", query);
    return query;
  }

  handleTablePreview(limit) {
    let query = squel
      .select()
      .from(this.state.from)
      .fields(this.state.fields)
      .limit(limit)
      .toString();
    ipcRenderer.send("async-new-table-preview-query", query);
    return query;
  }

  render() {
    //one issue: right now, in order to pass selectedData and query as props to RefineQuery and Joins, you need to click Submit - we should change that
    return (
      <div>
        <div>
          {this.state.nextView ? (
            <RefineQuery
              data={this.state.selectedData}
              query={this.state.query}
            />
          ) : this.state.anotherTable ? (
            <Joins data={this.state.selectedData} query={this.state.query} />
          ) : (
            <div>
              <h1>Select Table</h1>
              <div>
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
              <h1>Select Fields</h1>
              <div>
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
              <div>
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
                </button>
              </div>
            </div>
          )}
        </div>
        <div>
          <PreviewPanel
            handleTablePreview={this.handleTablePreview}
            handleScopePreview={this.handleScopePreview}
            query={this.state.query}
          />
        </div>
      </div>
    );
  }
}

export default MakeQuery;
