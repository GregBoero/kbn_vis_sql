import {timefilter} from 'ui/timefilter';
import {SqlParser} from './sql_parser';
// @ts-ignore
import {TimeCache} from "../../../src/legacy/core_plugins/vis_type_vega/public/data_model/time_cache";
import {buildEsQuery, getEsQueryConfig} from 'src/plugins/data/common/es_query/es_query';


export function SqlRequestHandlerProvider(config: any) {
  const timeCache = new TimeCache(timefilter, 3 * 1000);

  return {
    name: 'sql',
    handler({timeRange, filters, query, visParams}: any) {
      visParams.isLoading = true;
      timeCache.setTimeRange(timeRange);
      const esQueryConfigs = getEsQueryConfig(config);
      console.log("query => ", query);
      const filtersDsl = buildEsQuery(undefined, query, filters, esQueryConfigs);
      const sqlParser = new SqlParser(visParams.query, visParams.useTimeFilter, visParams.visType, filtersDsl, timeCache);
      return sqlParser.parseAsync();
    }

  };

}
