import React from 'react';
import ReactDOM from 'react-dom';
import FixedDataTableHelper from './FixedDataTableHelper';
import PropTypes from 'prop-types';
import FixedDataTableCell from './FixedDataTableCell';
import FixedDataTableTranslateDOMPosition from './FixedDataTableTranslateDOMPosition';
import {cx} from './utils/data.sheet.utils';


var DIR_SIGN = FixedDataTableHelper.DIR_SIGN;


class FixedDataTableCellGroupImpl extends React.Component{
      static  propTypes_DISABLED_FOR_PERFORMANCE= {
        columns: PropTypes.array.isRequired,
        isScrolling: PropTypes.bool,
        left: PropTypes.number,
        onColumnResize: PropTypes.func,
        onColumnReorder: PropTypes.func,
        onColumnReorderMove: PropTypes.func,
        onColumnReorderEnd: PropTypes.func,
        height: PropTypes.number.isRequired,
        cellGroupWrapperHeight: PropTypes.number,
        rowHeight: PropTypes.number.isRequired,
        rowIndex: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        zIndex: PropTypes.number.isRequired,
        touchEnabled: PropTypes.bool
      }

      constructor(props){
        super(props)
        this._renderCell = this._renderCell.bind(this);
        this._getColumnsWidth = this._getColumnsWidth.bind(this);
      }

      componentWillMount() {
        this._initialRender = true;
      }
    
      componentDidMount() {
        this._initialRender = false;
      }
    
      _renderCell(
        /*number*/ rowIndex,
        /*number*/ height,
        /*object*/ columnProps,
        /*number*/ left,
        /*string*/ key,
        /*number*/ columnGroupWidth,
        /*boolean*/ isColumnReordering,
      ) /*object*/ {
    
        var cellIsResizable = columnProps.isResizable &&
          this.props.onColumnResize;
        var onColumnResize = cellIsResizable ? this.props.onColumnResize : null;
    
        var cellIsReorderable = columnProps.isReorderable && this.props.onColumnReorder && rowIndex === -1 && columnGroupWidth !== columnProps.width;
        var onColumnReorder = cellIsReorderable ? this.props.onColumnReorder : null;
    
        var className = columnProps.cellClassName;
        var pureRendering = columnProps.pureRendering || false;
    
        return (
          <FixedDataTableCell
            isScrolling={this.props.isScrolling}
            align={columnProps.align}
            className={className}
            height={height}
            key={key}
            maxWidth={columnProps.maxWidth}
            minWidth={columnProps.minWidth}
            touchEnabled={this.props.touchEnabled}
            onColumnResize={onColumnResize}
            onColumnReorder={onColumnReorder}
            onColumnReorderMove={this.props.onColumnReorderMove}
            onColumnReorderEnd={this.props.onColumnReorderEnd}
            isColumnReordering={isColumnReordering}
            columnReorderingData={this.props.columnReorderingData}
            rowIndex={rowIndex}
            columnKey={columnProps.columnKey}
            width={columnProps.width}
            left={left}
            cell={columnProps.cell}
            columnGroupWidth={columnGroupWidth}
            pureRendering={pureRendering}
          />
        );
      }
    
      _getColumnsWidth(/*array*/ columns) /*number*/ {
        var width = 0;
        for (var i = 0; i < columns.length; ++i) {
          width += columns[i].props.width;
        }
        return width;
      }
    
      render() /*object*/ {
        var props = this.props;
        var columns = props.columns;
        var cells = new Array(columns.length);
    
        var contentWidth = this._getColumnsWidth(columns);
    
        var isColumnReordering = props.isColumnReordering && columns.reduce(function (acc, column) {
          return acc || props.columnReorderingData.columnKey === column.props.columnKey;
        }, false);
    
        var currentPosition = 0;
        for (var i = 0, j = columns.length; i < j; i++) {
          var columnProps = columns[i].props;
          var recycable = columnProps.allowCellsRecycling && !isColumnReordering;
          if (!recycable || (
                currentPosition - props.left <= props.width &&
                currentPosition - props.left + columnProps.width >= 0)) {
            var key = columnProps.columnKey || 'cell_' + i;
            cells[i] = this._renderCell(
              props.rowIndex,
              props.rowHeight,
              columnProps,
              currentPosition,
              key,
              contentWidth,
              isColumnReordering
            );
          }
          currentPosition += columnProps.width;
        }
        var style = {
          height: props.height,
          position: 'absolute',
          width: contentWidth,
          zIndex: props.zIndex,
        };
        FixedDataTableTranslateDOMPosition(style, -1 * DIR_SIGN * props.left, 0, this._initialRender);
    
        return (
          <div
            className={cx('fixedDataTableCellGroupLayout/cellGroup')}
            style={style}>
            {cells}
          </div>
        );
      }
}

export default class FixedDataTableCellGroup extends React.Component{
  static propTypes_DISABLED_FOR_PERFORMANCE = {
    isScrolling: PropTypes.bool,
    height: PropTypes.number.isRequired,
    offsetLeft: PropTypes.number,
    left: PropTypes.number,
    zIndex: PropTypes.number.isRequired,
  }

  constructor(props){
    super(props)
    this._onColumnResize = this._onColumnResize.bind(this);
  }

  shouldComponentUpdate(/*object*/ nextProps) /*boolean*/ {
    return (
      !nextProps.isScrolling ||
      this.props.rowIndex !== nextProps.rowIndex ||
      this.props.left !== nextProps.left
    );
  }

  _onColumnResize(
    /*number*/ left,
    /*number*/ width,
    /*?number*/ minWidth,
    /*?number*/ maxWidth,
    /*string|number*/ columnKey,
    /*object*/ event
  ) {
    this.props.onColumnResize && this.props.onColumnResize(
      this.props.offsetLeft,
      left - this.props.left + width,
      width,
      minWidth,
      maxWidth,
      columnKey,
      event
    );
  }

  render() /*object*/ {
    var {offsetLeft, ...props} = this.props;

    var style = {
      height: props.cellGroupWrapperHeight || props.height,
      width: props.width
    };

    if (DIR_SIGN === 1) {
      style.left = offsetLeft;
    } else {
      style.right = offsetLeft;
    }

    var onColumnResize = props.onColumnResize ? this._onColumnResize : null;

    return (
      <div
        style={style}
        className={cx('fixedDataTableCellGroupLayout/cellGroupWrapper')}>
        <FixedDataTableCellGroupImpl
          {...props}
          onColumnResize={onColumnResize}
        />
      </div>
    );
  }
}
FixedDataTableCellGroup.defaultProps={
  left: 0,
  offsetLeft: 0
}
