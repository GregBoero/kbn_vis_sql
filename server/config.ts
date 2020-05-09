import {schema, TypeOf} from '@kbn/config-schema';
import {PluginConfigDescriptor} from "kibana/server";

export const config: PluginConfigDescriptor = {
  schema: schema.object({ enabled: schema.boolean({ defaultValue: true }) }),
};

export type kbnVisSqlServerConfig = TypeOf<typeof config.schema>;
