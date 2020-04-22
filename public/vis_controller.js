import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {CustomDatatable} from './components/vis/custom_datatable'
import {submitRequest} from './service/sql_api_service';
import {union, map, zipObject} from 'lodash'


export class VisController {

  constructor(el, vis) {
    this.el = el;
    this.vis = vis;
    this.datasource = {};
    this.getNextPage = this.getNextPage.bind(this);
  }

  async render(visData) {
    this.vis.params.isLoading = false;
    visData.data.exportName = this.vis.params.exportName;
    this.datasource = visData.data;
    this.drawVis();
  }

  async getNextPage() {
    if (!this.datasource.cursor) {
      return;
    }
    await submitRequest({cursor: this.datasource.cursor}).then(this._mergePage.bind(this));
  }

  async _mergePage(nextPage) {
    this.datasource.cursor = nextPage.data.cursor;
    const columnIds = map(this.datasource.columns, 'field');
    const rows = nextPage.data.rows.map(row => zipObject(columnIds, row));
    this.datasource.rows = union(this.datasource.rows, rows);
  }

  drawVis = () => {
    render(
      <CustomDatatable
        datasource={this.datasource}
        getNextPage={this.getNextPage}
      />
      ,
      this.el);
  };

  destroy() {
    unmountComponentAtNode(this.el);
  }

}
