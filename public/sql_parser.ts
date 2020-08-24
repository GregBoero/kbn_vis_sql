import _ from 'lodash';
import moment from 'moment';
import {submitRequest} from './service/sql_api_service'
import {DslQuery, Filter} from "../common/import";
import {TimeCache} from "../common/time_cache";


export type FilterDslType = { bool: { must: DslQuery[]; filter: Filter[]; should: never[]; must_not: Filter[]; }; }

export class SqlParser {

  constructor(public core: any, public query: string, public useTimeFilter: boolean, public visType: string, public filters: FilterDslType, public timeCache: TimeCache) {
  }

  async parseAsync(): Promise<any> {
    if (this.query && this.query.length > 0) {
      let parsedQuery = _.clone(this.query);
      parsedQuery = await this._parseTimeFilter(parsedQuery);
      return await submitRequest(this.core, {sqlQuery: parsedQuery, filters: this.filters, visType: this.visType});
    }
  }

  _parseTimeFilter(parsedQuery: string): string {
    if (this.useTimeFilter) {
      // get the time object from the time cache {min,max}
      const bound = this.timeCache.getTimeBounds();
      const from = '\'' + moment(bound.min).toISOString() + '\'';
      const to = '\'' + moment(bound.max).toISOString() + '\'';

      parsedQuery = parsedQuery.replace('[from]', from);
      parsedQuery = parsedQuery.replace('[to]', to);
    }
    return parsedQuery;
  }
}


