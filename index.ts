import {resolve} from 'path';
import {Legacy} from 'kibana';

import {LegacyPluginApi, LegacyPluginInitializer} from '../../src/legacy/types';

import {routes} from "./server/routes";

const sqlVisPluginInitializer: LegacyPluginInitializer = ({Plugin}: LegacyPluginApi) =>
  new Plugin({
    id: 'kbn_vis_sql',
    require: ['kibana', 'elasticsearch', 'visualizations', 'interpreter', 'data'],
    publicDir: resolve(__dirname, 'public'),
    uiExports: {
      hacks: [resolve(__dirname, 'public/legacy')],
      injectDefaultVars: server => ({}),
    },
    init: (server: Legacy.Server) => routes(server),
    config(Joi: any) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },
  } as Legacy.PluginSpecOptions);

export default sqlVisPluginInitializer;
