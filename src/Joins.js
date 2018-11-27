import React, { Component } from "react";
import ScrollMenu from "./ScrollMenu";
import Button from "@material-ui/core/Button";
const electron = window.require("electron");

class Joins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseModel: {},
      addedModel: {},
      joinType: "join",
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
      sharedObj: {},
      models: [],
      currQuery: {},
      relatedModels: []
    };

    this.handleSelectedJoinType = this.handleSelectedJoinType.bind(this);
    this.handleSubmitJoin = this.handleSubmitJoin.bind(this);
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
    electron.remote.getGlobal("sharedObj").currQuery.leftRef = leftRef;
    electron.remote.getGlobal("sharedObj").currQuery.rightRef = rightRef;
    console.log("current selection", this.state.joinType);
    this.props.handleClose();
  }

  componentDidMount() {
    let sharedObj = electron.remote.getGlobal("sharedObj");
    let models = electron.remote.getGlobal("sharedObj").models;
    let currQuery = electron.remote.getGlobal("sharedObj").currQuery;
    let selectedModelsAndFields = currQuery.selectedModelsAndFields.reverse();
    let baseModel = selectedModelsAndFields[0];
    let addedModel = selectedModelsAndFields[1];

    this.setState({
      baseModel,
      sharedObj,
      models,
      currQuery,
      addedModel
    });
  }

  render() {
    return (
      <div>
        {
          <div>
            <h3>How would you like to combine these tables?</h3>
            <ScrollMenu
              items={Object.keys(this.state.allJoinTypes)}
              handleChange={this.handleSelectedJoinType}
              selectedOption={
                "I want to see only records that have matching references in BOTH tables (inner join)"
              }
            />
            <div className="Margin-top-5">
              <Button
                variant="contained"
                type="button"
                onClick={this.handleSubmitJoin}
              >
                Submit
              </Button>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Joins;
