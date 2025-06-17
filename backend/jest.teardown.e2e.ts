import process from 'node:process';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';

const teardown = async () => {
  if (process?.env.CI) {
    console.log('no tearing down');
  } else {
    console.log('tearing down testcontainers');
    // @ts-expect-error setting global to use it in the teardown function
    await (globalThis.dbClient as Client)?.end();
    // @ts-expect-error setting global to use it in the teardown function
    await (globalThis.dbContainer as StartedPostgreSqlContainer)?.stop();
  }
};

export default teardown;
