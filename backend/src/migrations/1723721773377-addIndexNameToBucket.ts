import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexNameToBucket1723721773377 implements MigrationInterface {
  name = 'AddIndexNameToBucket1723721773377';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bucket" ADD "indexName" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bucket" DROP COLUMN "indexName"`);
  }
}
