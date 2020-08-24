import {CoreSetup, CoreStart, IUiSettingsClient, Plugin, PluginInitializerContext} from 'kibana/public';

import {createSqlVisFn} from "./sql_vis_fn";
import {createSqlVisTypeDefinition} from "./sql_vis_type";
import {
  DataPublicPluginSetup,
  DataPublicPluginStart,
  ExpressionsPublicPlugin,
  VisualizationsSetup,
} from "../common/import";
import {kbnVisSqlConfig} from "../common/config";
import {setData, setNotifications, setUISettings} from './service';


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
  initializerContext: PluginInitializerContext<kbnVisSqlConfig>;

  constructor(initializerContext: PluginInitializerContext<kbnVisSqlConfig>) {
    this.initializerContext = initializerContext;
  }


  async setup(core: FilterVisCoreSetup, plugins: SqlVisPluginSetupDependencies) {
    const {expressions, visualizations, data, uiSettings} = plugins;
    const deps: Readonly<SqlVisDependencies> = {core, data, uiSettings};

    setUISettings(uiSettings);
    expressions.registerFunction(() => createSqlVisFn(deps));
    visualizations.createBaseVisualization(createSqlVisTypeDefinition(deps));
  }

  start(core: CoreStart, plugins: SqlVisPluginStartDependencies): Promise<void> | void {
    setNotifications(core.notifications);
    setData(plugins.data);
  }


}


