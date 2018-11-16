import React, { Component } from "react";
import squel from "squel";
const electron = window.require("electron");
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
      fields: [],
      database: {},
      selectedModel: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const data = getData();
    this.setState({ database: data });
    ipcRenderer.on("async-query-reply", (event, arg) => {
      console.log("arg****", arg);
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
    console.log(query);
    ipcRenderer.send("async-new-query", query);
  }

  render() {
    return (
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
          <button type="submit" onClick={this.handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default MakeQuery;
