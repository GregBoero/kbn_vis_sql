import {Vis, VisParams} from "../../../src/legacy/core_plugins/visualizations/public/np_ready/public";
import {submitRequest} from "./service/sql_api_service";
import {CustomDatatable} from "./components/vis/custom_datatable";
import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {map, union, zipObject} from 'lodash';


export class SqlVisController {
  datasource: any = {};

  constructor(public el: Element, public vis: Vis) {
    this.getNextPage = this.getNextPage.bind(this)
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

  async render(visData: any, visParams: VisParams, status: any) {
    visParams.isLoading = false;
    visData.data.exportName = visParams.exportName;
    this.datasource = visData.data;
    this.drawVis();
  }

  async _mergePage(nextPage: any) {
    this.datasource.cursor = nextPage.data.cursor;
    const columnIds: Array<any> = map(this.datasource.columns, 'field');
    const rows = nextPage.data.rows.map((row: any) => zipObject(columnIds, row));
    this.datasource.rows = union(this.datasource.rows, rows);
  }

  async getNextPage() {
    if (!this.datasource.cursor) {
      return;
    }
    await submitRequest({cursor: this.datasource.cursor}).then(this._mergePage.bind(this));
  }

  destroy() {
    unmountComponentAtNode(this.el);
  }
}

