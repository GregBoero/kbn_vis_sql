import React, {Component} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  EuiFormRow,
  EuiSelect,
  EuiSpacer,
  EuiForm,
  EuiSwitch,
} from '@elastic/eui';

export class QueryVisOptionTab extends Component {
  options = [{value: 'datatable', text: 'DataTables'}, {value: 'metric', text: 'Metric'}];

  constructor(props, context) {
    super(props, context);
  }

  setVisParam(paramName, paramValue) {
    this.props.setValue(paramName, paramValue);
  };

  handleVisTypeChange = (evt) => {
    this.setVisParam('visType', _.trim(evt.target.value));
  };

  handleUseTimeFilterChange = (evt) => {
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

QueryVisOptionTab.propTypes = {
  stateParams: PropTypes.object.isRequired,
};
