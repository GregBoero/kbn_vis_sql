import React, {Component} from 'react';

import _ from 'lodash';
// @ts-ignore
import {EuiCodeEditor, EuiFormRow} from '@elastic/eui';

import {CustomSqlMode} from './ace_sql_rule/custom_sql_highlight_rules';
import {QueryControlsTabProps, QueryVisParams} from 'plugins/kbn_vis_sql/common/import';


class QueryControlsTab extends Component<QueryControlsTabProps> {
  aceEditor: any;
  helpText: string = '';


  setVisParam<T extends keyof QueryVisParams>(paramName: T, paramValue: QueryVisParams[T]) {
    this.props.setValue(paramName, paramValue);
  }

  aceLoaded = (editor: any) => {
    const session = editor.getSession();
    session.setTabSize(2);
    session.setUseSoftTabs(true);

    this.aceEditor = editor;
  };

  handleQueryChange = (queryString: string) => {
    this.setVisParam('query', queryString);
  };

  handleUseTimeFilter = () => {
    const dateTimeExpression = '"@timestamp" between [from] and [to]';
    let query = _.clone(this.props.stateParams.query);
    // for the current query replace token by lower Cast token
    query = query.replace(/where/i, 'where');
    query = query.replace(/between/i, 'between');
    query = query.replace(/and/i, 'and');

    const isQueryContainDateTimeExpression = query.includes('where "@timestamp" between');
    const isQueryContainWhereClose = query.includes('where');
    // does the time filter enabled
    if (this.props.stateParams.useTimeFilter) {
      if (!isQueryContainDateTimeExpression) {
        if (isQueryContainWhereClose) {
          const whereIndex = query.indexOf('where') + 5;
          query =
            query.substring(0, whereIndex) +
            dateTimeExpression +
            ' and ' +
            query.substring(whereIndex);
        } else {
          query = query + ' where ' + dateTimeExpression;
        }
      }
      this.helpText =
        'You are using the option time filter for filter your data, do not modify the [form] , [to] tag they will be replace your time section at display';
    } else {
      if (isQueryContainDateTimeExpression) {
        if (query.includes('and')) {
          query = query.replace(dateTimeExpression, '').replace('whereand ', 'where');
        } else {
          query = query.replace(dateTimeExpression, '');
        }
      }
      this.helpText = '';
    }
    this.props.stateParams.query = query;
  };

  render() {
    this.handleUseTimeFilter();
    return (
      <EuiFormRow id={`queryEditor`} label={'SQL query'} helpText={this.helpText}>
        <EuiCodeEditor
          onLoad={this.aceLoaded}
          theme="textmate"
          aria-label="Write your query"
          value={this.props.stateParams.query}
          onChange={this.handleQueryChange}
          setOptions={{useWorker: true}}
          mode={new CustomSqlMode()}
          wrapEnabled={true}
          showPrintMargin={false}
          highlightActiveLine={false}
          width="100%"
          height="200px"
        />
      </EuiFormRow>
    );
  }
}

// default export required for React.Lazy
// eslint-disable-next-line import/no-default-export
export {QueryControlsTab as default};
