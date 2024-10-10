import { debug, getInput, info, setFailed } from '@actions/core';
import { exec } from '@actions/exec';
import { appendFile } from 'fs/promises';

export async function run() {
  try {
    const args = {
      auth: 'github',
      repository: '$GITHUB_REPOSITORY',
      organization: getInput('organization', { required: true }),
    };
    await exec('node', ['--version'], {
      listeners: {
        stdout: (data) => {
          const version = data.toString().trim();
          info(`node --version stdout: ${version}`);
          if (!version.startsWith('v20')) {
            info('WHAT THE HECK');
          }
        },
      },
    });
    info('Installing @xeel-dev/cli…');
    await appendFile(
      `${process.env.HOME}/.npmrc`,
      '\n@xeel-dev:registry=https://npm.pkg.github.com\n',
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
