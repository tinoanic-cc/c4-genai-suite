import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExtensionState1741021895311 implements MigrationInterface {
  name = 'AddExtensionState1741021895311';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "extensions" ADD "state" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "extensions" DROP COLUMN "state"`);
  }
}
