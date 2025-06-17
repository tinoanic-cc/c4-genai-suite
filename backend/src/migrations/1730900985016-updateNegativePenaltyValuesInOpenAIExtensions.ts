import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNegativePenaltyValuesInOpenAIExtensions1730900985016 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE extensions SET "values" = JSONB_SET("values"::JSONB, '{frequencyPenalty}', '0'::TEXT::JSONB)
       WHERE name in ('open-ai-compatible-model', 'open-ai-model', 'azure-open-ai-model') AND ("values"::JSON ->> 'frequencyPenalty')::NUMERIC < 0;`,
    );

    await queryRunner.query(
      `UPDATE extensions SET "values" = JSONB_SET("values"::JSONB, '{presencePenalty}', '0'::TEXT::JSONB)
       WHERE name in ('open-ai-compatible-model', 'open-ai-model', 'azure-open-ai-model') AND  ("values"::JSON ->> 'presencePenalty')::NUMERIC < 0;`,
    );
  }

  public async down(): Promise<void> {}
}
