import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeUserEmailUnique1739445681819 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Step 1: Identify the users with the same email and the user with the lowest "createdAt" (the one to keep)
      WITH duplicate_users AS (
          SELECT email, 
                 MIN("createdAt") AS min_createdAt
          FROM users
          GROUP BY email
          HAVING COUNT(*) > 1
      ),
      -- Step 2: Get the "userId"s of the users to keep (earliest "createdAt")
      users_to_keep AS (
          SELECT u.email, u."id" AS "userId"
          FROM users u
          JOIN duplicate_users du
          ON u.email = du.email
          WHERE u."createdAt" = du.min_createdAt
      ),
      -- Step 3: Find the "userId"s that need to be updated (duplicates)
      users_to_update AS (
          SELECT u."id" AS "userId", u.email
          FROM users u
          JOIN duplicate_users du
          ON u.email = du.email
          WHERE u."createdAt" > du.min_createdAt
      ),
      -- Step 4: Update dependent tables ("files", "conversations" and "sessions)
      update_files AS (
          UPDATE files f
          SET "userId" = (SELECT "userId" FROM users_to_keep WHERE users_to_keep.email = u.email)
          FROM users_to_update u
          WHERE f."userId" = u."userId"
          RETURNING f.id
      ),
      update_conversations AS (
          UPDATE conversations c
          SET "userId" = (SELECT "userId" FROM users_to_keep WHERE users_to_keep.email = u.email)
          FROM users_to_update u
          WHERE c."userId" = u."userId"
          RETURNING c.id
      )
      -- Step 5: Delete the duplicate users (keep only the one with the earliest "createdAt")
      DELETE FROM users u
      WHERE u."id" IN (SELECT "userId" FROM users_to_update);
    `);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
  }
}
