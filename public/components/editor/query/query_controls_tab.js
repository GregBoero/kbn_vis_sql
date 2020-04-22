import React, {Component} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  EuiFormRow,
  EuiCodeEditor,
} from '@elastic/eui';
import CustomSqlMode from './ace_sql_rule/custom_sql_highlight_rules'

export class QueryControlsTab extends Component {
  aceEditor;
  usingTimeFilter;
  helpText;


  constructor(props, context) {
    super(props, context);
    this.usingTimeFilter = props.stateParams.useTimeFilter;
  }

  setVisParam(paramName, paramValue) {
    this.props.setValue(paramName, paramValue);
  };

  aceLoaded = (editor) => {
    const session = editor.getSession();
    session.setTabSize(2);
    session.setUseSoftTabs(true);

    this.aceEditor = editor;
  };

  handleQueryChange = (queryString) => {
    this.setVisParam('query', queryString);
  };


  shouldComponentUpdate(nextProps, nextState, nextContext) {
    //TODO refactor the function to be more clear
    if (this.usingTimeFilter !== nextProps.stateParams.useTimeFilter) {
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
      this.usingTimeFilter = nextProps.stateParams.useTimeFilter;
      return true;
    }

    if (this.props !== nextProps) {
      return true;
    }

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

QueryControlsTab.propTypes = {
  stateParams: PropTypes.object.isRequired,
};
