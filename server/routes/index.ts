import {sqlSearch} from './sql_search';
import {IRouter} from "kibana/server";

export function routes(server: IRouter) {
  sqlSearch(server);
}
