# Vendure Nx Starter

This is an example of how you can build and deploy a [Vendure](https://www.vendure.io) application using [Nx](https://nx.dev).

## Status

Currently, this is a bare-bones example based on a successful setup I have been using on one of my own projects. Here are some missing parts that could be filled in to make the example more complete:

- [x] Code generation with [graphql-code-generator](https://github.com/dotansimha/graphql-code-generator)
- [x] An example plugin with ui extensions and e2e testing setup
- [x] A custom generator for scaffolding new plugins

**Contributions are very welcome!**

## Repo Guide

This repo was generated as a standard [Nx Integrated Repo](https://nx.dev/getting-started/integrated-repo-tutorial). Therefore, most of the files and directories come from the Nx conventions:

- **apps**
  - **admin-ui**: Used to build the customized version of the Vendure Admin UI. It is very common for plugins to extend the admin ui, making it necessary to build this custom version of the app.
  - **server**: The Vendure server
  - **worker**: The Vendure worker
  - **storefront**: Here's where you'd add your storefront app
- **libs**
  - **util-config**: The VendureConfig which is shared by the server & worker.
  - **util-testing**: Utils used for the e2e tests
  - **plugin-foo etc.**: When you create new Vendure plugins, create them as Nx libs and them import them into the VendureConfig in the `util-config` package.
- **static**: Static assets needed by the server or worker, e.g. email template files.
- **tools**: Custom Nx executors & generators.

## Development

This repo is set up to use Postgres as the DB, Redis to power the job queue, and optionally MinIO to serve assets. If MinIO is not used, assets will be stored on the local file system.

1. Clone this repo
2. Copy `.env.example` to `.env`, and set the connection details for Postgres, Redis and (optionally) MinIO.
3. `yarn install`
4. `yarn dev:server`

Why yarn? I ran into an issue when using the latest version of npm, where the dependencies were not flattened in a way that broke the admin ui compilation. I _think_ this can be mitigated with the `--legacy-peer-deps` flag, if you prefer to use npm.

## Migrations

When you make [changes that require a DB migration](https://www.vendure.io/docs/developer-guide/migrations/), you should run:

```
yarn nx run server:migration <migration name>
```

This will generate a new migration file in the [./apps/server/migrations](./apps/server/migrations) directory. Next time you run the server, this migration will be executed and will update your DB schema. Make sure to check the contents of the migration file before running the server, just to ensure that all looks correct.

These migration files should then be committed to source control so that they will get run in production when you deploy.

## Deployment

This repo is designed to be deployed as Docker images:

- [Server Dockerfile](./apps/server/Dockerfile)
- [Worker Dockerfile](./apps/worker/Dockerfile)

So it should be sufficient to configure your hosting platform to clone the repo, and then run the provided Dockerfiles to create ready-to-run images of the Vendure server & worker.

### Build internals

When you run the `build` command, we use a custom Nx executor named "package" which you can find in [/tools/executors/package](./tools/executors/package). This executor will create a new `package.json` file for the server/worker which _only_ contain the run-time dependencies that they need, rather than the entire contents of the root `package.json`.

## Generating a new Vendure plugin
Execute the following command to generate a new Vendure plugin in the `libs` directory:

```bash
nx g vendure-nx:vendure-plugin-generator --name=Example --uiExtension=true
```
Read more about the `vendure-plugin-generator` in a dedicated readme file:  [tools/vendure-nx/README.md](tools/vendure-nx/README.md)
