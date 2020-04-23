import _ from 'lodash';
import moment from 'moment/moment';
import {submitRequest} from './service/sql_api_service'
// @ts-ignore
import {notify} from '../../../x-pack/legacy/plugins/canvas/public/lib/notify'
// @ts-ignore
import {TimeCache} from "../../../src/legacy/core_plugins/vis_type_vega/public/data_model/time_cache";

export class SqlParser {

  constructor(public query: string, public useTimeFilter: boolean, public visType: string, public filters: any, public timeCache: TimeCache) {
  }

  async parseAsync() {
    if (this.query && this.query.length > 0) {
      let parsedQuery = _.clone(this.query);
      parsedQuery = await this._parseTimeFilter(parsedQuery);
      return submitRequest({sqlQuery: parsedQuery, filters: this.filters, visType: this.visType}).catch(err => {
        const statusCode = err.response && err.response.status;
        switch (statusCode) {
          case 400:
            return notify.error(err.response, {
              title: `Couldn't request to Elasticsearch`,
            });
          case 413:
            return notify.error(
              `The server gave a response that the request data was too large. This
              usually means uploaded image assets that are too large for Kibana or
              a proxy. Try removing some assets in the asset manager.`,
              {
                title: `Couldn't get the data from Elasticsearch`,
              }
            );
          default:
            return notify.error(err, {
              title: `Couldn't get the data`,
            });
        }
      });
    }
  }

  async _parseTimeFilter(parsedQuery: string) {
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


