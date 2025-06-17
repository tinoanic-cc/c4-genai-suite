import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFileTypesColumnToBucket1728372009608 implements MigrationInterface {
  name = 'AddFileTypesColumnToBucket1728372009608';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bucket" ADD "allowedFileTypes" text array`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bucket" DROP COLUMN "allowedFileTypes"`);
  }
}
