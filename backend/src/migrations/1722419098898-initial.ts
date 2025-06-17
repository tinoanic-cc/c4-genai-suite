import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1722419098898 implements MigrationInterface {
  name = 'Initial1722419098898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // make sure the initial migration won't run against existing database
    if (await queryRunner.hasTable('extensions')) {
      return;
    }

    await queryRunner.query(
      `CREATE TABLE "extensions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "enabled" boolean NOT NULL, "values" text NOT NULL, "deploymentId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3632b8148c8f511650d3f3eda06" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user-groups" ("id" character varying NOT NULL, "name" character varying(100) NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "isBuiltIn" boolean NOT NULL DEFAULT false, "hideFileUpload" boolean NOT NULL DEFAULT false, "monthlyTokens" integer, "monthlyUserTokens" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_31bcff63bb07edf1833e1eed859" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "deployments" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "enabled" boolean NOT NULL, "agentName" text, "chatFooter" text, "chatSuggestions" json, "executorEndpoint" text, "executorHeaders" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1e5627acb3c950deb83fe98fc48" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "data" text NOT NULL, "rating" character varying, "error" character varying, "tools" text, "debug" text, "conversationId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversations" ("id" SERIAL NOT NULL, "name" character varying, "llm" character varying, "rating" character varying, "deploymentId" integer NOT NULL, "userId" character varying NOT NULL, "context" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bucket" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "endpoint" character varying NOT NULL, "headers" character varying, "isDefault" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e225107407bac585fd210381c12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "files" ("id" SERIAL NOT NULL, "mimeType" character varying NOT NULL, "fileSize" integer NOT NULL, "fileName" character varying NOT NULL, "userId" character varying, "bucketId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" character varying NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "apiKey" character varying(100), "roles" text, "passwordHash" character varying, "userGroupId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "settings" ("id" SERIAL NOT NULL, "name" character varying(30), "primaryColor" character varying(20), "primaryContentColor" character varying(20), "welcomeText" text, "customCss" text, "agentName" text, "chatFooter" text, "chatSuggestions" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blobs" ("id" character varying NOT NULL, "type" character varying NOT NULL, "buffer" text NOT NULL, CONSTRAINT "PK_fe61649fa345f685eb31b949e4c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cache" ("key" character varying NOT NULL, "value" text NOT NULL, "expires" TIMESTAMP NOT NULL, CONSTRAINT "PK_56570efc222b6e6be947abfc801" PRIMARY KEY ("key"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usages" ("date" TIMESTAMP NOT NULL, "userId" character varying NOT NULL, "userGroup" character varying NOT NULL, "counter" character varying NOT NULL, "key" character varying NOT NULL, "subKey" character varying NOT NULL, "count" integer NOT NULL, CONSTRAINT "PK_0acc90e335c519dc4e2140320f1" PRIMARY KEY ("date", "userId", "userGroup", "counter", "key", "subKey"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "deployments_user_groups_user-groups" ("deploymentsId" integer NOT NULL, "userGroupsId" character varying NOT NULL, CONSTRAINT "PK_88554169ba846968a7384cdcfc9" PRIMARY KEY ("deploymentsId", "userGroupsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b680168ba1c3aa213e4cb17c31" ON "deployments_user_groups_user-groups" ("deploymentsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_64aa2551e832baefc1392a256b" ON "deployments_user_groups_user-groups" ("userGroupsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "extensions" ADD CONSTRAINT "FK_b2f52ec84a107c7ad5fc70a80e1" FOREIGN KEY ("deploymentId") REFERENCES "deployments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_1fb3036a27af83fb2925b945318" FOREIGN KEY ("deploymentId") REFERENCES "deployments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_a9b3b5d51da1c75242055338b59" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_03457cb4a0bd785d24201481f67" FOREIGN KEY ("bucketId") REFERENCES "bucket"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_8b96e0ec79394c7e66bf88a05aa" FOREIGN KEY ("userGroupId") REFERENCES "user-groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deployments_user_groups_user-groups" ADD CONSTRAINT "FK_b680168ba1c3aa213e4cb17c313" FOREIGN KEY ("deploymentsId") REFERENCES "deployments"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "deployments_user_groups_user-groups" ADD CONSTRAINT "FK_64aa2551e832baefc1392a256b8" FOREIGN KEY ("userGroupsId") REFERENCES "user-groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "deployments_user_groups_user-groups" DROP CONSTRAINT "FK_64aa2551e832baefc1392a256b8"`);
    await queryRunner.query(`ALTER TABLE "deployments_user_groups_user-groups" DROP CONSTRAINT "FK_b680168ba1c3aa213e4cb17c313"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_8b96e0ec79394c7e66bf88a05aa"`);
    await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_03457cb4a0bd785d24201481f67"`);
    await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335"`);
    await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_a9b3b5d51da1c75242055338b59"`);
    await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_1fb3036a27af83fb2925b945318"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19"`);
    await queryRunner.query(`ALTER TABLE "extensions" DROP CONSTRAINT "FK_b2f52ec84a107c7ad5fc70a80e1"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_64aa2551e832baefc1392a256b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b680168ba1c3aa213e4cb17c31"`);
    await queryRunner.query(`DROP TABLE "deployments_user_groups_user-groups"`);
    await queryRunner.query(`DROP TABLE "usages"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TABLE "cache"`);
    await queryRunner.query(`DROP TABLE "blobs"`);
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TABLE "bucket"`);
    await queryRunner.query(`DROP TABLE "conversations"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TABLE "deployments"`);
    await queryRunner.query(`DROP TABLE "user-groups"`);
    await queryRunner.query(`DROP TABLE "extensions"`);
  }
}
