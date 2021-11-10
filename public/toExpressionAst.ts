// @ts-ignore
import {Vis} from "../../../src/plugins/visualizations/public/vis";
// @ts-ignore
import {buildExpression, buildExpressionFunction} from "../../../src/plugins/expressions/common";
import {SqlFilterExpressionFunctionDefinition, SqlFilterVisParams} from "./sql_vis_fn";

export const toExpressionAst = (vis: Vis<SqlFilterVisParams>) => {
  const visParams = JSON.stringify(vis.params);

  const sqlFilter = buildExpressionFunction<SqlFilterExpressionFunctionDefinition>('kbn_sql_vis', {
    visParams,
  });

  const ast = buildExpression([sqlFilter]);

  return ast.toAst();
};
