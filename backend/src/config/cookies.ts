import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { AuthService, SessionStorage } from 'src/domain/auth';

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function getSecret() {
  if (process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }
  if (!IS_PRODUCTION) {
    return 'secret';
  }
  throw new Error('SESSION_SECRET must be defined for production');
}

export function configureSession(app: NestExpressApplication): void {
  const authService = app.get(AuthService);

  const secret = getSecret();

  const secure = !!authService.config.baseUrl?.startsWith('https');
  const sameSite = secure ? 'none' : 'strict';
  const configureCookie = !authService.config.trustProxy;

  app.use(
    session({
      cookie: configureCookie ? { sameSite, secure, maxAge: SEVEN_DAYS_IN_MS } : undefined,
      proxy: true,
      saveUninitialized: false,
      secret,
      store: app.get(SessionStorage),
      resave: false,
    }),
  );
}

export function configureCookies(app: NestExpressApplication): void {
  app.use(cookieParser());
}
