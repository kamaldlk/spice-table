import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import FixedDataTableCellGroup from './FixedDataTableCellGroup';
import FixedDataTableRowImpl from './FixedDataTableRowimpl';
import Scrollbar from './Scrollbar';
import {cx, joinClasses} from './utils/data.sheet.utils';
import FixedDataTableTranslateDOMPosition from './FixedDataTableTranslateDOMPosition';
var HEADER_BORDER_BOTTOM_WIDTH = 1;
export default class FixedDataTableRow extends React.Component {
  static propTypes = {
    isScrolling: PropTypes.bool,
    height: PropTypes.number.isRequired,
    zIndex: PropTypes.number,
    offsetTop: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  };

  componentWillMount() {
    this._initialRender = true;
  }

  componentDidMount() {
    this._initialRender = false;
  }

  render() {
    var style = {
      width: this.props.width,
      height: this.props.height,
      zIndex: (this.props.zIndex ? this.props.zIndex : 0),
    };
    FixedDataTableTranslateDOMPosition(style, 0, this.props.offsetTop, this._initialRender);

    return (
      <div
        style={style}
        className={cx('fixedDataTableRowLayout/rowWrapper')}>
        <FixedDataTableRowImpl
          {...this.props}
          offsetTop={undefined}
          zIndex={undefined}
        />
      </div>
    );
  }
}