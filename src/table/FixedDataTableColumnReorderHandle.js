import React from 'react';
import ReactDOM from 'react-dom';
import DOMMouseMoveTracker from './utils/DOMMouseMoveTracker';
import PropTypes from 'prop-types';
import {ReactComponentWithPureRenderMixin, Locale, clamp, cx} from './utils/data.sheet.utils';
import FixedDataTableEventHelper from './FixedDataTableEventHelper';

export default class FixedDataTableColumnReorderHandle extends React.Component{
  static propTypes = {
    onColumnReorderEnd: PropTypes.func,
    columnKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    touchEnabled: PropTypes.bool,
  }
  constructor (props) {
    super(props)
    this.state = {
      dragDistance: 0
    }
    this.onMouseDown = this.onMouseDown.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onColumnReorderEnd = this._onColumnReorderEnd.bind(this);
    this._updateState = this._updateState.bind(this);
  }

  componentWillReceiveProps(/*object*/ newProps) {
  }

  componentWillUnmount() {
    if (this._mouseMoveTracker) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
      this._mouseMoveTracker.releaseMouseMoves();
      this._mouseMoveTracker = null;
    }
  }

  onMouseDown(event) {
    var targetRect = event.target.getBoundingClientRect();
    var coordinates = FixedDataTableEventHelper.getCoordinatesFromEvent(event);

    var mouseLocationInElement = coordinates.x - targetRect.offsetLeft;
    var mouseLocationInRelationToColumnGroup = mouseLocationInElement + event.target.parentElement.offsetLeft;

    this._mouseMoveTracker = new DOMMouseMoveTracker(
      this._onMove,
      this._onColumnReorderEnd,
      document.body,
      this.props.touchEnabled
    );
    this._mouseMoveTracker.captureMouseMoves(event);
    this.setState({
      dragDistance: 0
    });
    this.props.onMouseDown({
      columnKey: this.props.columnKey,
      mouseLocation: {
        dragDistance: 0,
        inElement: mouseLocationInElement,
        inColumnGroup: mouseLocationInRelationToColumnGroup
      }
    });

    this._distance = 0;
    this._animating = true;
    this.frameId = requestAnimationFrame(this._updateState);

    /**
     * This prevents the rows from moving around when we drag the
     * headers on touch devices.
     */
    if(this.props.touchEnabled) {
      event.stopPropagation();
    }
  }

  _onMove(/*number*/ deltaX) {
    this._distance = this.state.dragDistance + deltaX;
  }

  _onColumnReorderEnd(/*boolean*/ cancelReorder) {
    this._animating = false;
    cancelAnimationFrame(this.frameId);
    this.frameId = null;
    this._mouseMoveTracker.releaseMouseMoves();
    this.props.columnReorderingData.cancelReorder = cancelReorder;
    this.props.onColumnReorderEnd();
  }

  _updateState() {
    if (this._animating) {
      this.frameId = requestAnimationFrame(this._updateState)
    }
    this.setState({
      dragDistance: this._distance
    });
    this.props.onColumnReorderMove(this._distance);
  }

  render() /*object*/ {
    var style = {
      height: this.props.height,
    };
    return (
      <div
        className={cx({
          'fixedDataTableCellLayout/columnReorderContainer': true,
          'fixedDataTableCellLayout/columnReorderContainer/active': false,
        })}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.props.touchEnabled ? this.onMouseDown : null}
        onTouchEnd={this.props.touchEnabled ? e => e.stopPropagation() : null}
        onTouchMove={this.props.touchEnabled ? e => e.stopPropagation() : null}
        style={style}>
      </div>
    );
  }

  
}
