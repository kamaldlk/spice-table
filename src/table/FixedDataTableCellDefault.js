import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import {joinClasses, cx} from './utils/data.sheet.utils';


export default class FixedDataTableCellDefault extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    columnKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    rowIndex: PropTypes.number
  };

  constructor(props){
    super(props)
  }

  render() {
    var {height, width, style, className, children, columnKey, rowIndex, ...props} = this.props;
    var innerStyle = {
      height,
      width,
      ...style,
    };

    return (
      <div
        {...props}
        className={joinClasses(
          cx('fixedDataTableCellLayout/wrap1'),
          cx('public/fixedDataTableCell/wrap1'),
          className,
        )}
        style={innerStyle}>
        <div
          className={joinClasses(
            cx('fixedDataTableCellLayout/wrap2'),
            cx('public/fixedDataTableCell/wrap2'),
          )}>
          <div
            className={joinClasses(
              cx('fixedDataTableCellLayout/wrap3'),
              cx('public/fixedDataTableCell/wrap3'),
            )}>
            <div className={cx('public/fixedDataTableCell/cellContent')}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
