import React, {Component} from 'react';
// @ts-ignore
import {saveAs} from '@elastic/filesaver'
import {EuiButton, EuiFlexGroup, EuiFlexItem, EuiInMemoryTable} from '@elastic/eui';
import moment from 'moment';
import _ from 'lodash';


interface CustomDatatableProps {
  datasource: any,
  getNextPage: () => any,
}

interface CustomDatatableState {
  columns: Array<any>;
  items: Array<any>;
  csv: { filename: string, separator: string, quoteValues: boolean };
  cursor: any;
  isLoading: boolean;
}

export class CustomDatatable extends Component<CustomDatatableProps, CustomDatatableState> {
  state: CustomDatatableState = {
    columns: [],
    items: [],
    csv: {filename: '', separator: ',', quoteValues: true},
    cursor: {},
    isLoading: true,
  };


  constructor(props: CustomDatatableProps, context: any) {
    super(props, context);
    this._datasourceToStateModel();
  }

  _datasourceToStateModel() {
    const datasource = this.props.datasource;
    this.state.columns = _.each(datasource.columns, (column) => column.sortable = true);
    this.state.items = datasource.rows;
    this.state.csv.filename = moment().toISOString() + datasource.exportName + '.csv';
    this.state.cursor = datasource.cursor;
    this.state.isLoading = false;
  }

  _afterPageUpdate() {
    const datatable = this.props.datasource;
    const columns = _.each(datatable.columns, (column) => column.sortable = true);
    const items = datatable.rows;
    const filename = moment().toISOString() + datatable.exportName + '.csv';
    const cursor = datatable.cursor;
    this.setState(prevState => ({
      columns: columns,
      items: items,
      csv: {filename: filename, separator: ',', quoteValues: true},
      cursor: cursor,
      isLoading: false,
    }));
  }

  _toCsv(): any {
    const nonAlphaNumRE = /[^a-zA-Z0-9]/;
    const allDoubleQuoteRE = /"/g;
    const quoteValues = this.state.csv.quoteValues;

    const escape = (val: any) => {
      if (quoteValues && nonAlphaNumRE.test(val)) {
        val = '"' + val.replace(allDoubleQuoteRE, '""') + '"';
      }
      return val;
    };

    // escape each cell in each row
    if (this.state.items && this.state.columns) {
      const csvRows = this.state.items.map(function (row) {
        if (_.isObject(row)) {
          row = _.toArray(row);
        }
        return row.map(escape);
      });
      // add the columns to the rows
      csvRows.unshift(this.state.columns.map(function (col) {
        return escape(col.name);
      }));

      const separator = this.state.csv.separator;
      if (csvRows) {
        return csvRows.map(function (row) {
          return row.join(separator) + '\r\n';
        }).join('');
      }
    }
  }

  async _getNextPage() {
    this.setState({isLoading: true});
    this.props.getNextPage().then(this._afterPageUpdate.bind(this));
  }

  _generateCsv() {
    const csv = new Blob([this._toCsv()], {type: 'text/plain;charset=utf-8'});
    saveAs(csv, this.state.csv.filename);
  };

  _renderToolsRight() {
    return (
      <EuiFlexGroup gutterSize="s" alignItems="center" wrap>
        <EuiFlexItem grow={false}>
          <EuiButton key="ExportCsv" onClick={this._generateCsv.bind(this)}> Export Csv </EuiButton>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiButton key="LoadMoreData" onClick={this._getNextPage.bind(this)} isLoading={this.state.isLoading}
                     isDisabled={!this.state.cursor}>
            Load More
          </EuiButton>
        </EuiFlexItem>

      </EuiFlexGroup>
    );
  }

  render() {
    // Transform the props datasource in a inner state object
    this._datasourceToStateModel();
    // Handle search option
    //TODO handle the option in the state of the component
    const search = {box: {incremental: true,}, toolsRight: this._renderToolsRight()};

    return (
      <EuiInMemoryTable
        items={this.state.items}
        columns={this.state.columns}
        pagination={true}
        sorting={true}
        search={search}
        loading={this.state.isLoading}
      />
    );
  }

}
