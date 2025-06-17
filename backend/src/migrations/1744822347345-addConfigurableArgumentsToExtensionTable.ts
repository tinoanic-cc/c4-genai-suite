import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConfigurableArgumentsToExtensionTable1744822347345 implements MigrationInterface {
  name = 'AddConfigurableArgumentsToExtensionTable1744822347345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "extensions" ADD "configurableArguments" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "extensions" DROP COLUMN "configurableArguments"`);
  }
}
