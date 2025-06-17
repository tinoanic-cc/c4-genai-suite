import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendFilesandBlobsTable1740589058121 implements MigrationInterface {
  name = 'ExtendFilesandBlobsTable1740589058121';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."blobs_category_enum" AS ENUM('original', 'processed', 'llm_image', 'logo')`);
    await queryRunner.query(`ALTER TABLE "blobs" ADD "category" "public"."blobs_category_enum" NOT NULL DEFAULT 'llm_image'`);
    await queryRunner.query(`UPDATE blobs SET "category" = 'logo' WHERE id IN ('__backgroundLogo', '__logo', '__avatarLogo')`);
    await queryRunner.query(`ALTER TABLE "blobs" ADD "userId" character varying`);
    await queryRunner.query(`ALTER TABLE "blobs" ADD "fileId" integer`);
    await queryRunner.query(`ALTER TABLE "files" ADD "extensionId" integer`);
    await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_03457cb4a0bd785d24201481f67"`);
    await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "bucketId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "blobs" ADD CONSTRAINT "FK_e028c154ec26db08276f5e00dc8" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blobs" ADD CONSTRAINT "FK_1ebdbbb95685fd1e929be488466" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_03457cb4a0bd785d24201481f67" FOREIGN KEY ("bucketId") REFERENCES "bucket"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_343fd9190f072c137848a25d586" FOREIGN KEY ("extensionId") REFERENCES "extensions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `UPDATE "files" SET "conversationId" = NULL WHERE "conversationId" NOT IN (SELECT id FROM conversations)`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_d793e035119090188909fa6559a" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(`
      UPDATE blobs
      SET "userId" = blobs_to_update."userId"
      FROM (
          SELECT b.id AS blob_id, c."userId"
          FROM messages m
          JOIN blobs b ON m."data" ILIKE concat('%blobs/', b.id, '%')
          JOIN conversations c ON c.id = m."conversationId"
          WHERE m.tools::text ILIKE '%dall%'
      ) AS blobs_to_update
      WHERE blobs.id = blobs_to_update.blob_id
    `);
    await queryRunner.query(`DELETE FROM blobs where category = 'llm_image' and "userId" is NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_d793e035119090188909fa6559a"`);
    await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_343fd9190f072c137848a25d586"`);
    await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_03457cb4a0bd785d24201481f67"`);
    await queryRunner.query(`ALTER TABLE "blobs" DROP CONSTRAINT "FK_1ebdbbb95685fd1e929be488466"`);
    await queryRunner.query(`ALTER TABLE "blobs" DROP CONSTRAINT "FK_e028c154ec26db08276f5e00dc8"`);
    await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "bucketId" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_03457cb4a0bd785d24201481f67" FOREIGN KEY ("bucketId") REFERENCES "bucket"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "extensionId"`);
    await queryRunner.query(`ALTER TABLE "blobs" DROP COLUMN "fileId"`);
    await queryRunner.query(`ALTER TABLE "blobs" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "blobs" DROP COLUMN "category"`);
    await queryRunner.query(`DROP TYPE "public"."blobs_category_enum"`);
  }
}
