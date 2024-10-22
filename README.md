# Xeel GitHub Action

<div style="text-align: center;">
  <strong>
    <a href="https://xeel.dev">Xeel</a>
     | 
    <a href="https://docs.xeel.dev">Documentation</a>
  </strong>
</div>

This is the source code for the [Xeel](https://xeel.dev) report action.

This action wraps the [Xeel CLI](https://github.com/xeel-dev/xeel-cli), and invokes the
`report` command on it when run.

Note that this action will install the _latest_ version of the CLI and install any
specified plugins (or a default set, if none specified) on each run.

## Getting started

In most cases, you will get a complete example workflow, including your organization ID,
when you create a project in the [Xeel Webapp](https://app.xeel.dev).

An example workflow might look like:

```yaml
name: Report to Xeel
on:
  workflow_dispatch:
  schedule:
    - cron: '45 8 * * *'
permissions:
  id-token: write
  contents: read
jobs:
  dependency-debt:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout the repository
        uses: actions/checkout@v4
        with:
          lfs: true
      - name: Install pnpm
        uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: 'pnpm'
      - run: pnpm install
      - uses: xeel-dev/report-action@v1
        with:
          organization: '$XEEL_ORGANIZATION'
          plugins: '@xeel-dev/cli-npm-plugin,@xeel-dev/cli-docker-plugin'
```

## Action Inputs

| Key          | Description                                                                                        | Example                                                  | Required |
| ------------ | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | -------- |
| organization | Your Xeel organization ID. You can get this when selecting the '+' button on the project overview. | `x::org:64jlQszyh97h4u4d0IGc7J`                          | ✅       |
| plugins      | A comma separated list of plugins to install. By default all first party plugins are installed.    | `'@xeel-dev/cli-npm-plugin,@xeel-dev/cli-docker-plugin'` | ❌       |
