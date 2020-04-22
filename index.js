'use strict';

import {routes} from "./server/routes";

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    init: (server) => {
      routes(server);
    },

    uiExports: {
      visTypes: ['plugins/kbn_vis_sql/register_vis'],
    }
  });
}

