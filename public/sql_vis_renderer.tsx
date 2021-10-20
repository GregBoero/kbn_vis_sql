/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import {SqlVisDependencies} from "./plugin";
import {SqlFilterRenderValue} from "./sql_vis_fn";
// @ts-ignore
import {ExpressionRenderDefinition} from "../../../src/plugins/expressions";
import {SqlFilterVisControllerType} from "./vis_controller";

const sqlFilterControlVisRegistry = new Map<HTMLElement, SqlFilterVisControllerType>();

export const getSqlFilterVisRenderer: (
  deps: Readonly<SqlVisDependencies>
) => ExpressionRenderDefinition<SqlFilterRenderValue> = (deps) => ({
  name: 'kbn_vis_sql',
  displayName: 'Sql visualization',
  reuseDomNode: true,
  render: async (domNode, {visData, visParams}, handlers) => {
    let registeredController = sqlFilterControlVisRegistry.get(domNode);

    if (!registeredController) {
      const {createSqlVisController} = await import('./vis_controller');

      registeredController = createSqlVisController(deps, handlers, domNode);
      sqlFilterControlVisRegistry.set(domNode, registeredController);

      handlers.onDestroy(() => {
        registeredController?.destroy();
        sqlFilterControlVisRegistry.delete(domNode);
      });
    }
    await registeredController.render(visData, visParams);
    handlers.done();
  },
});
