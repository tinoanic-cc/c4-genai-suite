import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity, UserEntity, UserGroupEntity } from '../database';
import { AuthService } from './auth.service';
import { SessionStorage } from './session-storage';
import { GithubStrategy, GoogleStrategy, LocalAuthGuard } from './strategies';
import { LocalStrategy, MicrosoftStrategy, OAuthStrategy } from './strategies';

@Module({
  imports: [ConfigModule, PassportModule, TypeOrmModule.forFeature([SessionEntity, UserEntity, UserGroupEntity])],
  exports: [AuthService, SessionStorage],
  providers: [
    AuthService, //
    GithubStrategy,
    GoogleStrategy,
    LocalStrategy,
    MicrosoftStrategy,
    OAuthStrategy,
    SessionStorage,
    LocalAuthGuard,
  ],
})
export class AuthModule {}
