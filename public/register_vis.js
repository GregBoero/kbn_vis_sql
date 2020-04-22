import {visFactory} from 'ui/vis/vis_factory';
import chrome from 'ui/chrome';
import {defaultFeedbackMessage} from 'ui/vis/default_feedback_message';
import {Status} from 'ui/vis/update_status';

import {VisController} from './vis_controller';
import {QueryControlsTab} from './components/editor/query/query_controls_tab';
import {QueryVisOptionTab} from './components/editor/option/query_vis_option_tab';
import {SqlRequestHandlerProvider} from './sql_request_handler_provider';

import { setup as visualisation } from '../../../src/legacy/core_plugins/visualizations/public/np_ready/public/legacy';

visualisation.types.registerVisualization(() => {
  const config = chrome.getUiSettingsClient();
  const visRequestHandler = SqlRequestHandlerProvider(config).handler;

  // return the visType object, which kibana will use to display and configure new Vis object of this type.
  return visFactory.createBaseVisualization({
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
    visualization: VisController,
    visConfig: {
      defaults: {
        query: '',
        visType: 'datatable',
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
  });
});

