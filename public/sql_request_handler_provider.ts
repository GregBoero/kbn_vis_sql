import {timefilter} from 'ui/timefilter';
import {FilterDslType, SqlParser} from './sql_parser';
// @ts-ignore
import {TimeCache} from "../../../src/legacy/core_plugins/vis_type_vega/public/data_model/time_cache";
import {VisParams} from "../../../src/legacy/core_plugins/visualizations/public/np_ready/public";
import {esFilters, esQuery, Query, TimeRange} from '../../../src/plugins/data/public';
import {SqlVisDependencies} from "./plugin";


export function SqlRequestHandlerProvider(deps: SqlVisDependencies) {
  const timeCache = new TimeCache(timefilter, 3 * 1000);
  const {uiSettings} = deps;

  return async function ({timeRange, filters, query, visParams,}: {
    timeRange: TimeRange; filters: esFilters.Filter[]; query: Query; visParams: VisParams; forceFetch?: boolean;
  }): Promise<any> {
    visParams.isLoading = true;
    timeCache.setTimeRange(timeRange);
    const esQueryConfigs = esQuery.getEsQueryConfig(uiSettings);
    console.log("query => ", query);
    const filtersDsl: FilterDslType = esQuery.buildEsQuery(undefined, query, filters, esQueryConfigs);
    const sqlParser = new SqlParser(visParams.query, visParams.useTimeFilter, visParams.visType, filtersDsl, timeCache);
    return sqlParser.parseAsync();

  };

}
