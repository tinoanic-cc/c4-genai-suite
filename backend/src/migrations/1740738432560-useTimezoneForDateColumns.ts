import { MigrationInterface, QueryRunner } from 'typeorm';

export class UseTimezoneForDateColumns1740738432560 implements MigrationInterface {
  name = 'useTimezoneForDateColumns1740738432560';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET timezone = 'UTC'`);
    await queryRunner.query(`ALTER TABLE "bucket" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "bucket" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "cache" ALTER COLUMN "expires" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "configurations" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "configurations" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "conversations" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "conversations" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "extensions" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "extensions" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "user-groups" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "user-groups" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ`);
    await queryRunner.query(`ALTER TABLE "usages" ALTER COLUMN "date" TYPE TIMESTAMPTZ`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bucket" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "bucket" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "cache" ALTER COLUMN "expires" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "configurations" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "configurations" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "conversations" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "conversations" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "extensions" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "extensions" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "user-groups" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "user-groups" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "usages" ALTER COLUMN "date" TYPE TIMESTAMP`);
  }
}
