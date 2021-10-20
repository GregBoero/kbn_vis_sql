import {FilterDslType, SqlParser} from './sql_parser';
import {SqlVisDependencies} from "./plugin";
import {getEsQueryConfig, buildEsQuery, Filter, Query, TimeRange, VisParams} from "../common/import";
import {TimeCache} from "../common/time_cache";

export function SqlRequestHandlerProvider(deps: Readonly<SqlVisDependencies>) {
  const {core, data} = deps;
  const uiSettings = core.uiSettings;
  const timeCache = new TimeCache(data.query.timefilter.timefilter, 3 * 1000);

  return async function ({timeRange, filters, query, visParams,}: {
    timeRange: TimeRange; filters: Filter[]; query: Query; visParams: VisParams; forceFetch?: boolean;
  }): Promise<any> {
    visParams.isLoading = true;
    timeCache.setTimeRange(timeRange);
    const esQueryConfigs = getEsQueryConfig(uiSettings);
    console.log("query => ", query);
    const filtersDsl: FilterDslType = buildEsQuery(undefined, query, filters, esQueryConfigs);
    const sqlParser = new SqlParser(core, visParams.query, visParams.useTimeFilter, visParams.visType, filtersDsl, timeCache);
    return sqlParser.parseAsync();
  };

}
