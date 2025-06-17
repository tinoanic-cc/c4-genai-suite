import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeToBucket1733484539170 implements MigrationInterface {
  name = 'AddTypeToBucket1733484539170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."bucket_type_enum" AS ENUM('general', 'user', 'conversation')`);
    await queryRunner.query(`ALTER TABLE "bucket" ADD "type" "public"."bucket_type_enum" NOT NULL DEFAULT 'general'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bucket" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."bucket_type_enum"`);
  }
}
