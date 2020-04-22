import chrome from 'ui/chrome';
import {fetch} from '../../common/lib/fetch';
import {API_ROUTE_SQL} from '../../common/constants';


const basePath = chrome.getBasePath();
const apiPath = `${basePath}${API_ROUTE_SQL}`;


export function submitRequest(sqlQuery) {
  return fetch.post(`${apiPath}`, { ...sqlQuery }).then(results => {return results.data});
}
