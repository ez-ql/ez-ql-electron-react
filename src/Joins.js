import React, { Component } from "react";
import squel from "squel";
import ScrollMenu from "./ScrollMenu";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

class Joins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseModel: {},
      baseModelFields: [],
      addedModel: [],
      addedModelFields: [],
      fields: [],
      selectedTableFields: [],
      selectedTables: [],
      tableToAdd: "",
      joinType: "",
      allJoinTypes: {
        "I want to see only records that have matching references in BOTH tables (inner join)":
          "join",
        "I want to see all records in BOTH tables whether or not there are matching references (outer join)":
          "outer_join",
        "I want to see all records in my initial selection that also have a reference in this new table (left join)":
          "left_join",
        "I want to see all records in this new table and their matching references in my initial selection, if any (right join)":
          "right_join"
      },
      refLeft: "",
      refRight: "",
      tableFields: [],
      sharedObj: {},
      models: [],
      currQuery: {},
      relatedModels: []
    };
    this.handleSelectedTable = this.handleSelectedTable.bind(this);
    this.handleFieldSelection = this.handleFieldSelection.bind(this);
    this.handleSelectedJoinType = this.handleSelectedJoinType.bind(this);
    this.handleSelectedJoinRefLeft = this.handleSelectedJoinRefLeft.bind(this);
    this.handleSelectedJoinRefRight = this.handleSelectedJoinRefRight.bind(
      this
    );
    this.handleSubmitJoin = this.handleSubmitJoin.bind(this);
  }

  getRemainingTables(models, selectedTables, overlap = false) {
    return models.filter(
      model => overlap === selectedTables.some(table => table === model)
    );
  }

  handleSelectedTable(table) {
    let tableToAdd = table;
    let addedModel = [...this.state.addedModel, tableToAdd];
    let selectedTableFields = this.state.models
      .filter(elem => elem.model_name === tableToAdd)[0]
      .fields.map(elem => `${elem.field_name}`);
    electron.remote.getGlobal("sharedObj").currQuery.addedModel = addedModel;

    this.setState({
      tableToAdd,
      addedModel,
      selectedTableFields
    });
  }

  handleFieldSelection(fields) {
    //selectedTableFields = all fields from selected join table
    let addedModelFields = [...this.state.addedModelFields];
    addedModelFields = fields.map(elem => elem.value);
    electron.remote.getGlobal(
      "sharedObj"
    ).currQuery.addedModelFields = Array.from(
      new Set(
        [...this.state.currQuery.addedModelFields].concat(addedModelFields)
      )
    );
    electron.remote.getGlobal("sharedObj").currQuery.fields = Array.from(
      new Set([...this.state.currQuery.fields].concat(addedModelFields))
    );
    this.setState({
      addedModelFields
    });
  }

  handleSelectedJoinType(type) {
    let joinType = this.state.allJoinTypes[type];
    electron.remote.getGlobal("sharedObj").currQuery.joinType = joinType;
    this.setState({ joinType });
  }

  handleSelectedJoinRefLeft(col) {
    let refLeft = col;
    electron.remote.getGlobal("sharedObj").currQuery.refLeft = refLeft;
    this.setState({ refLeft });
  }

  handleSelectedJoinRefRight(col) {
    let refRight = col;
    electron.remote.getGlobal("sharedObj").currQuery.refRight = refRight;
    this.setState({
      refRight
    });
  }

  //was not able to pass the join_type as a variable to the squel function
  //workaround: long long long ternary :(
  handleSubmitJoin(event) {
    event.preventDefault();

    let leftTable = this.state.baseModel;
    let leftTableName = leftTable.model_name;
    let rightTable = this.state.addedModel;
    let rightTableName = rightTable.model_name;

    let rightTableId = this.state.models.filter(
      elem => elem.model_name === rightTableName
    )[0].model_id;

    let relation = leftTable.related_models.filter(
      elem => elem.relatedmodel_id === rightTableId
    )[0];

    let leftRef = `${relation.model_foreign_field}`;
    let rightRef = `${relation.relatedmodel_primary_field}`;

    const qualifiedFields = this.state.addedModelFields
    .map(elem => `${rightTableName}.${elem}`)
    .concat(
      this.state.baseModelFields.map(
        elem => `${leftTableName}.${elem}`
      )
    )

    electron.remote.getGlobal('sharedObj').currQuery.qualifiedFields = qualifiedFields;
    electron.remote.getGlobal('sharedObj').currQuery.leftRef = leftRef
    electron.remote.getGlobal('sharedObj').currQuery.rightRef = rightRef
    // let newQuery;
    // this.state.joinType === "join"
    //   ? (newQuery = squel
    //       .select()
    //       .fields(
    //         this.state.addedModelFields
    //           .map(elem => `${rightTableName}.${elem}`)
    //           .concat(
    //             this.state.baseModelFields.map(
    //               elem => `${leftTableName}.${elem}`
    //             )
    //           )
    //       )
    //       .from(leftTableName)
    //       .join(
    //         rightTableName,
    //         null,
    //         `${leftTableName}.${leftRef} = ${rightTableName}.${rightRef}`
    //       )
    //       .toString())
    //   : //current issue: outer join is broken for some reason
    //   this.state.joinType === "outer_join"
    //   ? (newQuery = squel
    //     .select()
    //     .fields(
    //       this.state.addedModelFields
    //         .map(elem => `${rightTableName}.${elem}`)
    //         .concat(
    //           this.state.baseModelFields.map(
    //             elem => `${leftTableName}.${elem}`
    //           )
    //         )
    //     )
    //     .from(leftTableName)
    //     .outer_join(
    //       rightTableName,
    //       null,
    //       `${leftTableName}.${leftRef} = ${rightTableName}.${rightRef}`
    //     )
    //     .toString())
    //   : this.state.joinType === "left_join"
    //   ? (newQuery = squel
    //     .select()
    //     .fields(
    //       this.state.addedModelFields
    //         .map(elem => `${rightTableName}.${elem}`)
    //         .concat(
    //           this.state.baseModelFields.map(
    //             elem => `${leftTableName}.${elem}`
    //           )
    //         )
    //     )
    //     .from(leftTableName)
    //     .left_join(
    //       rightTableName,
    //       null,
    //       `${leftTableName}.${leftRef} = ${rightTableName}.${rightRef}`
    //     )
    //     .toString())
    //   : (newQuery = squel
    //     .select()
    //     .fields(
    //       this.state.addedModelFields
    //         .map(elem => `${rightTableName}.${elem}`)
    //         .concat(
    //           this.state.baseModelFields.map(
    //             elem => `${leftTableName}.${elem}`
    //           )
    //         )
    //     )
    //     .from(leftTableName)
    //     .right_join(
    //       rightTableName,
    //       null,
    //       `${leftTableName}.${leftRef} = ${rightTableName}.${rightRef}`
    //     )
    //     .toString())
    // //once join query is _finally_ constructed, send to main process to query db
    // ipcRenderer.send("async-new-query", newQuery);
  }

  componentDidMount() {
    let sharedObj = electron.remote.getGlobal("sharedObj");

    let models = electron.remote.getGlobal("sharedObj").models;
    let currQuery = electron.remote.getGlobal("sharedObj").currQuery;
    // let fields = electron.remote.getGlobal("sharedObj").currQuery.fields;
    let selectedModelsAndFields = currQuery.selectedModelsAndFields.reverse()
    let baseModel = selectedModelsAndFields[0]
    let baseModelFields = selectedModelsAndFields[0].fields;
    let addedModel = selectedModelsAndFields[1]
    let addedModelFields = selectedModelsAndFields[1].fields;

    this.setState({
      baseModelFields,
      baseModel,
      sharedObj,
      models,
      currQuery,
      addedModel,
      addedModelFields
    });
  }

  render() {
    if (this.state.models.length) {
      const remainingTables = this.getRemainingTables(
        this.state.models.map(elem => elem.model_name),
        this.state.selectedTables
      );
      return (
        <div>
          {
            <div>
              <h3>How would you like to combine these tables?</h3>
              <ScrollMenu
                items={Object.keys(this.state.allJoinTypes)}
                handleChange={this.handleSelectedJoinType}
              />
              <button type="button" onClick={this.handleSubmitJoin}>
                Submit
              </button>
            </div>
           }
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Joins;
