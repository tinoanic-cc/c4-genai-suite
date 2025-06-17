import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingEntity, SettingRepository } from 'src/domain/database';
import { Settings } from '../interfaces';
import { buildSettings } from './utils';

export class GetSettings {}

export class GetSettingsResponse {
  constructor(public readonly settings: Settings) {}
}

@QueryHandler(GetSettings)
export class GetSettingsHandler implements IQueryHandler<GetSettings, GetSettingsResponse> {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settings: SettingRepository,
  ) {}

  async execute(): Promise<GetSettingsResponse> {
    const emptySettings = { id: 0, createdAt: new Date(), updatedAt: new Date() };
    const entity = await this.settings.findOneBy({ id: 1 });
    const result = buildSettings(entity || emptySettings);

    return new GetSettingsResponse(result);
  }
}
