import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExtensionUserArgumentsToConversation1726819604345 implements MigrationInterface {
  name = 'AddExtensionUserArgumentsToConversation1726819604345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "conversations" ADD "extensionUserArguments" json`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "extensionUserArguments"`);
  }
}
