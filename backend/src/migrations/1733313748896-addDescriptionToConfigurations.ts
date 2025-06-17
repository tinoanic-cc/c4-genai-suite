import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionToConfigurations1733313748896 implements MigrationInterface {
  name = 'AddDescriptionToConfigurations1733313748896';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "configurations" ADD "description" character varying NOT NULL DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "configurations" DROP COLUMN "description"`);
  }
}
