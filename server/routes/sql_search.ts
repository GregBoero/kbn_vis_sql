import {SqlSearchCache} from "../lib/sql_search_cache";
import {API_ROUTE_SQL} from '../../common/constants';
import boom from "boom";
import {Legacy} from "kibana";


export function sqlSearch(server: Legacy.Server) {
  const {callWithRequest} = server.plugins.elasticsearch.getCluster('data');
  const searchCache = new SqlSearchCache(callWithRequest, {max: 10, maxAge: 4 * 1000});
  const routePrefix = API_ROUTE_SQL;


  // search => execute sql query
  server.route({
    options: {payload: {allow: 'application/json', maxBytes: 26214400}},
    handler: request => {
      if (!request.payload) {
        return Promise.reject(boom.badRequest('A query payload is required'));
      }
      return searchCache.search(request);

    },
    method: 'POST',
    path: routePrefix,
  });
}
