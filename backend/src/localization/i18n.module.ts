import { join } from 'path';
import { Global, Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule as NestI18nModule, QueryResolver } from 'nestjs-i18n';
import { I18nService } from './i18n.service';

@Global()
@Module({
  imports: [
    NestI18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [new QueryResolver(['lang']), AcceptLanguageResolver],
    }),
  ],
  controllers: [],
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nModule {}
