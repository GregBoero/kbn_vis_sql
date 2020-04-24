import {CoreSetup, CoreStart, IUiSettingsClient, Plugin, PluginInitializerContext} from 'kibana/public';
import {DataPublicPluginSetup, DataPublicPluginStart} from "../../../src/plugins/data/public";
import {Plugin as ExpressionsPublicPlugin} from '../../../src/plugins/expressions/public';
import {
  VisualizationsSetup,
  VisualizationsStart
} from "../../../src/legacy/core_plugins/visualizations/public/np_ready/public";
import {createSqlVisFn} from "./sql_vis_fn";
import {createSqlVisTypeDefinition} from "./sql_vis_type";

/** @internal */
export interface SqlVisPluginStartDependencies {
  expressions: ReturnType<ExpressionsPublicPlugin['start']>;
  visualizations: VisualizationsStart;
  data: DataPublicPluginStart;

}

type FilterVisCoreSetup = CoreSetup<SqlVisPluginStartDependencies>;

export interface SqlVisDependencies {
  core: FilterVisCoreSetup;
  data: DataPublicPluginSetup;
  uiSettings: IUiSettingsClient;
}

/** @internal */
export interface SqlVisPluginSetupDependencies {
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
  visualizations: VisualizationsSetup;
  data: DataPublicPluginSetup;
  uiSettings: IUiSettingsClient,
}


export class SqlVisPlugin implements Plugin<Promise<void>, void> {
  constructor(public initializerContext: PluginInitializerContext) {
  }

  public async setup(
    core: FilterVisCoreSetup,
    {expressions, visualizations, data,uiSettings}: SqlVisPluginSetupDependencies
  ) {
    const visualizationDependencies: Readonly<SqlVisDependencies> = {
      core,
      data,
      uiSettings
    };
    expressions.registerFunction(() => createSqlVisFn(visualizationDependencies));
    visualizations.types.createBaseVisualization(
      createSqlVisTypeDefinition(visualizationDependencies)
    );
  }

  public start(core: CoreStart, deps: SqlVisPluginStartDependencies) {
    // nothing to do here
  }
}
