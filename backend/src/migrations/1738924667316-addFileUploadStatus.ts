import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFileUploadStatus1738924667316 implements MigrationInterface {
  name = 'AddFileUploadStatus1738924667316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // we assume that all existing files are successfully uploaded
    await queryRunner.query(`ALTER TABLE "files" ADD "uploadStatus" character varying NOT NULL DEFAULT 'successful'`);
    // we have to drop default since our TypeORM does not specify a default and would try to migrate this away
    await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "uploadStatus" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "uploadStatus"`);
  }
}
