import React, { ChangeEvent, Component } from 'react';
import _ from 'lodash';
import { EuiForm, EuiFormRow, EuiSelect, EuiSpacer, EuiSwitch, EuiSwitchEvent } from '@elastic/eui';

import {QueryControlsTabProps, QueryVisParams} from 'plugins/kbn_vis_sql/common/import';
import { getAvailableVisType } from '../../../../common/SqlVIsOptionHelper';



class QueryVisOptionTab extends Component<QueryControlsTabProps, QueryVisParams> {
  options = getAvailableVisType();

  constructor(props: QueryControlsTabProps, context: any) {
    super(props, context);
  }

  setVisParam<T extends keyof QueryVisParams>(paramName: T, paramValue: QueryVisParams[T]) {
    this.props.setValue(paramName, paramValue);
  }

  handleVisTypeChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    this.setVisParam('visType', _.trim(evt.target.value));
  };

  handleUseTimeFilterChange = (evt: EuiSwitchEvent) => {
    this.setVisParam('useTimeFilter', evt.target.checked);
  };

  render() {
    return (
      <EuiForm>
        <EuiFormRow
          id={`vis-type`}
          label="Type of visualisation"
          helpText="the type of visualisation needed"
        >
          <EuiSelect
            options={this.options}
            value={this.props.stateParams.visType}
            onChange={this.handleVisTypeChange}
          />
        </EuiFormRow>
        <EuiSpacer size="m" />

        <EuiFormRow
          id={`vis-use-time`}
          label="Use time filter"
          helpText="should we use the time filter in request"
        >
          <EuiSwitch
            label="Use Time filter"
            checked={this.props.stateParams.useTimeFilter}
            onChange={this.handleUseTimeFilterChange}
            data-test-subj="useAllOption"
            id=""
          />
        </EuiFormRow>
      </EuiForm>
    );
  }
}

// default export required for React.Lazy
// eslint-disable-next-line import/no-default-export
export { QueryVisOptionTab as default };
