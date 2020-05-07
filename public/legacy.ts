import { npSetup, npStart } from 'ui/new_platform';
import { PluginInitializerContext } from 'kibana/public';

import { plugin } from '.';

import {
  SqlVisPluginSetupDependencies,
  SqlVisPluginStartDependencies,
} from './plugin';
import {
  setup as visualizationsSetup,
  start as visualizationsStart,
} from '../../../src/legacy/core_plugins/visualizations/public/np_ready/public/legacy';

const setupPlugins: Readonly<SqlVisPluginSetupDependencies> = {
  expressions: npSetup.plugins.expressions,
  data: npSetup.plugins.data,
  visualizations: visualizationsSetup,
  uiSettings:npSetup.core.uiSettings,
};

const startPlugins: Readonly<SqlVisPluginStartDependencies> = {
  expressions: npStart.plugins.expressions,
  data: npStart.plugins.data,
  visualizations: visualizationsStart,

};

const pluginInstance = plugin({} as PluginInitializerContext);

export const setup = pluginInstance.setup(npSetup.core, setupPlugins);
export const start = pluginInstance.start(npStart.core, startPlugins);
