import React, {PureComponent} from 'react';
import {InjectedIntlProps} from 'react-intl';

import _ from 'lodash';
// @ts-ignore
import {EuiCodeEditor, EuiFormRow,} from '@elastic/eui';

import CustomSqlMode from './ace_sql_rule/custom_sql_highlight_rules'
import {VisOptionsProps} from "ui/vis/editors/default";

export type QueryVisParams = {
  query: string;
  visType: string,
  useTimeFilter: boolean,
  isLoading: boolean,
  exportName: string,
}

export type QueryControlsTabProps = InjectedIntlProps &
  Pick<VisOptionsProps<QueryVisParams>, 'vis' | 'stateParams' | 'setValue'> & {
  stateParams: any,
}


export class QueryControlsTab extends PureComponent<QueryControlsTabProps> {
  aceEditor: any;
  helpText: string = '';


  constructor(props: QueryControlsTabProps, context: any) {
    super(props, context);
  }

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


  shouldComponentUpdate(nextProps: QueryControlsTabProps, nextState: any) {
    //TODO refactor the function to be more clear
    if (this.props.stateParams.usingTimeFilter !== nextProps.stateParams.useTimeFilter) {
      let query = nextProps.stateParams.query.toLowerCase();
      const dateTimeExpression = '\"@timestamp\" between [from] and [to] ';
      if (nextProps.stateParams.useTimeFilter) {
        if (_.includes(query, 'where')) {
          const whereIndex = query.indexOf('where') + 5;
          query = query.substring(0, whereIndex) + dateTimeExpression + 'and ' + query.substring(whereIndex);
        } else {
          query = query + ' where ' + dateTimeExpression;
        }
        this.helpText = 'You are using the option time filter for filter your data, do not modify the [form] , [to] tag they will be remplace your time section at display';
      } else {
        if (_.includes(query, dateTimeExpression)) {
          if (_.includes(query, 'and')) {
            query = query.replace(dateTimeExpression, '')
              .replace('whereand ', 'where');
          } else {
            query = query.replace(dateTimeExpression, '');
          }
        }
        this.helpText = '';
      }
      nextProps.stateParams.query = query;
      return true;
    }

    if (this.props !== nextProps) {
      return true;
    }
    return false;

  }


  render() {
    return (
      <EuiFormRow
        id={`queryEditor`}
        label={'SQL query'}
        helpText={this.helpText}>

        <EuiCodeEditor
          id={`queryEditor`}
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
          width='100%'
          height='200px'
        />
      </EuiFormRow>


    );
  }
}


