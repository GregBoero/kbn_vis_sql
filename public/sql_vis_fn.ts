import {ExpressionFunction, KibanaDatatable, Render,} from '../../../src/plugins/expressions/public';
import {SqlRequestHandlerProvider} from './sql_request_handler_provider';
import {get} from 'lodash';
import {SqlVisDependencies} from "./plugin";

const name = 'kbn_vis_sql';

type Context = KibanaDatatable;

interface Arguments {
  visConfig: string;
}

type VisParams = Required<Arguments>;

interface RenderValue {
  visType: 'kbn_vis_sql';
  visConfig: VisParams;
}

type Return = Promise<Render<RenderValue>>;


export const createSqlVisFn = (deps: Readonly<SqlVisDependencies>): ExpressionFunction<typeof name,
  Context,
  Arguments,
  Return> => ({
  name: 'kbn_vis_sql',
  type: 'render',
  context: {
    types: [],
  },
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

    response.visType = 'kbn_vis_sql';

    return {
      type: 'render',
      as: 'visualization',
      value: {
        visType: 'kbn_vis_sql',
        visConfig: params,
        visData: response
      },
    };
  },
});
