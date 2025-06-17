import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsNameSetManuallyColumnToConversation1730387918386 implements MigrationInterface {
  name = 'AddIsNameSetManuallyColumnToConversation1730387918386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "conversations" ADD "isNameSetManually" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "isNameSetManually"`);
  }
}
