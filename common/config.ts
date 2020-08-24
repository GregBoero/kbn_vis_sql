import {schema, TypeOf} from '@kbn/config-schema';

export const configSchema = schema.object({
  enabled: schema.boolean({ defaultValue: true }),
  enableExternalUrls: schema.boolean({ defaultValue: false }),
});


export type kbnVisSqlConfig = TypeOf<typeof configSchema>;
