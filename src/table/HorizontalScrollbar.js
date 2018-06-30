import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Scrollbar from './Scrollbar';
import {cx,debounceCore,joinClasses,shallowEqual, emptyFunction, 
  ReactComponentWithPureRenderMixin, invariant} from './utils/data.sheet.utils';
import FixedDataTableTranslateDOMPosition from './FixedDataTableTranslateDOMPosition';
export default class HorizontalScrollbar extends React.Component{

  constructor(props){
    super(props)
  }

  componentWillMount() {
    this._initialRender = true;
  }

  componentDidMount() {
    this._initialRender = false;
  }

  render() /*object*/ {
    var outerContainerStyle = {
      height: Scrollbar.SIZE,
      width: this.props.size,
    };
    var innerContainerStyle = {
      height: Scrollbar.SIZE,
      position: 'absolute',
      overflow: 'hidden',
      width: this.props.size,
    };
    FixedDataTableTranslateDOMPosition(
      innerContainerStyle,
      0,
      this.props.offset,
      this._initialRender,
    );

    return (
      <div
        className={joinClasses(
          cx('fixedDataTableLayout/horizontalScrollbar'),
          cx('public/fixedDataTable/horizontalScrollbar'),
        )}
        style={outerContainerStyle}>
        <div style={innerContainerStyle}>
          <Scrollbar
            {...this.props}
            isOpaque={true}
            orientation="horizontal"
            offset={undefined}
          />
        </div>
      </div>
    );
  }

}

HorizontalScrollbar.propTypes = {
  contentSize: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  onScroll: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired
}