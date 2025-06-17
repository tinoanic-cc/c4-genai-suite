import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSiteLinksToSettings1731938917998 implements MigrationInterface {
  name = 'AddSiteLinksToSettings1731938917998';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "settings" ADD "siteLinks" json`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "siteLinks"`);
  }
}
