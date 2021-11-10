import {fetch} from '../../common/lib/fetch';
import {API_ROUTE_SQL} from '../../common/constants';
import {CoreSetup} from "kibana/public";


export function submitRequest(core: CoreSetup, sqlQuery: any) {
  const apiPath = core.http.basePath.get() + `${API_ROUTE_SQL}`;
  const toastNotifications = core.notifications.toasts;
  return fetch.post(`${apiPath}`, {...sqlQuery}).then(results => {
    return results.data
  }).catch(err => {
    const statusCode = err.response && err.response.status;
    switch (statusCode) {
      case 400:
        return toastNotifications.addError(err.response, {
          title: `Couldn't request to Elasticsearch`,
        });
      case 413:
        return toastNotifications.addError({
            name: 'Request data was too large',
            message: `The server gave a response that the request data was too large. This
              usually means uploaded image assets that are too large for Kibana or
              a proxy. Try removing some assets in the asset manager.`
          }
          ,
          {
            title: `Couldn't get the data from Elasticsearch`,
          }
        );
      default:
        return toastNotifications.addError(err, {
          title: `Couldn't get the data`,
        });
    }
  });
}
