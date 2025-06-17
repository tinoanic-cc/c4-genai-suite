import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameDeploymentsToConfigurations1727169611944 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // RENAME TABLES
    await queryRunner.query(`ALTER TABLE "deployments" RENAME TO "configurations"`);
    await queryRunner.query(
      `ALTER TABLE "deployments_user_groups_user-groups" RENAME TO "configurations_user_groups_user-groups"`,
    );

    // RENAME SEQUENCE
    await queryRunner.query(`ALTER SEQUENCE deployments_id_seq RENAME TO configurations_id_seq`);

    // RENAME COLUMN IN Conversations
    await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_1fb3036a27af83fb2925b945318"`);
    await queryRunner.query(`ALTER TABLE "conversations" RENAME COLUMN "deploymentId" TO "configurationId"`);
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_e06bab1570a461291c3b58db055" FOREIGN KEY ("configurationId") REFERENCES "configurations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    // RENAME COLUMN IN Extensions
    await queryRunner.query(`ALTER TABLE "extensions" DROP CONSTRAINT "FK_b2f52ec84a107c7ad5fc70a80e1"`);
    await queryRunner.query(`ALTER TABLE "extensions" RENAME COLUMN "deploymentId" TO "configurationId"`);
    await queryRunner.query(
      `ALTER TABLE "extensions" ADD CONSTRAINT "FK_74cf6af3ad47c54f9863ee51d05" FOREIGN KEY ("configurationId") REFERENCES "configurations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // RENAME COLUMNS AND CONSTRAINTS IN configurations_user_groups_user-groups
    await queryRunner.query(
      `ALTER TABLE "configurations_user_groups_user-groups" DROP CONSTRAINT "FK_b680168ba1c3aa213e4cb17c313"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configurations_user_groups_user-groups" DROP CONSTRAINT "FK_64aa2551e832baefc1392a256b8"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_b680168ba1c3aa213e4cb17c31"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_64aa2551e832baefc1392a256b"`);

    await queryRunner.query(
      `ALTER TABLE "configurations_user_groups_user-groups" RENAME COLUMN "deploymentsId" TO "configurationsId"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e0489a4951411c95f7fc675871" ON "configurations_user_groups_user-groups" ("configurationsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f23b6c40c255c592e3d0b7d6af" ON "configurations_user_groups_user-groups" ("userGroupsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "configurations_user_groups_user-groups" ADD CONSTRAINT "FK_e0489a4951411c95f7fc675871b" FOREIGN KEY ("configurationsId") REFERENCES "configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "configurations_user_groups_user-groups" ADD CONSTRAINT "FK_f23b6c40c255c592e3d0b7d6af8" FOREIGN KEY ("userGroupsId") REFERENCES "user-groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "configurations_user_groups_user-groups" DROP CONSTRAINT "FK_f23b6c40c255c592e3d0b7d6af8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configurations_user_groups_user-groups" DROP CONSTRAINT "FK_e0489a4951411c95f7fc675871b"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_f23b6c40c255c592e3d0b7d6af"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e0489a4951411c95f7fc675871"`);
    await queryRunner.query(
      `ALTER TABLE "configurations_user_groups_user-groups" RENAME COLUMN "configurationsId" TO "deploymentsId"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_64aa2551e832baefc1392a256b" ON "configurations_user_groups_user-groups" ("userGroupsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b680168ba1c3aa213e4cb17c31" ON "configurations_user_groups_user-groups" ("deploymentsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "configurations_user_groups_user-groups" ADD CONSTRAINT "FK_64aa2551e832baefc1392a256b8" FOREIGN KEY ("userGroupsId") REFERENCES "user-groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "configurations_user_groups_user-groups" ADD CONSTRAINT "FK_b680168ba1c3aa213e4cb17c313" FOREIGN KEY ("deploymentsId") REFERENCES "configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    await queryRunner.query(`ALTER TABLE "extensions" DROP CONSTRAINT "FK_74cf6af3ad47c54f9863ee51d05"`);
    await queryRunner.query(`ALTER TABLE "extensions" RENAME COLUMN "configurationId" TO "deploymentId"`);
    await queryRunner.query(
      `ALTER TABLE "extensions" ADD CONSTRAINT "FK_b2f52ec84a107c7ad5fc70a80e1" FOREIGN KEY ("deploymentId") REFERENCES "configurations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_e06bab1570a461291c3b58db055"`);
    await queryRunner.query(`ALTER TABLE "conversations" RENAME COLUMN "configurationId" TO "deploymentId"`);
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_1fb3036a27af83fb2925b945318" FOREIGN KEY ("deploymentId") REFERENCES "configurations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    await queryRunner.query(`ALTER SEQUENCE configurations_id_seq RENAME TO deployments_id_seq`);

    await queryRunner.query(
      `ALTER TABLE "configurations_user_groups_user-groups" RENAME TO "deployments_user_groups_user-groups"`,
    );

    await queryRunner.query(`ALTER TABLE "configurations" RENAME TO "deployments"`);
  }
}
