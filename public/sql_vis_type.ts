import {SqlVisDependencies} from "./plugin";
import {Status} from '../../../src/legacy/core_plugins/visualizations/public/index';
import {SqlRequestHandlerProvider} from "./sql_request_handler_provider";
import {QueryControlsTab} from "./components/editor/query/query_controls_tab";
import {QueryVisOptionTab} from "./components/editor/option/query_vis_option_tab";
import {SqlVisController} from "./vis_controller";
import {defaultFeedbackMessage} from "../common/feedback_message";
import {DATATABLE_TYPE} from "../common/SqlVIsOptionHelper";

export function createSqlVisTypeDefinition(deps: SqlVisDependencies) {

  const visRequestHandler = SqlRequestHandlerProvider(deps);

  return {
    name: 'kbn_vis_sql',
    title: 'Sql query Visualisation',
    icon: 'visTimelion',
    description: 'Create Visualisation for Sql Query .',
    stage: 'experimental',
    requiresUpdateStatus: [
      // Check for changes in the aggregation configuration for the visualization
      Status.AGGS,
      // Check for changes in the actual data returned from Elasticsearch
      Status.DATA,
      // Check for changes in the parameters (configuration) for the visualization
      Status.PARAMS,
      // Check if the visualization has changes its size
      Status.RESIZE,
      // Check if the time range for the visualization has been changed
      Status.TIME,
      // Check if the UI state of the visualization has been changed
      Status.UI_STATE],
    feedbackMessage: defaultFeedbackMessage,
    visualization: SqlVisController,
    visConfig: {
      defaults: {
        query: '',
        visType: DATATABLE_TYPE.value,
        useTimeFilter: false,
        isLoading: true,
        exportName: 'default',
      },
    },
    editor: 'default',
    editorConfig: {
      optionTabs: [
        {
          name: 'query_controls',
          title: 'Query',
          editor: QueryControlsTab
        },
        {
          name: 'vis_type',
          title: 'Vis option',
          editor: QueryVisOptionTab
        }
      ]
    },
    options: {
      showIndexSelection: false,
      showQueryBar: true,
      showFilterBar: true,
    },
    requestHandler: visRequestHandler,
    responseHandler: 'none',
  };
}
