import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetLogoValuesInSettingsTable1733127489887 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const logoColumns = ['logo', 'avatarLogo', 'backgroundLogo'];

    for (const logo of logoColumns) {
      await queryRunner.query(`update settings set "${logo}" = (select id from blobs b where id = '__${logo}') where id = 1`);
    }
  }

  public async down(): Promise<void> {}
}
