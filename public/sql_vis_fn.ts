import {SqlRequestHandlerProvider} from './sql_request_handler_provider';
import {get} from 'lodash';
import {SqlVisDependencies} from "./plugin";
import {ExpressionFunctionDefinition, KibanaDatatable, Render} from "../common/import";


type Input = KibanaDatatable;
type Output = Promise<Render<SqlFilterRenderValue>>;

export interface SqlFilterRenderValue {
  visData: any;
  visType: 'kbn_vis_sql';
  visParams: SqlFilterVisParams;
}

export interface SqlFilterVisParams {
  visParams: string;
}


export declare type SqlFilterExpressionFunctionDefinition = ExpressionFunctionDefinition<"kbn_sql_vis",
  Input,
  SqlFilterVisParams,
  Output>;


export const createSqlVisFn = (
  deps: Readonly<SqlVisDependencies>
): SqlFilterExpressionFunctionDefinition => ({
  name: "kbn_sql_vis",
  type: 'render',
  inputTypes: ['kibana_context', "null"],
  help: 'Sql visualization',
  args: {
    visParams: {
      types: ['string'],
      default: '"{}"',
      help: '',
    },
  },
  async fn(input, args) {
    const sqlRequestHandler = SqlRequestHandlerProvider(deps);
    const visParams = JSON.parse(args.visParams);

    const response = await sqlRequestHandler({
      timeRange: get(input, 'timeRange'),
      query: get(input, 'query'),
      filters: get(input, 'filters'),
      visParams
    });
    return {
      type: 'render',
      as: 'kbn_vis_sql',
      value: {
        visType: "kbn_vis_sql",
        visParams,
        visData: response
      },
    };
  },
});
