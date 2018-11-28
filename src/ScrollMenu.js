import React from "react";
import Select from "react-select";
import { formatNames } from "./MakeQuery";

//re-usable component for scrollable menus - implements Select from npm's react-select library
//right now the menu items are super weirdly lightly colored - need to change this
//there are a lot of display options we can look into
class ScrollMenu extends React.Component {
  constructor(props) {
    super(props);
    const items = this.props.items;
    const itemsWithLabels = formatNames(items);
    const selectedOption = this.props.selectedOption
      ? {
          value: this.props.selectedOption,
          label: itemsWithLabels[this.props.selectedOption]
        }
      : null;

    this.state = {
      selectedOption
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedOption) {
    this.setState({
      selectedOption
    });
    this.props.handleChange(selectedOption.value);
  }

  render() {
    const items = this.props.items;
    const itemsWithLabels = formatNames(items); //[order_id, customer_id] --> {order_id: order id, customer_id: customer id}
    let listItems = [];
    if (itemsWithLabels) {
      items.forEach((elem, i) => {
        let newItem = {};
        //react-select requires that the items be passed in as an array of objects with the following keys
        newItem["value"] = elem;
        newItem["label"] = itemsWithLabels[elem];
        listItems.push(newItem);
      });
      return (
        <Select
          value={this.state.selectedOption}
          onChange={this.handleChange}
          options={listItems}
        />
      );
    } else {
      return null;
    }
  }
}

export default ScrollMenu;
