import { debug, getInput, info, setFailed } from '@actions/core';
import { exec } from '@actions/exec';

const DEFAULT_PLUGINS = [
  '@xeel-dev/cli-npm-plugin',
  '@xeel-dev/cli-docker-plugin',
];

export async function run() {
  try {
    const args = {
      auth: 'github',
      repository: process.env.GITHUB_REPOSITORY_ID,
      organization: getInput('organization', { required: true }),
    };
    info('Installing @xeel-dev/cli…');
    await exec('npm install --global @xeel-dev/cli');
    const pluginsInput = getInput('plugins');
    const plugins = [];
    if (pluginsInput) {
      plugins.push(...pluginsInput.split(','));
    } else {
      plugins.push(...DEFAULT_PLUGINS);
    }
    info('Installing Xeel plugins…');
    for (const plugin of plugins) {
      await exec(`npx xeel plugins install ${plugin}`);
    }
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
