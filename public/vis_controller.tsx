import {submitRequest} from "./service/sql_api_service";
import {CustomDatatable} from "./components/vis/custom_datatable";
import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {map, union, zipObject} from 'lodash';
import {Vis} from "../common/import";
import {SqlVisDependencies} from "./plugin";

export function createSqlVisController(deps: SqlVisDependencies) {
  const {core} = deps;
  return class SqlVisController {
    datasource: any = {};

    constructor(public el: HTMLElement, public vis: Vis) {
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

    async render(visData: any, visParams: any) {
      if (visData && visData.data) {
        visParams.isLoading = false;
        visData.data.exportName = visParams.exportName;
        this.datasource = visData.data;
        this.drawVis();
      }
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

      await submitRequest(core, {cursor: this.datasource.cursor}).then(this._mergePage.bind(this));
    }

    destroy() {
      unmountComponentAtNode(this.el);
    }
  }
}


