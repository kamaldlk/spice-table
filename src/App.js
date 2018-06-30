import React, { Component } from 'react';
import { FixedDataTableColumn,
  FixedDataTable,
  FixedDataTableCellDefault  } from './table'

class MyTextCell extends React.Component {
  render() {
    const {rowIndex, field, data, ...props} = this.props;
    return (
      <FixedDataTableCellDefault {...props}>
        {data[rowIndex][field]}
      </FixedDataTableCellDefault>
    );
  }
}

class MyLinkCell extends React.Component {
  render() {
    const {rowIndex, field, data, ...props} = this.props;
    const link = data[rowIndex][field];
    return (
      <FixedDataTableCellDefault {...props}>
        <a href={link}>{link}</a>
      </FixedDataTableCellDefault>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myTableData: [
        {name: 'Rylan', email: 'Angelita_Weimann42@gmail.com'},
        {name: 'Amelia', email: 'Dexter.Trantow57@hotmail.com'},
        {name: 'Estevan', email: 'Aimee7@hotmail.com'},
        {name: 'Florence', email: 'Jarrod.Bernier13@yahoo.com'},
        {name: 'Tressa', email: 'Yadira1@hotmail.com'},
        
       
        
      ],
    };
  }

  render() {
    return (
      <FixedDataTable
        rowsCount={this.state.myTableData.length}
        rowHeight={50}
        headerHeight={50}
        maxHeight={500}
        width={1000}
        height={500}>
        <FixedDataTableColumn
          header={<FixedDataTableCellDefault>Namxxxxczxczxczxczxczxe</FixedDataTableCellDefault>}
          fixed={true}
          cell={
            <MyTextCell
              data={this.state.myTableData}
              field="name"
            />
          }
          width={200}
        />
        <FixedDataTableColumn
          header={<FixedDataTableCellDefault>Email</FixedDataTableCellDefault>}
          cell={
            <MyLinkCell
              data={this.state.myTableData}
              field="email"
            />
          }
          width={200}
        />
      </FixedDataTable>
    );
  }
}

export default App;