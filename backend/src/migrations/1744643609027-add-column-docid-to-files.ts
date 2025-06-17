import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnDocidToFiles1744643609027 implements MigrationInterface {
  name = 'AddColumnDocidToFiles1744643609027';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" ADD "docId" integer`);
    await queryRunner.query(`UPDATE "files" SET "docId" = "id"`);
    await queryRunner.query(
      `
      CREATE OR REPLACE FUNCTION set_default_doc_id()
      RETURNS TRIGGER AS $$
      BEGIN
          IF NEW."docId" IS NULL THEN
              NEW."docId" := NEW.id;
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      CREATE TRIGGER set_default_doc_id_trigger
      BEFORE INSERT ON files
      FOR EACH ROW
      EXECUTE FUNCTION set_default_doc_id();
      `,
    );
    await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "docId" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER set_default_doc_id_trigger ON files`);
    await queryRunner.query(`DROP FUNCTION set_default_doc_id`);
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "docId"`);
  }
}
