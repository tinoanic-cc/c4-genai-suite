import { Global, Module } from '@nestjs/common';
import { PrometheusModule as PrometheusModuleBase } from '@willsoto/nestjs-prometheus';
import { CounterProviders } from './metrics.service';
import { MetricsService } from './metrics.service';

@Global()
@Module({})
export class PrometheusModule {
  static external() {
    return {
      module: PrometheusModule,
      imports: [
        PrometheusModuleBase.register({
          defaultMetrics: {
            enabled: true,
          },
        }),
      ],
    };
  }

  static forRoot() {
    const module = PrometheusModuleBase.register({
      defaultMetrics: {
        enabled: false,
      },
    });
    module.controllers = [];

    return {
      module: PrometheusModule,
      imports: [module],
      providers: [MetricsService, ...CounterProviders],
      exports: [MetricsService],
    };
  }
}
