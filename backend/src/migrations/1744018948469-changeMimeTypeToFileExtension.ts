import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeMimeTypeToFileExtension1744018948469 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Define the mappings in a temporary table
      CREATE TEMP TABLE file_type_mappings (
          value TEXT,
          label TEXT
      );
      
      -- Insert the mappings into the temporary table
      INSERT INTO file_type_mappings (value, label) VALUES
        -- pdf
        ('application/pdf', '.pdf'),
        -- markdown
        ('text/markdown', '.md'),
        -- html
        ('text/html', '.html'),
        ('text/html', '.htm'),
        ('application/xhtml+xml', '.xhtml'),
        -- code
        ('text/x-c++src', '.cpp'),
        ('text/x-go', '.go'),
        ('text/x-java-source', '.java'),
        ('application/javascript', '.js'),
        ('application/x-httpd-php', '.php'),
        ('application/vnd.google.protobuf', '.proto'),
        ('text/x-python', '.py'),
        ('application/x-ruby', '.rb'),
        ('text/rust', '.rs'),
        ('text/x-rst', '.rst'),
        ('text/x-scala', '.scala'),
        ('text/x-swift', '.swift'),
        -- json
        ('application/json', '.json'),
        -- libreoffice
        ('application/vnd.oasis.opendocument.presentation', '.odp'),
        ('application/vnd.oasis.opendocument.spreadsheet', '.ods'),
        ('application/vnd.oasis.opendocument.text', '.odt'),
        -- xml
        ('application/xml', '.xml'),
        ('text/xml', '.xml'),
        -- yaml
        ('application/yaml', '.yml'),
        ('application/yaml', '.yaml'),
        -- plain
        ('text/plain', '.txt'),
        -- excel
        ('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.xlsx'),
        -- ms word
        ('application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx'),
        -- ppt
        ('application/vnd.openxmlformats-officedocument.presentationml.presentation', '.pptx'),
        -- outlook
        ('application/vnd.ms-outlook', '.msg'),
        -- image
        ('image/png', '.png'),
        ('image/jpeg', '.jpeg'),
        ('image/jpg', '.jpg'),
        ('image/webp', '.webp'),
        -- voice
        ('audio/mp3', '.mp3'),
        ('audio/mpeg', '.mp3'),
        ('audio/m4a', '.m4a'),
        ('audio/x-m4a', '.m4a'),
        ('audio/ogg', '.ogg'),
        ('audio/ogg', '.oga'),
        ('application/ogg', '.ogx'),
        ('audio/flac', '.flac');
      
      UPDATE extensions
      SET "values" = jsonb_set(
          "values"::jsonb,
          '{fileNameExtensions}',
          (
              SELECT jsonb_agg(COALESCE(ftm.label, ft))
              FROM jsonb_array_elements_text("values"::jsonb->'fileTypes') AS ft
              LEFT JOIN file_type_mappings ftm ON ft = ftm.value
          )
      )
      WHERE "values"::jsonb ? 'fileTypes';
      
      UPDATE extensions
      SET "values" = "values"::jsonb - 'fileTypes'
      WHERE "values"::jsonb ? 'fileTypes';
      
      ALTER TABLE bucket ADD COLUMN "allowedFileNameExtensions" text[] NULL;
      
      -- Update the allowedFileTypes column in the bucket table
      UPDATE bucket
      SET "allowedFileNameExtensions" = ARRAY(
          SELECT DISTINCT COALESCE(ftm.label, ft) 
          FROM unnest("allowedFileTypes") AS ft
          LEFT JOIN file_type_mappings ftm ON ft = ftm.value
      );
      
      ALTER TABLE bucket DROP COLUMN "allowedFileTypes";
      
      -- Drop the temporary table
      DROP TABLE file_type_mappings;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Define the mappings in a temporary table
      CREATE TEMP TABLE file_type_mappings (
          value TEXT,
          label TEXT
      );
      
      -- Insert the mappings into the temporary table
      INSERT INTO file_type_mappings (value, label) VALUES
        -- pdf
        ('.pdf', 'application/pdf'),
        -- markdown
        ('.md', 'text/markdown'),
        -- html
        ('.html', 'text/html'),
        ('.htm', 'text/html'),
        ('.xhtml', 'application/xhtml+xml'),
        -- code
        ('.cpp', 'text/x-c++src'),
        ('.go', 'text/x-go'),
        ('.java', 'text/x-java-source'),
        ('.js', 'application/javascript'),
        ('.php', 'application/x-httpd-php'),
        ('.proto', 'application/vnd.google.protobuf'),
        ('.py', 'text/x-python'),
        ('.rb', 'application/x-ruby'),
        ('.rs', 'text/rust'),
        ('.rst', 'text/x-rst'),
        ('.scala', 'text/x-scala'),
        ('.swift', 'text/x-swift'),
        -- json
        ('.json', 'application/json'),
        -- libreoffice
        ('.odp', 'application/vnd.oasis.opendocument.presentation'),
        ('.ods', 'application/vnd.oasis.opendocument.spreadsheet'),
        ('.odt', 'application/vnd.oasis.opendocument.text'),
        -- xml
        ('.xml', 'application/xml'),
        ('.xml', 'text/xml'),
        -- yaml
        ('.yml', 'application/yaml'),
        ('.yaml', 'application/yaml'),
        -- plain
        ('.txt', 'text/plain'),
        -- excel
        ('.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
        -- ms word
        ('.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
        -- ppt
        ('.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'),
        -- outlook
        ('.msg', 'application/vnd.ms-outlook'),
        -- image
        ('.png', 'image/png'),
        ('.jpeg', 'image/jpeg'),
        ('.jpg', 'image/jpg'),
        ('.webp', 'image/webp'),
        -- voice
        ('.mp3', 'audio/mp3'),
        ('.mp3', 'audio/mpeg'),
        ('.m4a', 'audio/m4a'),
        ('.m4a', 'audio/x-m4a'),
        ('.ogg', 'audio/ogg'),
        ('.oga', 'audio/ogg'),
        ('.ogx', 'application/ogg'),
        ('.flac', 'audio/flac');
      
      UPDATE extensions
      SET "values" = jsonb_set(
          "values"::jsonb,
          '{fileTypes}',
          (
              SELECT jsonb_agg(COALESCE(ftm.label, ft))
              FROM jsonb_array_elements_text("values"::jsonb->'fileNameExtensions') AS ft
              LEFT JOIN file_type_mappings ftm ON ft = ftm.value
          )
      )
      WHERE "values"::jsonb ? 'fileNameExtensions';
      
      UPDATE extensions
      SET "values" = "values"::jsonb - 'fileNameExtensions'
      WHERE "values"::jsonb ? 'fileNameExtensions';
      
      ALTER TABLE bucket ADD COLUMN "allowedFileTypes" text[] NULL;
      
      -- Update the allowedFileTypes column in the bucket table
      UPDATE bucket
      SET "allowedFileTypes" = ARRAY(
          SELECT DISTINCT COALESCE(ftm.label, ft) 
          FROM unnest("allowedFileNameExtensions") AS ft
          LEFT JOIN file_type_mappings ftm ON ft = ftm.value
      );
      
      ALTER TABLE bucket DROP COLUMN "allowedFileNameExtensions";
      
      -- Drop the temporary table
      DROP TABLE file_type_mappings;
    `);
  }
}
