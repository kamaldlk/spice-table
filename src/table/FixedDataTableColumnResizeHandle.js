import React from 'react';
import ReactDOM from 'react-dom';
import DOMMouseMoveTracker from './utils/DOMMouseMoveTracker';
import PropTypes from 'prop-types';
import {ReactComponentWithPureRenderMixin, Locale, clamp, cx} from './utils/data.sheet.utils';


export default class FixedDataTableColumnResizeHandle extends React.Component{
    static propTypes = {
      visible: PropTypes.bool.isRequired,
      height: PropTypes.number.isRequired,
      leftOffset: PropTypes.number.isRequired,
      knobHeight: PropTypes.number.isRequired,
      initialWidth: PropTypes.number,
      minWidth: PropTypes.number,
      maxWidth: PropTypes.number,
      initialEvent: PropTypes.object,
      onColumnResizeEnd: PropTypes.func,
      columnKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      touchEnabled: PropTypes.bool,
    }

    constructor (props) {
      super(props)
      this.state = {
        width: 0,
        cursorDelta: 0
      }
      this._onMove = this._onMove.bind(this);
      this._onColumnResizeEnd = this._onColumnResizeEnd.bind(this);
    }

    componentWillReceiveProps(/*object*/ newProps) {
      if (newProps.initialEvent && !this._mouseMoveTracker.isDragging()) {
        this._mouseMoveTracker.captureMouseMoves(newProps.initialEvent);
        this.setState({
          width: newProps.initialWidth,
          cursorDelta: newProps.initialWidth
        });
      }
    }
  
    componentDidMount() {
      this._mouseMoveTracker = new DOMMouseMoveTracker(
        this._onMove,
        this._onColumnResizeEnd,
        document.body,
        this.props.touchEnabled
      );
    }
  
    componentWillUnmount() {
      this._mouseMoveTracker.releaseMouseMoves();
      this._mouseMoveTracker = null;
    }
  
  
    _onMove(/*number*/ deltaX) {
      if (Locale.isRTL()) {
        deltaX = -deltaX;
      }
      var newWidth = this.state.cursorDelta + deltaX;
      var newColumnWidth =
        clamp(newWidth, this.props.minWidth, this.props.maxWidth);
  
      // Please note cursor delta is the different between the currently width
      // and the new width.
      this.setState({
        width: newColumnWidth,
        cursorDelta: newWidth
      });
    }
  
    _onColumnResizeEnd() {
      this._mouseMoveTracker.releaseMouseMoves();
      this.props.onColumnResizeEnd(
        this.state.width,
        this.props.columnKey
      );
    }
  
    render() /*object*/ {
      var style = {
        width: this.state.width,
        height: this.props.height,
      };
      if (Locale.isRTL()) {
        style.right = this.props.leftOffset;
      } else {
        style.left = this.props.leftOffset;
      }
      return (
        <div
          className={cx({
            'fixedDataTableColumnResizerLineLayout/main': true,
            'fixedDataTableColumnResizerLineLayout/hiddenElem': !this.props.visible,
            'public/fixedDataTableColumnResizerLine/main': true,
          })}
          style={style}>
          <div
            className={cx('fixedDataTableColumnResizerLineLayout/mouseArea')}
            style={{height: this.props.height}}
          />
        </div>
      );
    }
}
