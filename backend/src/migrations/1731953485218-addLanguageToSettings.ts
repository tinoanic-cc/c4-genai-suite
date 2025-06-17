import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLanguageToSettings1731953485218 implements MigrationInterface {
  name = 'AddLanguageToSettings1731953485218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "settings" ADD "language" character varying(2)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "language"`);
  }
}
