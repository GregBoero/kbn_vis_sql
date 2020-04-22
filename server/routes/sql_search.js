import {SqlSearchCache} from "../lib/sql_search_cache";
import {API_ROUTE_SQL} from '../../common/constants';
import boom from "boom";

export function sqlSearch(server) {
  const {callWithRequest} = server.plugins.elasticsearch.getCluster('data');
  const searchCache = new SqlSearchCache(callWithRequest, {max: 10, maxAge: 4 * 1000});
  const routePrefix = API_ROUTE_SQL;


  // search => execute sql query
  server.route({
    config: {payload: {allow: 'application/json', maxBytes: 26214400}},
    handler: function (req) {
      if (!req.payload) {
        return Promise.reject(boom.badRequest('A query payload is required'));
      }
      return searchCache.search(req);
    },
    method: 'POST',
    path: routePrefix,
  });
}
