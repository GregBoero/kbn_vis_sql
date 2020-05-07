import React, {ChangeEvent, Component} from 'react';
import _ from 'lodash';
import {EuiForm, EuiFormRow, EuiSelect, EuiSpacer, EuiSwitch, EuiSwitchEvent,} from '@elastic/eui';
import {QueryVisParams} from '../query/query_controls_tab';
import {VisOptionsProps} from "ui/vis/editors/default";
import {getAvailableVisType} from "../../../../common/SqlVIsOptionHelper";

type QueryVisOptionTabProps =
  Pick<VisOptionsProps<QueryVisParams>, 'vis' | 'stateParams' | 'setValue'> & {
  stateParams: any;
}

export class QueryVisOptionTab extends Component<QueryVisOptionTabProps, QueryVisParams> {
  options = getAvailableVisType();

  constructor(props: QueryVisOptionTabProps, context: any) {
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
        <EuiSpacer size="m"/>

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
            id=""/>
        </EuiFormRow>
      </EuiForm>
    );
  }
}

