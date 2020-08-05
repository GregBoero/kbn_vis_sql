import {SqlSearchCache} from "../lib/sql_search_cache";
import {API_ROUTE_SQL} from '../../common/constants';
import Boom from 'boom';
import {IRouter} from "kibana/server";
import {schema} from "@kbn/config-schema";


export function sqlSearch(router: IRouter) {
  const routePrefix = API_ROUTE_SQL;
  const sqlCache = new SqlSearchCache({
    max: 10,
    maxAge: 4 * 1000
  });

  // options: { payload: {allow: 'application/json', maxBytes: 26214400}},

  // search => execute sql query
  router.post(
    {
      validate: {
        body: schema.object({
          filters: schema.maybe(schema.any()),
          sqlQuery: schema.maybe(schema.string()),
          visType: schema.maybe(schema.string()),
          cursor: schema.maybe(schema.string())
        })
      },
      path: routePrefix
    },
    async (context, request, res) => {
      if (!request.body) {
        return Promise.reject(Boom.badRequest('A query payload is required'));
      }
      const {dataClient} = context.core.elasticsearch;
      //FIXME remove the call to the new not more required
      return sqlCache.search(dataClient, request)
        .then(value => res.ok({
          body: value,
        }))
        .catch((err: any) => res.badRequest(err));
    }
  );
}
