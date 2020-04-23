import {sqlSearch} from './sql_search';
import {Legacy} from "kibana";

export function routes(server: Legacy.Server) {
  sqlSearch(server);
}
