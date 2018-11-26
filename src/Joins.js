import React, { Component } from "react";
import ScrollMenu from "./ScrollMenu";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const electron = window.require("electron");

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

    this.handleSelectedJoinType = this.handleSelectedJoinType.bind(this);
    this.handleSubmitJoin = this.handleSubmitJoin.bind(this);
  }

  getRemainingTables(models, selectedTables, overlap = false) {
    return models.filter(
      model => overlap === selectedTables.some(table => table === model)
    );
  }

  handleSelectedJoinType(type) {
    let joinType = this.state.allJoinTypes[type];
    electron.remote.getGlobal("sharedObj").currQuery.joinType = joinType;
    this.setState({ joinType });
  }

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

    let leftRef = `${leftTableName}.${relation.model_foreign_field}`;
    let rightRef = `${rightTableName}.${relation.relatedmodel_primary_field}`;

    const qualifiedFields = this.state.addedModelFields
      .map(elem => `${rightTableName}.${elem}`)
      .concat(
        this.state.baseModelFields.map(elem => `${leftTableName}.${elem}`)
      );

    electron.remote.getGlobal(
      "sharedObj"
    ).currQuery.qualifiedFields = qualifiedFields;
    electron.remote.getGlobal("sharedObj").currQuery.leftRef = leftRef;
    electron.remote.getGlobal("sharedObj").currQuery.rightRef = rightRef;
  }

  componentDidMount() {
    console.log('IN JOINS')
    let sharedObj = electron.remote.getGlobal("sharedObj");
    let models = electron.remote.getGlobal("sharedObj").models;
    let currQuery = electron.remote.getGlobal("sharedObj").currQuery;
    let selectedModelsAndFields = currQuery.selectedModelsAndFields.reverse();
    let baseModel = selectedModelsAndFields[0];
    let baseModelFields = selectedModelsAndFields[0].fields;
    let addedModel = selectedModelsAndFields[1];
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
    console.log('staate', this.state.models.length)
    // if (this.state.models.length) {
    //   const remainingTables = this.getRemainingTables(
    //     this.state.models.map(elem => elem.model_name),
    //     this.state.selectedTables
    //   );
      return (
      <div>
      <div className='Flex-Container Width-75 Height-75'>
        <div className='Column Center Height-50'>

        <div>
          {
            <div>
              <h3>How would you like to combine these tables?</h3>
              <ScrollMenu
                items={Object.keys(this.state.allJoinTypes)}
                handleChange={this.handleSelectedJoinType}
              />
              <Button
                type="button"
//ADD link
// to component={Link}
// to="/startQuery"
                onClick={() => this.handleSubmitJoin()}>
                Next
              </Button>
            </div>
          }
        </div>
      </div>
      </div>
      </div>
      );
    {/* } else {
      return null;
    } */}
    // }
  }
}

export default Joins;
