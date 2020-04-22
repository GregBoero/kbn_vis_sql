import LruCache from 'lru-cache';
import {map, zipObject, camelCase, each} from 'lodash';
import {sanitizeName} from '../../../../x-pack/legacy/plugins/canvas/server/lib/sanitize_name';
import {normalizeType} from '../../../../x-pack/legacy/plugins/canvas/server/lib/normalize_type';
import boom from 'boom';

export class SqlSearchCache {
  constructor(esClient, cacheOpts) {
    this._esClient = esClient;
    this._cache = new LruCache(cacheOpts);
  }


  /**
   * Execute multiple searches, possibly combining the results of the cached searches
   * with the new ones already in cache
   * @param {object} request the request
   */
  search = (request) => {
    const payload = request.payload;
    if (payload.filters) {
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


  async _createRequestObject(sqlRequest, headers) {
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

  async _createRequestCursorObject(cursorId, headers) {
    return {
      body: {
        cursor: cursorId,
      },
      headers: headers,
      method: 'POST',
      path: '/_xpack/sql?format=json',
    }
  };


  async _fetchSqlData(request) {

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

    return this._esClient(request, 'transport.request', requestObject).then(res => {
      return this._handleDataVisType(res, request.payload.visType)
    }).catch(e => {
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
  async _handleDataVisType(response, visType) {
    let resObject = {type: visType, data: ''};
    switch (visType) {
      case 'datatable' :
        resObject.data = await this._responseToTable(response);
        break;
      case 'metric' :
        resObject.data = await this._responseToMetrics(response);
        break;
      default:
        resObject.data = "Unsupported Vis Type";
        break;
    }
    return resObject;
  }

  async _responseToTable(response) {
    if (!response.columns) {
      const rows = response.rows;
      const cursor = response.cursor;
      return {rows, cursor,};
    }

    const columns = response.columns.map(({name, type}) => {
      return {field: camelCase(sanitizeName(name)), name: sanitizeName(name), dataType: normalizeType(type)};
    });
    const columnIds = map(columns, 'field');
    const rows = response.rows.map(row => zipObject(columnIds, row));
    const cursor = response.cursor;

    return {columns, rows, cursor,};
  }

  async _responseToMetrics(response) {
    return {count: 10};
  }

}
