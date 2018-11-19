// import 'gsap/TimelineLite';
// import 'gsap/TweenMax';

import React, { Component } from 'react';
import Flickity from 'flickity';

const itemStyle = {
  width: '10%',
  height: '160px',
  marginRight: '10px',
  marginLeft: '10px',
  marginBottom: '10px',
  background: 'lightgrey',
  borderRadius: '5px',
};

export default class SubSelector extends Component {
  state = {
    selectedIndex: 0,
  };

  componentDidMount() {
    const { items } = this.props;
    this.scrollAt = 1 / (items.length);
    this.initFlickity();
  }

  initFlickity = () => {
    const options = {
      // cellSelector: '.item',
      contain: false,
      initialIndex: 0,
      accessibility: false,
      pageDots: false,
      wrapAround: false,
      prevNextButtons: false,
    }

    this.flkty = new Flickity(this.wrapper, options);

    this.flkty.on('dragStart', this.dragStart);
    this.flkty.on('dragEnd', this.dragEnd);
    this.flkty.on('staticClick', this.staticClick);
    this.flkty.on('scroll', this.onScroll);
  };

  componentWillReceiveProps(nextProps) {
    this.flkty.selectCell(nextProps.selectedIndex);
    // this.flkty.append(this.props)
  };

  staticClick = (event, pointer, cellElement, cellIndex) => {
    this.allowClick = false;
    this.props.slideTo(cellIndex, false);
    this.flkty.selectCell(cellIndex);
  };

  onScroll = scroll => {
    if (this.dragStarted) {
      if (scroll > (this.scrollAt * (this.state.selectedIndex + 1))) {
        const next = this.state.selectedIndex += 1;
        this.setState({
          selectedIndex: next,
        });

        this.props.slideTo(next, false);
      }

      if (scroll < this.scrollAt * (this.props.selectedIndex)) {
        const prev = this.state.selectedIndex -= 1;
        this.setState({
          selectedIndex: prev,
        });

        this.props.slideTo(prev, false);
      }
    }
  };

  onSettle = () => {
    this.props.onSettle(this.flkty.selectedIndex);
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
    console.log('items', items)
    return (
      <div>
      <div>
        <div ref={c => this.wrapper = c}>
          {items.map((item, k) =>
            <div key={item.model} style={itemStyle} className="item">
              <div className="inner">{item.model}</div>
            </div>
          )}
        </div>
      </div>
      </div>
    );
  }
}
