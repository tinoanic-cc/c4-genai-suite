import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addMonths, startOfMonth } from 'date-fns';
import { And, LessThan, MoreThanOrEqual } from 'typeorm';
import {
  BUILTIN_USER_GROUP_ADMIN,
  BUILTIN_USER_GROUP_DEFAULT,
  UsageEntity,
  UsageRepository,
  UserGroupEntity,
  UserGroupRepository,
} from 'src/domain/database';
import { ChatContext, ChatMiddleware, ChatNextDelegate, GetContext } from '../interfaces';

export class CheckUsageMiddleware implements ChatMiddleware {
  order = -1000;

  constructor(
    @InjectRepository(UserGroupEntity)
    private readonly userGroups: UserGroupRepository,

    @InjectRepository(UsageEntity)
    private readonly usages: UsageRepository,
  ) {}

  async invoke(context: ChatContext, getContext: GetContext, next: ChatNextDelegate): Promise<any> {
    const user = context.user;

    if (user.userGroupId === BUILTIN_USER_GROUP_ADMIN || user.userGroupId === BUILTIN_USER_GROUP_DEFAULT) {
      await next(context);
      return;
    }

    const userGroup = await this.userGroups.findOneBy({ id: user.userGroupId });
    const monthlyTokens = userGroup?.monthlyTokens ?? 0;
    const monthlyUserTokens = userGroup?.monthlyUserTokens ?? 0;

    if (!userGroup || (monthlyTokens < 0 && monthlyUserTokens < 0)) {
      await next(context);
      return;
    }

    const dateFrom = startOfMonth(new Date());
    const dateTo = addMonths(dateFrom, 1);

    if (monthlyTokens > 0) {
      const groupUsage =
        (await this.usages.sum('count', {
          date: And(MoreThanOrEqual(dateFrom), LessThan(dateTo)),
          userGroup: user.userGroupId,
        })) ?? 0;

      if (groupUsage >= monthlyTokens) {
        throw new HttpException('Monthly token limit exceeded for user group.', HttpStatus.TOO_MANY_REQUESTS);
      }
    }

    if (monthlyUserTokens > 0) {
      const groupUsage =
        (await this.usages.sum('count', {
          date: And(MoreThanOrEqual(dateFrom), LessThan(dateTo)),
          userId: user.id,
        })) ?? 0;

      if (groupUsage >= monthlyUserTokens) {
        throw new HttpException('Monthly token limit exceeded for user.', HttpStatus.TOO_MANY_REQUESTS);
      }
    }

    await next(context);
  }
}
