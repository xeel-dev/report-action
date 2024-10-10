import { debug, getInput, info, setFailed } from '@actions/core';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function run() {
  try {
    const args = {
      auth: 'github',
      repository: '$GITHUB_REPOSITORY',
      organization: getInput('organization', { required: true }),
    };
    info('Installing @xeel-dev/cli…');
    await execAsync(
      'echo "@xeel-dev:registry=https://npm.pkg.github.com" >> .npmrc',
    );
    await execAsync('npm install --global @xeel-dev/cli');
    debug(`Running xeel with args: ${JSON.stringify(args)}`);
    const { stdout } = await execAsync(
      `npx xeel dependency-debt report ${Object.entries(args)
        .map(([key, value]) => `--${key} ${value}`)
        .join(' ')}`,
    );

    info(stdout);
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      setFailed('An unknown error occurred');
    }
  }
}
