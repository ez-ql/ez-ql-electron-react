import React from "react";
import ScrollMenu from "./ScrollMenu";
import { formatNames } from "./MakeQuery";
import Button from "@material-ui/core/Button";
import withToast from "./Toasts";

const electron = window.require("electron");

const SubmitButton = props => {
  return (
    <Button variant="contained" onClick={props.handleSubmit} type="button">
      Submit
    </Button>
  );
};

const SubmitButtonWithToast = withToast(
  SubmitButton,
  "Your sort order has been registered!"
);

class Sort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedFields: [],
      selectedFields: [],
      selectedModels: [],
      ascending: true,
      order: [],
      currentField: ""
    };
  }

  handleSelectedField = field => {
    let parentModel = "";
    this.state.selectedModels.forEach(model => {
      const filteredFields = model.fields.filter(
        globalField => globalField === field
      );
      filteredFields.length && (parentModel = model.model_name);
    });
    const currentField = `${parentModel}.${field}`;
    this.setState({
      currentField
    });
  };

  handleCheckBox = event => {
    this.setState(state => {
      return { ascending: !state.ascending };
    });
  };

  handleSubmit = () => {
    const order = [...this.state.order];
    order.push({
      qualifiedField: this.state.currentField,
      ascending: this.state.ascending
    });
    electron.remote.getGlobal("sharedObj").currQuery.order = order;
    const sortedFields = [...this.state.sortedFields];
    sortedFields.push(this.state.currentField.split(".")[1]);
    this.setState({
      sortedFields,
      currentField: "",
      ascending: true,
      order
    });
  };

  componentDidMount() {
    const globalObj = electron.remote.getGlobal("sharedObj");
    const currQuery = globalObj.currQuery;
    const models = globalObj.models;
    const order = currQuery.order;
    const selectedModels = currQuery.selectedModelsAndFields;
    let selectedFields = [];
    currQuery.selectedModelsAndFields.forEach(model => {
      const modelDetail = models.filter(
        globalModel => globalModel.model_name === model.model_name
      );
      modelDetail[0].fields.forEach(globalField => {
        if (model.fields.includes(globalField.field_name)) {
          selectedFields.push(globalField);
        }
      });
    });
    this.setState({
      order,
      selectedFields,
      selectedModels
    });
  }

  render() {
    return (
      <div className="Min-height-75 Title Column Center Width-50">
        <div className="Display Column Center">
          <h3>SELECT A FIELD TO SORT BY</h3>
          {/* {this.state.order.length
            ? `Currently sorted by: ${this.state.order
                .map(
                  field =>
                    `${
                      formatNames([field.qualifiedField.split(".")[1]])[
                        field.qualifiedField.split(".")[1]
                      ]
                    } in ${field.ascending ? "ascending" : "descending"} order`
                )
                .join(", ")}`
            : ""} */}
          <ScrollMenu
            items={this.state.selectedFields
              .map(field => field.field_name)
              .filter(field => !this.state.sortedFields.includes(field))}
            handleChange={this.handleSelectedField}
          />
          <div className="Padding-3">
            <label>
              {`Sort in Ascending Order?    `}
              <input
                className="Checkbox"
                type="checkbox"
                name="ascending"
                checked={this.state.ascending}
                onChange={this.handleCheckBox}
              />
            </label>
          </div>
          <SubmitButtonWithToast handleSubmit={this.handleSubmit} />
          <div />
        </div>
      </div>
    );
  }
}

export default Sort;
