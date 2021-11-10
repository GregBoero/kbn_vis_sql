import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {map, union, zipObject} from 'lodash';
import {CustomDatatable} from './components/vis/custom_datatable';
import {submitRequest} from './service/sql_api_service';
import {SqlVisDependencies} from './plugin';
import {IInterpreterRenderHandlers} from "../../../src/plugins/expressions";;
import {VisualizationContainer} from "../../../src/plugins/visualizations/public";

export type SqlFilterVisControllerType = ReturnType<typeof createSqlVisController>;


export const createSqlVisController = (deps: Readonly<SqlVisDependencies>, handlers: IInterpreterRenderHandlers,
                                       el: Element) => {
  const {core} = deps;

  return new (class SqlVisController {
    datasource: any = {};

    constructor() {
      this.getNextPage = this.getNextPage.bind(this);
    }

    drawVis = () => {

      render(
        <VisualizationContainer handlers={handlers}>
          <CustomDatatable datasource={this.datasource} getNextPage={this.getNextPage}/>
        </VisualizationContainer>,
        el
      );
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
      const columnIds: any[] = map(this.datasource.columns, 'field');
      const rows = nextPage.data.rows.map((row: any) => zipObject(columnIds, row));
      this.datasource.rows = union(this.datasource.rows, rows);
    }

    async getNextPage() {
      if (!this.datasource.cursor) {
        return;
      }

      await submitRequest(core, {cursor: this.datasource.cursor}).then(
        this._mergePage.bind(this)
      );
    }

    destroy() {
      unmountComponentAtNode(el);
    }
  })();
}
