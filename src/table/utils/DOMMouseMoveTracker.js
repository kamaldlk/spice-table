import {EventListener,requestAnimationFrame, cancelAnimationFrame} from './data.sheet.utils';
import FixedDataTableEventHelper from '../FixedDataTableEventHelper';

class DOMMouseMoveTracker {
  
  constructor(
    /*function*/ onMove,
    /*function*/ onMoveEnd,
    /*DOMElement*/ domNode,
    /*boolean*/ touchEnabled) {
    this._isDragging = false;
    this._isTouchEnabled = touchEnabled;
    this._animationFrameID = null;
    this._domNode = domNode;
    this._onMove = onMove;
    this._onMoveEnd = onMoveEnd;
    this._onMouseEnd = this._onMouseEnd.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._didMouseMove = this._didMouseMove.bind(this);
  }

  captureMouseMoves(/*object*/ event) {
    if (!this._eventMoveToken && !this._eventUpToken && !this._eventLeaveToken) {
      this._eventMoveToken = EventListener.listen(
        this._domNode,
        'mousemove',
        this._onMouseMove
      );
      this._eventUpToken = EventListener.listen(
        this._domNode,
        'mouseup',
        this._onMouseUp
      );
      this._eventLeaveToken = EventListener.listen(
        this._domNode,
        'mouseleave',
        this._onMouseEnd
      );
    }

    if (this._isTouchEnabled && !this._eventTouchStartToken &&
        !this._eventTouchMoveToken && !this._eventTouchEndToken) {
      this._eventTouchStartToken = EventListener.listen(
        this._domNode,
        'touchstart',
        this._onMouseMove
      );
      this._eventTouchMoveToken = EventListener.listen(
        this._domNode,
        'touchmove',
        this._onMouseMove
      );
      this._eventTouchEndToken = EventListener.listen(
        this._domNode,
        'touchend',
        this._onMouseUp
      );
    }

    if (!this._isDragging) {
      this._deltaX = 0;
      this._deltaY = 0;
      this._isDragging = true;
      var coordinates = FixedDataTableEventHelper.getCoordinatesFromEvent(event);
      var x = coordinates.x;
      var y = coordinates.y;
      this._x = x;
      this._y = y;
    }
    event.preventDefault();
  }

  /**
   * This releases all of the listeners on document.body.
   */
  releaseMouseMoves() {
    if (this._eventMoveToken && this._eventUpToken && this._eventLeaveToken) {
      this._eventMoveToken.remove();
      this._eventMoveToken = null;
      this._eventUpToken.remove();
      this._eventUpToken = null;
      this._eventLeaveToken.remove();
      this._eventLeaveToken = null;
    }

    if (this._isTouchEnabled && this._eventTouchStartToken &&
        this._eventTouchMoveToken && this._eventTouchEndToken) {
      this._eventTouchStartToken.remove();
      this._eventTouchStartToken = null;
      this._eventTouchMoveToken.remove();
      this._eventTouchMoveToken = null;
      this._eventTouchEndToken.remove();
      this._eventTouchEndToken = null;
    }

    if (this._animationFrameID !== null) {
      cancelAnimationFrame(this._animationFrameID);
      this._animationFrameID = null;
    }

    if (this._isDragging) {
      this._isDragging = false;
      this._x = null;
      this._y = null;
    }
  }

  /**
   * Returns whether or not if the mouse movement is being tracked.
   */
  isDragging() /*boolean*/{
    return this._isDragging;
  }

  /**
   * Calls onMove passed into constructor and updates internal state.
   */
  _onMouseMove(/*object*/ event) {
    var coordinates = FixedDataTableEventHelper.getCoordinatesFromEvent(event);
    var x = coordinates.x;
    var y = coordinates.y;

    this._deltaX += (x - this._x);
    this._deltaY += (y - this._y);

    if (this._animationFrameID === null) {
      // The mouse may move faster then the animation frame does.
      // Use `requestAnimationFrame` to avoid over-updating.
      this._animationFrameID =
        requestAnimationFrame(this._didMouseMove);
    }

    this._x = x;
    this._y = y;
    event.preventDefault();
  }

  _didMouseMove() {
    this._animationFrameID = null;
    this._onMove(this._deltaX, this._deltaY);
    this._deltaX = 0;
    this._deltaY = 0;
  }

  _onMouseUp() {
    if (this._animationFrameID) {
      this._didMouseMove();
    }
    this._onMoveEnd(false);
  }

  
  _onMouseEnd() {
    this._onMoveEnd(true);
  }
}

export default DOMMouseMoveTracker;
