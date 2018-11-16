import React, { Component } from 'react';
import squel from 'squel'

const database = {
  id: 1,
  name: 'BikeStores',
  organizationId: 1,
  models: [
    {
      id: 1,
      name: "orders",
      databaseId: 1,
      fields: [
        {
          id: 1,
          name: "orderId",
          modelId: 1
        },
        {
          id: 2,
          name: "orderDate",
          modelId: 1
        },
        {
          id: 3,
          name: "orderAmount",
          modelId: 1
        },
        {
          id: 4,
          name: "userId",
          modelId: 1
        }
      ]
    }
    // ,
    // {
    //   id: 2,
    //   name: "customers",
    //   databaseId: 1,
    //   fields: [
    //     {
    //       id: 1,
    //       name: "customerId",
    //       modelId: 1
    //     },
    //     {
    //       id: 2,
    //       name: "firstName",
    //       modelId: 1
    //     },
    //     {
    //       id: 3,
    //       name: "lastName",
    //       modelId: 1
    //     }
    //   ]
    // }
  ]
};

const getData = () => {
  return database;
}

class MakeQuery extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      from: '',
      fields: [],
      database: {},
      selectedModel: {}
    })
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount(){
    const data = getData();
    this.setState({ database: data })
  }

  handleChange(e){
    if(e.target.name === 'selectedModel'){
      const modelName = e.target.value;
      const selectedModel = this.state.database.models.find(model => model.name === modelName)
      this.setState({ from: modelName, selectedModel })
    } else {
      let fields = [...this.state.fields];
      fields.push(e.target.value);
      this.setState({ fields })
    }

  }

  handleSubmit(e){
    e.preventDefault();
    const query = squel.select()
      .from(this.state.from)
      .fields(this.state.fields).toString()
    console.log(query);
  }

  render() {

    return (
      <div>
        <h1>Select Table</h1>
        <div>
          {
            this.state.database.models &&
            this.state.database.models.map(model => {
              return (
                <div>
                  <button type='submit' name='selectedModel' value={model.name} onClick={this.handleChange}>{model.name}</button>
                </div>
              )
            })
          }
        </div>
        <h1>Select Fields</h1>
        <div>
          {
            this.state.selectedModel.fields &&
            this.state.selectedModel.fields.map(field => {
              return (
                <div>
                  <button type='submit' name='fields' value={field.name} onClick={this.handleChange}>{field.name}</button>
                </div>
              )
            })
          }
        </div>
        <div>
          <button type='submit' onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    )
  }

}

export default MakeQuery
