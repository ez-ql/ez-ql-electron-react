import React, { Component } from "react";
import Flickity from "flickity";
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { withStyles } from '@material-ui/core/styles';


const itemStyle = {
  width: "300px",
  height: "350px",
  background: "lightgrey",
  borderRadius: "10px",
  margin: "10px",
  backgroundColor: "#b5e4e4",
  border: "rgb(92, 92, 92)",
  boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
};

const styles = theme => ({
  root: {
    color: theme.palette.text.primary,
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: 18,
    color: "rgb(92, 92, 92)"
  },
});

 class Selector extends Component {
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
      pageDots: false,
      wrapAround: false,
      prevNextButtons: false
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
    console.log('str', str)
    console.log( )
    let mod;
    if (!str){
       return str;
    } else if (str.includes("_")) {
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
    const { items, classes } = this.props;
    console.log("SELECTOR PROPS", this.props);
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
                className={`${item.model_name} inner Grey Larger-font`}
                id={item.model_name}
              >{`${this.formatTableAndFieldNames(item.model_name)} Table`}</div>
              <div>
                {item.fields.map(category => (
                  <div className="inner Row Flex-space-around ">
                    <div className="Smaller-font Align-self-end">
                      {this.formatTableAndFieldNames(category)}
                    </div>
                    <div
                        className="inner Max-height"
                        onClick={() =>
                          this.props.removeField(category, item.model_name)
                        }
                      >
                        <DeleteOutlinedIcon className={classes.icon} />
                    </div>
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


export default withStyles(styles)(Selector)
