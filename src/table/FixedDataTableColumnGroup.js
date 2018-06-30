import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
export default class FixedDataTableColumnGroup extends React.Component {
  static __TableColumnGroup__ = true;
  static propTypes = {
    align: PropTypes.oneOf(['left', 'center', 'right']),
    fixed: PropTypes.bool,
    header: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
    ]),

  };

  static defaultProps = {
    fixed: false,
  };

  render() {
    return <p>sa</p>;
  }
}

