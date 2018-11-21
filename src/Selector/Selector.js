import React, { Component } from 'react';
import Flickity from 'flickity';

const itemStyle = {
  width: '30%',
  height: '260px',
  background: 'lightgrey',
  borderRadius: '5px',
  margin: '10px'
};

export default class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      subSelector: false,
    }
    this.appendChange=this.appendChange.bind(this)
  }

  // flkty = null;
  scrollAt = null;

  componentDidMount() {
    const { subSelector, items } = this.props;
    this.scrollAt = items.length;

    if (subSelector) {
      this.setState({
        selectedIndex: items.length,
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

  componentDidUpdate(prevProps, prevState){
    console.log('flkty changed', this.state.selectedIndex)
    console.log('prev', prevState, 'currState', this.state)
    console.log('prevProps', prevProps, 'currProps', this.props)
    if(prevProps.items !== this.props.items){
      this.appendChange();
    }
  }

  initFlickity = () => {
    const options = {
      cellSelector: '.item',
      contain: false,
      initialIndex: this.scrollAt,
      accessibility: false,
      pageDots: false,
      wrapAround: false,
      prevNextButtons: true,
    }

    this.flkty = new Flickity(this.wrapper, options);
    this.flkty.on('dragStart', this.dragStart);
    this.flkty.on('dragEnd', this.dragEnd);
    this.flkty.on('scroll', this.onScroll);
    this.flkty.on('settle', this.onSettle);

  };

  onSettle = () => {
    console.log('onSettle', this.flkty.selectedIndex)
    const selectedIndex = this.flkty.selectedIndex;
    if (this.state.selectedIndex !== selectedIndex) {
      console.log('here')
      this.setState({
        selectedIndex: selectedIndex,
      });
    }
    const modelName = this.flkty.selectedSlide.cells[0].element.innerText.split(' ')[0]
      console.log('modelNAME', modelName)
    this.props.selectedSlide(modelName)
  };

  prevScroll = false;

  onScroll = (scroll, sub = false) => {
    console.log('onScroll')
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
      console.log('onScroll1')
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
      console.log('onScroll2', this.state.selectedIndex, prev)
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
      console.log('onScroll3')
      this.setState({
        selectedIndex: index,
      });
    }
  };

  onSubSettle = index => {
    console.log('onSubsettle')
    if (this.flkty.selectedIndex !== index) {
      this.slideTo(index, false);
    }
  };

  dragStarted = false;

  dragStart = e => {
    this.dragStarted = true;
  };

  dragEnd = e => {
    console.log('ondragEnd')
    this.dragStarted = false;
    const modelName = this.flkty.selectedSlide.cells[0].element.innerText.split(' ')[0]
      console.log('modelNAME', modelName)
    this.props.selectedSlide(modelName)
  };

  appendChange(){
    if (this.flkty) {
      this.flkty.destroy();
      this.initFlickity();
    }
  }

  render() {
    const { items } = this.props;
    return (
      <div>
        <div ref={ch => this.wrapper = ch} >
          {items.map(item =>
            <div  style={itemStyle} className="item">
              <div className="inner Color">{`${item.model} table`}</div>
              {
                item.fields.map(category => <div className="inner">{category}</div>)
              }
            </div>
          )}
        </div>
      </div>
    )
  }
}
