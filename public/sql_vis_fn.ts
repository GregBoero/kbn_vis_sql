import {
  ExpressionFunction,
  KibanaDatatable,
  Render,
} from '../../../src/plugins/expressions/public';

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


export const createSqlVisFn = (): ExpressionFunction<
  typeof name,
  Context,
  Arguments,
  Return
  > => ({
  name: 'kbn_vis_sql',
  type: 'render',
  context: {
    types: [],
  },
  help:  'Sql visualization',
  args: {
    visConfig: {
      types: ['string'],
      default: '"{}"',
      help: '',
    },
  },
  async fn(context, args) {
    const params = JSON.parse(args.visConfig);
    return {
      type: 'render',
      as: 'visualization',
      value: {
        visType: 'kbn_vis_sql',
        visConfig: params,
      },
    };
  },
});
