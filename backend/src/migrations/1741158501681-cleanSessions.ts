import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanSessions1741158501681 implements MigrationInterface {
  name = 'CleanSessions1741158501681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE "sessions"`);
    await queryRunner.query(`ALTER TABLE "sessions" ADD "userId" character varying`);
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6"`);
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "userId"`);
  }
}
