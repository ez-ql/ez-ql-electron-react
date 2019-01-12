import React, { Component } from "react";
import ScrollMenu from "./ScrollMenu";
import Button from "@material-ui/core/Button";
import { formatNames } from "./MakeQuery";
const electron = window.require("electron");

class Joins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseModel: {},
      baseModelHumanName: "",
      addedModel: {},
      addedModelHumanName: "",
      joinType: "join",
      allJoinTypes: {},
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
    let joinType = !type ? this.state.joinType : this.state.allJoinTypes[type];
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
    electron.remote.getGlobal(
      "sharedObj"
    ).currQuery.joinType = this.state.joinType;
    this.props.handleClose();
  }

  componentDidMount() {
    let sharedObj = electron.remote.getGlobal("sharedObj");
    let models = electron.remote.getGlobal("sharedObj").models;
    let currQuery = electron.remote.getGlobal("sharedObj").currQuery;
    let selectedModelsAndFields = currQuery.selectedModelsAndFields.reverse();
    let baseModel = selectedModelsAndFields[0];
    let addedModel = selectedModelsAndFields[1];
    let [baseModelHumanName, addedModelHumanName] = Object.values(
      formatNames([baseModel.model_name, addedModel.model_name])
    );
    let allJoinTypes = {
      [`Only show me data with entries in both ${baseModelHumanName} and ${addedModelHumanName}. No empty cells, please.`]: "join",
      [`Show me everything. Empty cells in either ${baseModelHumanName} or ${addedModelHumanName} are okay.`]: "outer_join",
      [`Show me everything from ${baseModelHumanName}. Empty cells in ${addedModelHumanName} are okay.`]: "left_join",
      [`Show me everything from ${addedModelHumanName}. Empty cells in ${baseModelHumanName} are okay.`]: "right_join"
    };

    this.setState({
      baseModel,
      sharedObj,
      models,
      currQuery,
      addedModel,
      baseModelHumanName,
      addedModelHumanName,
      allJoinTypes
    });
  }

  render() {
    return (
      <div>
        {
          <div>
            <h3>What data would you like to see from these two tables?</h3>
            <ScrollMenu
              items={Object.keys(this.state.allJoinTypes)}
              handleChange={this.handleSelectedJoinType}
              selectedOption={`Only show me data with entries in both ${
                this.state.baseModelHumanName
              } and ${this.state.addedModelHumanName}. No empty cells, please.`}
            />
            <div className="Margin-top-5">
              <Button
                variant="contained"
                color="primary"
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
