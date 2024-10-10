import { debug, getInput, info, setFailed } from '@actions/core';
import { exec } from '@actions/exec';

export async function run() {
  try {
    const args = {
      auth: 'github',
      repository: '$GITHUB_REPOSITORY',
      organization: getInput('organization', { required: true }),
    };
    info('Installing @xeel-dev/cli…');
    await exec(
      'echo "@xeel-dev:registry=https://npm.pkg.github.com" >> ~/.npmrc',
    );
    await exec('npm install --global @xeel-dev/cli');
    debug(`Running xeel with args: ${JSON.stringify(args)}`);
    await exec(
      `npx xeel dependency-debt report ${Object.entries(args)
        .map(([key, value]) => `--${key} ${value}`)
        .join(' ')}`,
    );
    info('🚀 Report sent to Xeel!');
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      setFailed('An unknown error occurred');
    }
  }
}
