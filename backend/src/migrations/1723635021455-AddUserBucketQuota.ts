import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserBucketQuota1723635021455 implements MigrationInterface {
  name = 'AddUserBucketQuota1723635021455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bucket" ADD "perUserQuota" integer NOT NULL DEFAULT '20'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bucket" DROP COLUMN "perUserQuota"`);
  }
}
