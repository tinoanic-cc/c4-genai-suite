import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteUsersRolesColumn1738674184231 implements MigrationInterface {
  name = 'DeleteUsersRolesColumn1738674184231';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "roles" text`);
  }
}
