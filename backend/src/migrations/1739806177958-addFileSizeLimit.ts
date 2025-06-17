import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFileSizeLimit1739806177958 implements MigrationInterface {
  name = 'AddFileSizeLimit1739806177958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bucket" ADD "fileSizeLimits" json NOT NULL DEFAULT '{"general":1,"pdf":10,"pptx":10}'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bucket" DROP COLUMN "fileSizeLimits"`);
  }
}
