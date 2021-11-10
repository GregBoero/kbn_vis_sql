import {PluginInitializerContext} from 'kibana/server';
import {kbnVisSqlServer} from './plugin';

export function plugin(initializerContext: PluginInitializerContext) {
  return new kbnVisSqlServer(initializerContext);
}
