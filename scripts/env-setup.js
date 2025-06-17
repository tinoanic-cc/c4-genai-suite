import dotenv from 'dotenv';
import fs from 'fs-extra';
import md5 from 'md5';
import path from 'path';
import prompts from 'prompts';
import url from 'url';

// If this flag is set, only non-existent files will be created
// and all changes on .env files will only be suggestions.
const showStatus = process.argv.includes('--noOverwrites');

// Values for collecting summery information
let recommendFix = false;
const customValues = [];

const killablePrompts = async (
  questions,
  killMsg = '>>> Killing Process ...'
) => {
  const answers = await prompts(questions);
  if (Object.keys(answers).length < questions.length) {
    console.log(killMsg);
    process.exit(0);
  }
  return answers;
};

async function updateEnvFiles() {
  const rootDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url))).replace('/scripts', '');
  const exampleFiles = await findFiles(rootDir, '.env.example');

  if (!showStatus) {
    console.log(
      `All .env.example files are scanned for values to copy into your local .env files:'
  - If you have a variable value only locally, the conflict is ignored
  - Leave values empty, if you don't have them available at the moment
  - Rerun this script to update variables or fill in empty variables
`
    );
  }

  for (const exampleFile of exampleFiles) {
    const envFile = exampleFile.replace('.env.example', '.env');
    const relativePath = envFile.replace(rootDir, '.');

    if (!fs.existsSync(envFile)) {
      await fs.copy(exampleFile, envFile);
      console.log(
        `Created ${envFile.replace(rootDir, '.')} from ${exampleFile.replace(rootDir, '.')}`
      );
    }

    const exampleConfig = dotenv.parse(await fs.readFile(exampleFile, 'utf8'));
    const envConfig = dotenv.parse(await fs.readFile(envFile, 'utf8'));

    const questions = [];

    for (const key in exampleConfig) {
      if (exampleConfig[key] === '') {
        customValues.push(`"${key}" (${relativePath})`);
      }
      if (!exampleConfig[key] && !envConfig[key]) {
        if (showStatus) {
          console.log(`Your .env is missing the value: ${key}`);
        }
        questions.push({
          type: 'text',
          name: key,
          message: `Enter value for ${key} (${relativePath}) [press Enter to ignore]:`,
        });
      } else if (
        envConfig[key] !== exampleConfig[key] &&
        exampleConfig[key] !== ''
      ) {
        const choices = [];
        if (envConfig[key] !== undefined) {
          choices.push({
            title: `Use current value "${envConfig[key]}" from ${relativePath}`,
            value: envConfig[key],
          });
        }
        choices.push({
          title: `Use example value "${exampleConfig[key]}" from ${relativePath}`,
          value: exampleConfig[key],
        });
        if (showStatus) {
          const toState = (title) =>
            title.includes('example')
              ? 'example suggestion'
              : 'your current value';
          console.log(` - "${key}" (${relativePath}):`);
          console.log(
            choices
              .map(({ title, value }) => ({ status: toState(title), value }))
              .map(({ status, value }) => `     "${value}"  <== ${status}`)
              .join('\n')
          );
        }
        questions.push({
          type: 'select',
          name: key,
          message: `Value for ${key} (${relativePath}):`,
          choices,
        });
      }
    }

    if (questions.length > 0) {
      if (showStatus) {
        recommendFix = true;
      } else {
        const answers = await killablePrompts(
          questions,
          `>>> Killing Process: "${relativePath}" will not be changed.`
        );
        Object.assign(envConfig, answers);
      }

      const updatedEnvContent = Object.keys(envConfig)
        .map((key) => `${key}=${envConfig[key]}`)
        .join('\n');

      const newFileHash = md5(updatedEnvContent);
      const backupHash = md5(fs.readFileSync(envFile).toString());

      if (newFileHash !== backupHash) {
        const backupFileName = `${envFile}.bak.${backupHash}`;
        await fs.copy(envFile, backupFileName);
        console.log(`Backup created: ${backupFileName.replace(rootDir, '.')}`);

        await fs.writeFile(envFile, updatedEnvContent);
      }
    }
  }
  console.log();
  console.log(` Notice the following values cannot be updated automatically:`)
  console.log(customValues.map((v) => ` - ${v}`).join('\n'));
  if (showStatus) {
    console.log();
    if (recommendFix) {
      console.log(`run "npm run env:fix" to pick your changes`);
    } else {
      console.log(
        `All .env files seem up to date.`
      );
    }
  }
}

async function findFiles(dir, fileName) {
  let results = [];
  const list = await fs.readdir(dir);

  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(await findFiles(filePath, fileName));
    } else if (file === fileName) {
      results.push(filePath);
    }
  }
  return results;
}

updateEnvFiles().catch((err) => {
  console.error('Error updating .env files:', err);
});
