import Boom from 'boom';
import { IRouter } from 'kibana/server';
import { schema } from '@kbn/config-schema';
import { API_ROUTE_SQL } from '../../common/constants';
import { SqlSearchCache } from '../lib/sql_search_cache';

export function sqlSearch(router: IRouter) {
  const routePrefix = API_ROUTE_SQL;
  const sqlCache = new SqlSearchCache({
    max: 10,
    maxAge: 4 * 1000,
  });

  // search => execute sql query
  router.post(
    {
      validate: {
        body: schema.object({
          filters: schema.maybe(schema.any()),
          sqlQuery: schema.maybe(schema.string()),
          visType: schema.maybe(schema.string()),
          cursor: schema.maybe(schema.string()),
        }),
      },
      path: routePrefix,
    },
    async (context, request, res) => {
      if (!request.body) {
        return Promise.reject(Boom.badRequest('A query payload is required'));
      }
      const { client } = context.core.elasticsearch.legacy;
      // FIXME remove the call to the new not more required
      return sqlCache
        .search(client, request)
        .then((value) =>
          res.ok({
            body: value,
          })
        )
        .catch((err: any) => res.badRequest(err));
    }
  );
}
