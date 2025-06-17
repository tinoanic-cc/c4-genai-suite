import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConfigurationUserRelation1745490114806 implements MigrationInterface {
  name = 'AddConfigurationUserRelation1745490114806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "configurations_users" ("id" SERIAL NOT NULL, "isDefault" boolean NOT NULL DEFAULT false, "values" json NOT NULL, "configurationId" integer, "userId" character varying, CONSTRAINT "PK_589342669ed6ef463b3ff0af483" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "configurations_users" ADD CONSTRAINT "FK_d5a166f2318309f5fc0bf3d7d8b" FOREIGN KEY ("configurationId") REFERENCES "configurations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "configurations_users" ADD CONSTRAINT "FK_bea6ab346226db3cad1d090aadf" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "configurations_users" ADD CONSTRAINT "UQ_ca0615556839dfac975d254e793" UNIQUE ("userId", "configurationId", "isDefault")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "configurations_users" DROP CONSTRAINT "FK_bea6ab346226db3cad1d090aadf"`);
    await queryRunner.query(`ALTER TABLE "configurations_users" DROP CONSTRAINT "FK_d5a166f2318309f5fc0bf3d7d8b"`);
    await queryRunner.query(`DROP TABLE "configurations_users"`);
    await queryRunner.query(`ALTER TABLE "configurations_users" DROP CONSTRAINT "UQ_ca0615556839dfac975d254e793"`);
  }
}
