import {FilterDslType, SqlParser} from './sql_parser';
import {SqlVisDependencies} from "./plugin";
import {esQuery, Filter, Query, TimeCache, TimeRange, VisParams} from "../common/import";

export function SqlRequestHandlerProvider(deps: SqlVisDependencies) {
  const {core, data} = deps;
  const uiSettings = core.uiSettings;
  const timeCache = new TimeCache(data.query.timefilter.timefilter, 3 * 1000);

  return async function ({timeRange, filters, query, visParams,}: {
    timeRange: TimeRange; filters: Filter[]; query: Query; visParams: VisParams; forceFetch?: boolean;
  }): Promise<any> {
    visParams.isLoading = true;
    timeCache.setTimeRange(timeRange);
    const esQueryConfigs = esQuery.getEsQueryConfig(uiSettings);
    console.log("query => ", query);
    const filtersDsl: FilterDslType = esQuery.buildEsQuery(undefined, query, filters, esQueryConfigs);
    const sqlParser = new SqlParser(core, visParams.query, visParams.useTimeFilter, visParams.visType, filtersDsl, timeCache);
    return sqlParser.parseAsync();

  };

}
