// @ts-ignore
import { PluginInitializerContext } from 'kibana/public';
import { SqlVisPlugin as Plugin } from './plugin';

export function plugin(initializerContext: PluginInitializerContext) {
  return new Plugin(initializerContext);
}
