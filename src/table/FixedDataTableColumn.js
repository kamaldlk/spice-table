import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
export default class FixedDataTableColumn extends React.Component {
 static __TableColumn__ = true;
 static propTypes = {
   align: PropTypes.oneOf(['left', 'center', 'right']),
   fixed: PropTypes.bool,
   fixedRight: PropTypes.bool,
   header: PropTypes.oneOfType([
     PropTypes.node,
     PropTypes.func,
   ]),
   cell: PropTypes.oneOfType([
     PropTypes.node,
     PropTypes.func,
   ]),
   footer: PropTypes.oneOfType([
     PropTypes.node,
     PropTypes.func,
   ]),
   columnKey: PropTypes.oneOfType([
     PropTypes.string,
     PropTypes.number,
   ]),
   width: PropTypes.number.isRequired,
   minWidth: PropTypes.number,
   maxWidth: PropTypes.number,
   flexGrow: PropTypes.number,
   isResizable: PropTypes.bool,
   isReorderable: PropTypes.bool,
   allowCellsRecycling: PropTypes.bool,
   pureRendering: PropTypes.bool,
 };

 static defaultProps = {
   allowCellsRecycling: false,
   fixed: false,
   fixedRight: false,
 };
 constructor(props){
   super(props)
 }

 render() {
   return (
     <div>s</div>
   );
 }
}


