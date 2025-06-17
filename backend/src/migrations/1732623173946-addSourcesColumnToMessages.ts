import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1732623173946 implements MigrationInterface {
  name = 'AddSourcesColumnToMessages1732623173946';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "messages" ADD "sources" json`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "sources"`);
  }
}
