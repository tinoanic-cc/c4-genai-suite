import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConversationIdToFile1733240593926 implements MigrationInterface {
  name = 'AddConversationIdToFile1733240593926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" ADD "conversationId" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "conversationId"`);
  }
}
