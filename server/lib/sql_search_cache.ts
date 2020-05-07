import LruCache from 'lru-cache';
import {camelCase, map, zipObject} from 'lodash';
// @ts-ignore
import {sanitizeName} from '../../../../x-pack/legacy/plugins/canvas/server/lib/sanitize_name';
// @ts-ignore
import {normalizeType} from '../../../../x-pack/legacy/plugins/canvas/server/lib/normalize_type';
import {Legacy} from "kibana";
import {CallClusterWithRequest} from "../../../../src/legacy/core_plugins/elasticsearch";


export class SqlSearchCache {
  private _cache: LruCache<string, any>;
  private filters: string = '';

  constructor(public esClient: CallClusterWithRequest, cacheOpts: LruCache.Options<string, any>) {
    this._cache = new LruCache(cacheOpts);
  }


  /**
   * Execute multiple searches, possibly combining the results of the cached searches
   * with the new ones already in cache
   * @param {object} request the request
   */
  search = (request: Legacy.Request) => {
    //TODO fix ts-ignore with a real object
    const payload = request.payload;
    // @ts-ignore
    if (payload.filters) {
      // @ts-ignore
      this.filters = payload.filters;
    }

    const key = JSON.stringify(payload);
    let pending = this._cache.get(key);
    if (pending === undefined) {
      pending = this._fetchSqlData(request);
      this._cache.set(key, pending);
    }

    return pending;
  };


  async _createRequestObject(sqlRequest: any, headers: any) {
    return {
      body: {
        filter: this.filters,
        query: sqlRequest,
        fetch_size: 10000,
      },
      headers: headers,
      method: 'POST',
      path: '/_xpack/sql?format=json',
    }
  };

  async _createRequestCursorObject(cursorId: string, headers: any) {
    return {
      body: {
        cursor: cursorId,
      },
      headers: headers,
      method: 'POST',
      path: '/_xpack/sql?format=json',
    }
  };


  async _fetchSqlData(request: any) {

    let requestObject;
    // the received request is for the next page
    if (request.payload.cursor) {
      console.debug("Create a cursor update cursor :" + request.payload.cursor);
      requestObject = await this._createRequestCursorObject(request.payload.cursor, request.headers);
      request.payload.visType = 'datatable';
    } else {
      console.debug("Create an SQL request query : " + request.payload.sqlQuery);
      requestObject = await this._createRequestObject(request.payload.sqlQuery, request.headers);
    }

    console.debug("requested VisType : " + request.payload.visType);
    return this.esClient(request, 'transport.request', requestObject).then((res: any) => {
      return this._handleDataVisType(res, request.payload.visType)
    }).catch((e: any) => {
      if (e.message.indexOf('parsing_exception') > -1) {
        throw new Error(
          `Couldn't parse Elasticsearch SQL query. You may need to add double quotes to names containing special characters. Check your query and try again. Error: ${
            e.message
          }`
        );
      }
      throw new Error(`Unexpected error from Elasticsearch: ${e.message}`);
    });
  }


  // depending of the visType we format the data correctly
  async _handleDataVisType(response: any, visType: any) {
    let resObject = {type: visType, data: {}};
    switch (visType) {
      case 'datatable' :
        resObject.data = await this._responseToTable(response);
        break;
      case 'metric' :
        resObject.data = await this._responseToMetrics(response);
        break;
      default:
        throw new Error(`Unsupported Vis Type`);
    }
    return resObject;
  }

  async _responseToTable(response: any) {
    if (!response.columns) {
      const rows = response.rows;
      const cursor = response.cursor;
      console.debug('requested row : ' + rows);
      console.debug('requested cursor : ' + cursor);
      return {rows, cursor,};
    }

    const columns = response.columns.map(({name, type}: any) => {
      return {field: camelCase(sanitizeName(name)), name: sanitizeName(name), dataType: normalizeType(type)};
    });
    const columnIds: Array<any> = map(columns, 'field');
    const rows = response.rows.map((row: any) => zipObject(columnIds, row));
    const cursor = response.cursor;
    console.debug('requested column : ' + columns);
    console.debug('requested row : ' + rows);
    console.debug('requested cursor : ' + cursor);
    return {columns, rows, cursor,};
  }

  async _responseToMetrics(response: any) {
    return {count: 10};
  }

}
