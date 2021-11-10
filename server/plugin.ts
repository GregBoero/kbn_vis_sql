import { Observable } from 'rxjs';
import { CoreSetup, CoreStart, Logger, Plugin, PluginInitializerContext } from 'kibana/server';
import { routes } from './routes';
import { kbnVisSqlConfig } from '../common/config';

export class KbnVisSqlServer implements Plugin {
  // @ts-ignore
  private readonly config$: Observable<kbnVisSqlConfig>;
  private readonly log: Logger;

  // @ts-ignore
  constructor(private readonly initializerContext: PluginInitializerContext) {
    this.log = initializerContext.logger.get();
    this.config$ = initializerContext.config.create();
  }

  setup(core: CoreSetup<object, unknown>, plugins: object): Promise<void> | void {
    const router = core.http.createRouter();
    this.log.info('set the router route');
    routes(router);
  }

  start(core: CoreStart, plugins: object): Promise<void> | void {
    return undefined;
  }
}
