import React, { Component } from "react";
import Flickity from "flickity";

const itemStyle = {
  width: "200px",
  height: "260px",
  background: "lightgrey",
  borderRadius: "10px",
  margin: "10px",
  backgroundColor: "rgb(105, 186, 186)",
  border: "rgb(92, 92, 92)"
  // width: "30%",
  // height: "260px",
  // background: "lightgrey",
  // borderRadius: "5px",
  // margin: "10px"
};

export default class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      subSelector: false
    };
    this.appendChange = this.appendChange.bind(this);
  }

  // flkty = null;
  scrollAt = null;

  componentDidMount() {
    const { subSelector, items } = this.props;
    this.scrollAt = items.length;

    if (subSelector) {
      this.setState({
        selectedIndex: items.length,
        subSelector: true
      });
    }

    this.initFlickity();
    // setTimeout(this.initFlickity, 0);
  }

  componentWillUnmount() {
    if (this.flkty) {
      this.flkty.destroy();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.items !== this.props.items) {
      this.appendChange();
    }
  }

  initFlickity = (idx = this.scrollAt) => {
    const options = {
      cellSelector: ".item",
      contain: false,
      initialIndex: idx,
      accessibility: false,
      pageDots: true,
      wrapAround: false,
      prevNextButtons: true
    };

    this.flkty = new Flickity(this.wrapper, options);
    this.flkty.on("dragStart", this.dragStart);
    this.flkty.on("dragEnd", this.dragEnd);
    this.flkty.on("scroll", this.onScroll);
    this.flkty.on("settle", this.onSettle);
  };

  onSettle = () => {
    const selectedIndex = this.flkty.selectedIndex;
    if (this.state.selectedIndex !== selectedIndex) {
      this.setState({
        selectedIndex: selectedIndex
      });
    }
    const modelName = this.flkty.selectedSlide.cells[0].element.firstChild
      .classList[0];
    console.log("MODEL NAME", modelName);

    this.props.selectedSlide(modelName);
  };

  prevScroll = false;

  onScroll = (scroll, sub = false) => {
    if (this.dragStarted === false) {
      return;
    }

    let direction = false;

    if (this.prevScroll !== false) {
      direction = scroll < this.prevScroll ? "right" : "left";
    }

    const boundaries = {
      left: this.scrollAt * this.state.selectedIndex,
      right: this.scrollAt * (this.state.selectedIndex + 1) - this.scrollAt / 2
    };

    // When you move the slider to the left
    if (scroll > boundaries.right && direction === "left") {
      const next = (this.state.selectedIndex += 1);
      this.setState({
        selectedIndex: next
      });

      if (sub) {
        this.slideTo(next, false);
      }
    }

    // When you move the slider to the right
    if (
      scroll < boundaries.left &&
      direction === "right" &&
      this.state.selectedIndex !== 0
    ) {
      const prev = (this.state.selectedIndex -= 1);
      this.setState({
        selectedIndex: prev
      });

      if (sub) {
        this.slideTo(prev, false);
      }
    }

    this.prevScroll = scroll;
  };

  slideTo = (index, updateState = true) => {
    this.flkty.selectCell(index);

    if (updateState) {
      this.setState({
        selectedIndex: index
      });
    }
  };

  onSubSettle = index => {
    if (this.flkty.selectedIndex !== index) {
      this.slideTo(index, false);
    }
  };

  dragStarted = false;

  dragStart = e => {
    this.dragStarted = true;
  };

  dragEnd = e => {
    this.dragStarted = false;
    const modelName = this.flkty.selectedSlide.cells[0].element.firstChild
      .classList[0];
    this.props.selectedSlide(modelName);
  };

  appendChange() {
    if (this.flkty) {
      console.log("SELECTED INERX", this.state.selectedIndex);
      console.log("SELECTED FLKTY", this.flkty);
      this.flkty.destroy();
      this.initFlickity();
    }
  }

  //func to format name of selected table in carousel
  //takes str, not array, like in rest of query-builder
  formatTableAndFieldNames = str => {
    let mod;
    if (!str) return str;
    if (str.includes("_")) {
      let [first, second] = str.split("_");
      mod = `${first.charAt(0).toUpperCase()}${first.slice(1)} ${second
        .charAt(0)
        .toUpperCase()}${second.slice(1)}`;
    } else {
      mod = `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
    }
    return mod;
  };

  render() {
    const { items } = this.props;
    console.log("SelectedIDX", this.state.selectedIndex);
    return (
      <div>
        {/* <div ref={ch => this.wrapper = ch} >
          {items.map(item =>
            <div  style={itemStyle} className="item Grey">
              <div className="inner Grey">{`${item.model_name} table`}</div >
              {
                item.fields.map(category =>
                <div className='Grey'>{category} <button className="inner Lightgrey White" onClick={() => this.props.removeField(category, item.model_name)}> x </button></div>)
              } */}
        <div ref={ch => (this.wrapper = ch)}>
          {items.map(item => (
            <div style={itemStyle} className="item Grey Display Column">
              <div
                className={`${item.model_name} inner White`}
                id={item.model_name}
              >{`${this.formatTableAndFieldNames(item.model_name)} Table`}</div>
              <div>
                {item.fields.map(category => (
                  <div className="inner">
                    {this.formatTableAndFieldNames(category)}
                    <button
                      className="inner"
                      onClick={() =>
                        this.props.removeField(category, item.model_name)
                      }
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
