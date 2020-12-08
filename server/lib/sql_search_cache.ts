import LRUCache from 'lru-cache';
import { camelCase, map, zipObject } from 'lodash';
import { ILegacyScopedClusterClient, KibanaRequest } from 'kibana/server';

// TODO replace console.debug by a logger

export class SqlSearchCache {
  private _cache: LRUCache<string, any>;
  private filters: string = '';

  constructor(cacheOpts: LRUCache.Options<string, any>) {
    this._cache = new LRUCache(cacheOpts);
  }

  /**
   * Execute multiple searches, possibly combining the results of the cached searches
   * with the new ones already in cache
   * @param esClient
   * @param {object} request the request
   */
  search = (
    esClient: ILegacyScopedClusterClient,
    request: KibanaRequest<unknown, unknown, unknown, 'post'>
  ): Promise<any> => {
    // TODO fix ts-ignore with a real object
    const body = request.body;
    // @ts-ignore
    if (body.filters) {
      // @ts-ignore
      this.filters = body.filters;
    }

    const key = JSON.stringify(body);
    let pending = this._cache.get(key);
    if (pending === undefined) {
      pending = this._fetchSqlData(esClient, request);
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
      headers,
      method: 'POST',
      path: '/_sql?format=json',
    };
  }

  async _createRequestCursorObject(cursorId: string, headers: any) {
    return {
      body: {
        cursor: cursorId,
      },
      headers,
      method: 'POST',
      path: '/_sql?format=json',
    };
  }

  async _fetchSqlData(esClient: ILegacyScopedClusterClient, request: any) {
    let requestObject;
    // the received request is for the next page
    if (request.body.cursor) {
      // console.debug('Create a cursor update cursor :' + request.body.cursor);
      requestObject = await this._createRequestCursorObject(request.body.cursor, request.headers);
      request.body.visType = 'datatable';
    } else {
      // console.debug('Create an SQL request query : ' + request.body.sqlQuery);
      requestObject = await this._createRequestObject(request.body.sqlQuery, request.headers);
    }

    // console.debug('requested VisType : ' + request.body.visType);
    return esClient
      .callAsCurrentUser('transport.request', requestObject)
      .then((res: any) => {
        return this._handleDataVisType(res, request.body.visType);
      })
      .catch((e: any) => Promise.reject(e));
  }

  // depending of the visType we format the data correctly
  async _handleDataVisType(response: any, visType: any) {
    const resObject = { type: visType, data: {} };
    switch (visType) {
      case 'datatable':
        resObject.data = await this._responseToTable(response);
        break;
      case 'metric':
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
      // console.debug('requested row : ' + rows);
      // console.debug('requested cursor : ' + cursor);
      return { rows, cursor };
    }

    const columns = response.columns.map(({ name, type }: any) => {
      return {
        field: camelCase(this.sanitizeName(name)),
        name: this.sanitizeName(name),
        dataType: this.normalizeType(type),
      };
    });

    const columnIds: any[] = map(columns, 'field');
    const rows = response.rows.map((row: any) => zipObject(columnIds, row));
    const cursor = response.cursor;
    // console.debug('requested column : ' + columns);
    // console.debug('requested row : ' + rows);
    // console.debug('requested cursor : ' + cursor);
    return { columns, rows, cursor };
  }

  async _responseToMetrics(response: any) {
    return { count: 10 };
  }

  normalizeType(type: any) {
    const normalTypes = {
      string: ['string', 'text', 'keyword', '_type', '_id', '_index', 'geo_point'],
      number: [
        'float',
        'half_float',
        'scaled_float',
        'double',
        'integer',
        'long',
        'short',
        'byte',
        'token_count',
        '_version',
      ],
      date: ['date', 'datetime'],
      boolean: ['boolean'],
      null: ['null'],
    };

    // @ts-ignore
    const normalizedType = Object.keys(normalTypes).find((t) => normalTypes[t].includes(type));

    if (normalizedType) {
      return normalizedType;
    }
    throw new Error(`Canvas does not yet support type: ${type}`);
  }

  sanitizeName(name: string) {
    // blacklisted characters
    const blacklist = ['(', ')'];
    const pattern = blacklist.map((v) => this.escapeRegExp(v)).join('|');
    const regex = new RegExp(pattern, 'g');
    return name.replace(regex, '_');
  }

  escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
