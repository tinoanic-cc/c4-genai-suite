import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBucketType1733493031879 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE bucket SET "type" = 'user'
       WHERE "isDefault" = true`,
    );
  }

  public async down(): Promise<void> {}
}
