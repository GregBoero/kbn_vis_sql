import {Component} from 'react';
import {
  EuiInMemoryTable,
  EuiButton, EuiFlexGroup, EuiFlexItem
} from '@elastic/eui';
import React from 'react';
import PropTypes from 'prop-types';
import {each, isObject, toArray} from 'lodash'
import {saveAs} from '@elastic/filesaver'
import moment from 'moment/moment'

export class CustomDatatable extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      columns: [],
      items: [],
      csv: {filename: '', separator: ',', quoteValues: true},
      cursor: {},
      isLoading: true,
    };
    this._datasourceToStateModel();
  }

  _datasourceToStateModel() {
    const datasource = this.props.datasource;
    this.state.columns = each(datasource.columns, (column) => column.sortable = true);
    this.state.items = datasource.rows;
    this.state.csv.filename = moment().toISOString() + datasource.exportName + '.csv';
    this.state.cursor = datasource.cursor;
    this.state.isLoading = false;
  }

  _afterPageUpdate() {
    const datatable = this.props.datatable;
    const columns = each(datatable.columns, (column) => column.sortable = true);
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

  _toCsv() {
    const nonAlphaNumRE = /[^a-zA-Z0-9]/;
    const allDoubleQuoteRE = /"/g;
    const quoteValues = this.state.csv.quoteValues;

    const escape = (val) => {
      if (quoteValues && nonAlphaNumRE.test(val)) {
        val = '"' + val.replace(allDoubleQuoteRE, '""') + '"';
      }
      return val;
    };

    // escape each cell in each row
    if (this.state.items && this.state.columns) {
      const csvRows = this.state.items.map(function (row) {
        if (isObject(row)) {
          row = toArray(row);
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

      </EuiFlexGroup>);
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

CustomDatatable.propTypes = {
  datasource: PropTypes.object.isRequired,
  getNextPage: PropTypes.func.isRequired,
};

