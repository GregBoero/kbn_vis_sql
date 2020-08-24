
import {SqlRequestHandlerProvider} from './sql_request_handler_provider';
import {get} from 'lodash';
import {SqlVisDependencies} from "./plugin";
import {ExpressionFunctionDefinition, KibanaDatatable, Render} from "../common/import";


const name = 'kbn_vis_sql';

type Context = KibanaDatatable;

interface Arguments {
  visConfig: string;
}

type VisParams = Required<Arguments>;

interface RenderValue {
  visType: string;
  visConfig: VisParams;
}

type Return = Promise<Render<RenderValue>>;


export const createSqlVisFn = (
  deps: Readonly<SqlVisDependencies>
): ExpressionFunctionDefinition<typeof name, Context,  Arguments,  Return> => ({
  name,
  type: 'render',
  inputTypes: ['kibana_datatable'],
  help: 'Sql visualization',
  args: {
    visConfig: {
      types: ['string'],
      default: '"{}"',
      help: '',
    },
  },
  async fn(context, args) {
    const sqlRequestHandler = SqlRequestHandlerProvider(deps);
    const params = JSON.parse(args.visConfig);

    const response = await sqlRequestHandler({
      timeRange: get(context, 'timeRange'),
      query: get(context, 'query'),
      filters: get(context, 'filters'),
      visParams: params
    });

    return {
      type: 'render',
      as: 'visualization',
      value: {
        visType: name,
        visConfig: params,
        visData: response
      },
    };
  },
});
