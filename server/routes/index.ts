import { IRouter } from 'kibana/server';
import { sqlSearch } from './sql_search';

export function routes(server: IRouter) {
  sqlSearch(server);
}
