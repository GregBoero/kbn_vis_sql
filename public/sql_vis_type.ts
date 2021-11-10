import {SqlVisDependencies} from "./plugin";

import {DATATABLE_TYPE} from "../common/SqlVIsOptionHelper";
import {DefaultEditorSize} from '../common/import';
import {toExpressionAst} from "./toExpressionAst";
import {getControlsTab, OptionsTabLazy} from "./components/editor";


export function createSqlVisTypeDefinition(deps: Readonly<SqlVisDependencies>) {

  const ControlsTab = getControlsTab()
  const optionTab = OptionsTabLazy()

  return {
    name: 'kbn_vis_sql',
    type: 'table',
    title: 'Sql query Visualisation',
    description: 'Create Visualisation for Sql Query .',
    icon: 'visTable',
    stage: 'experimental',
    options: {
      showIndexSelection: false,
      showQueryBar: true,
      showFilterBar: true,
    },
    toExpressionAst,
    visConfig: {
      defaults: {
        query: '',
        visType: DATATABLE_TYPE.value,
        useTimeFilter: false,
        isLoading: true,
        exportName: 'default',
      },
    },
    editorConfig: {
      enableAutoApply: false,
      defaultSize: DefaultEditorSize.MEDIUM,
      optionTabs: [
        {
          name: 'query_controls',
          title: 'Query',
          editor: ControlsTab,
        },
        {
          name: 'vis_type',
          title: 'Vis option',
          editor: optionTab,
        },
      ],
    },
    inspectorAdapters: {}
  };
}
