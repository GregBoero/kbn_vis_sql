import {CoreSetup, CoreStart, IUiSettingsClient, Plugin, PluginInitializerContext} from 'kibana/public';

import {createSqlVisFn} from "./sql_vis_fn";
import {createSqlVisTypeDefinition} from "./sql_vis_type";
import {
  DataPublicPluginSetup,
  DataPublicPluginStart,
  ExpressionsPublicPlugin,
  VisualizationsSetup,
} from "../common/import";


type FilterVisCoreSetup = CoreSetup<SqlVisPluginStartDependencies, void>;

export interface SqlVisDependencies {
  core: FilterVisCoreSetup;
  data: DataPublicPluginSetup;
  uiSettings: IUiSettingsClient;
}

/** @internal */
export interface SqlVisPluginStartDependencies {
  expressions: ReturnType<ExpressionsPublicPlugin['start']>;
  data: DataPublicPluginStart;
}

/** @internal */
export interface SqlVisPluginSetupDependencies {
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
  visualizations: VisualizationsSetup;
  data: DataPublicPluginSetup;
  uiSettings: IUiSettingsClient,
}


export class SqlVisPlugin implements Plugin<Promise<void>, void, SqlVisPluginSetupDependencies> {
  constructor(initializerContext: PluginInitializerContext) {
  }

  async setup(core: FilterVisCoreSetup, plugins: SqlVisPluginSetupDependencies) {
    const {expressions, visualizations, data, uiSettings} = plugins;
    const deps: Readonly<SqlVisDependencies> = {core, data, uiSettings};
    expressions.registerFunction(() => createSqlVisFn(deps));
    visualizations.createBaseVisualization(createSqlVisTypeDefinition(deps));
  }

  start(core: CoreStart, plugins: SqlVisPluginSetupDependencies): Promise<void> | void {
  }


}


