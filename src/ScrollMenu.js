import React from "react";
import Select from "react-select";

//re-usable component for scrollable menus - implements Select from npm's react-select library
//right now the menu items are super weirdly lightly colored - need to change this
//there are a lot of display options we can look into
class ScrollMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedOption) {
    this.setState({
      selectedOption: selectedOption
    });
    this.props.handleChange(selectedOption.value);
    console.log(`Option selected:`, selectedOption);
  }

  render() {
    const items = this.props.items;
    let listItems = [];
    if (items) {
      items.map((elem, i) => {
        let newItem = {};
        //react-select requires that the items be passed in as an array of objects with the following keys
        newItem["value"] = elem;
        newItem["label"] = elem;
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
