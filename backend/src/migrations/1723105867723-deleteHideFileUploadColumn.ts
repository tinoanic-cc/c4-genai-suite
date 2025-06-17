import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteHideFileUploadColumn1723105867723 implements MigrationInterface {
  name = 'DeleteHideFileUploadColumn1723105867723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user-groups" DROP COLUMN "hideFileUpload"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user-groups" ADD "hideFileUpload" boolean NOT NULL DEFAULT false`);
  }
}
