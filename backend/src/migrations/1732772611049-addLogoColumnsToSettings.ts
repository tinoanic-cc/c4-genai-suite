import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLogoColumnsToSettings1732772611049 implements MigrationInterface {
  name = 'AddLogoColumnsToSettings1732772611049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "settings" ADD "logo" text`);
    await queryRunner.query(`ALTER TABLE "settings" ADD "backgroundLogo" text`);
    await queryRunner.query(`ALTER TABLE "settings" ADD "avatarLogo" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "avatarLogo"`);
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "backgroundLogo"`);
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "logo"`);
  }
}
