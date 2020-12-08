import { PluginInitializerContext } from 'kibana/server';
import { KbnVisSqlServer } from './plugin';

export function plugin(initializerContext: PluginInitializerContext) {
  return new KbnVisSqlServer(initializerContext);
}
