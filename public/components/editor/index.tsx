import React, {lazy} from "react";
import {QueryControlsTabProps} from 'plugins/kbn_vis_sql/common/import';

const QueryControlsTab = lazy(() => import('./query/query_controls_tab'));
const QueryVisOptionTab = lazy(() => import('./option/query_vis_option_tab'));

export const getControlsTab = () => (
  props: QueryControlsTabProps
) => <QueryControlsTab {...props} />;

export const OptionsTabLazy = () => (props: QueryControlsTabProps) => (
  <QueryVisOptionTab {...props} />
);
