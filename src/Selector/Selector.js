import React, { Component } from 'react';
import Flickity from 'flickity';
import SubSelector from './SubSelector';

const itemStyle = {
  width: '75%',
  height: '160px',
  background: 'lightgrey',
  borderRadius: '5px',
  margin: '10px'
};

export default class Selector extends Component {
  state = {
    selectedIndex: 0,
    subSelector: false
  };

  flkty = null;
  scrollAt = null;

  componentDidMount() {
    const { subSelector, items } = this.props;
    this.scrollAt = items.length;
    if (subSelector) {
      this.setState({
        subSelector: true,
      });
    }

    this.initFlickity()
    // setTimeout(this.initFlickity, 0);
  }


  componentWillUnmount() {
    if (this.flkty) {
      this.flkty.destroy();
    }
  };

  // componentWillReceiveProps(nextProps) {
  //   // this.flkty.selectCell(nextProps.selectedIndex);
  //   this.flkty.append(this.props)
  // };

  initFlickity = () => {
    const options = {
      // cellSelector: '.item',
      contain: false,
      initialIndex: 0,
      accessibility: false,
      pageDots: false,
      wrapAround: false,
      prevNextButtons: true,
    }

    this.flkty = new Flickity(this.wrapper, options);
    // this.flkty.append()
    console.log('flkty1', this.flkty)
    this.flkty.on('dragStart', this.dragStart);
    this.flkty.on('dragEnd', this.dragEnd);
    this.flkty.on('scroll', this.onScroll);
    this.flkty.on('settle', this.onSettle);

  };

  onSettle = () => {
    const selectedIndex = this.flkty.selectedIndex;
    if (this.state.selectedIndex !== selectedIndex) {
      this.setState({
        selectedIndex: selectedIndex,
      });
    }
  };

  prevScroll = false;

  onScroll = (scroll, sub = false) => {

    if (this.dragStarted === false) {
      return;
    }

    let direction = false;

    if (this.prevScroll !== false) {
      direction = (scroll < this.prevScroll) ? 'right' : 'left';
    }

    const boundaries = {
      left: this.scrollAt * (this.state.selectedIndex),
      right: (this.scrollAt * (this.state.selectedIndex + 1)) - (this.scrollAt / 2),
    }

    // When you move the slider to the left
    if (scroll > boundaries.right && direction === 'left') {
      const next = this.state.selectedIndex += 1;
      this.setState({
        selectedIndex: next,
      });

      if (sub) {
        this.slideTo(next, false);
      }
    }

    // When you move the slider to the right
    if (scroll < boundaries.left && direction === 'right' && this.state.selectedIndex !== 0) {
      const prev = this.state.selectedIndex -= 1;
      this.setState({
        selectedIndex: prev,
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
        selectedIndex: index,
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
  };

  render() {
    const { items } = this.props;
    // this.scrollAt = items.length
    // const items = this.state.items
    console.log('ITEMS', items)
    console.log('scroll', this.scrollAt)
    // this.flkty && this.flkty.append(this.props.add)
    console.log('flkty', this.flkty)
    return (
      <div>
        <div ref={c => this.wrapper = c} >
          {items.map(item =>
            <div key={item.key} style={itemStyle} className="item">
              <div className="inner">{item.model}</div>
              {/* {
                item.categories.map(category => <div className="inner">{category}</div>)
              } */}
              {/* <div className="inner">{item.categories}</div> */}
            </div>
          )}
        </div>
        {this.state.subSelector && <SubSelector onSettle={this.onSubSettle} slideTo={this.slideTo}  selectedIndex={this.state.selectedIndex} items={items} />}
      </div>
    )
  }
}
