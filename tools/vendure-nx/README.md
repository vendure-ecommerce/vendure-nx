# vendure-nx
This nx plugin provides a nx generator to create a new Vendure plugin in the `libs` directory.

## Generating a new Vendure plugin
Execute the following command to generate a new Vendure plugin in the `libs` directory:

```bash
nx g vendure-nx:vendure-plugin-generator --name=Example --uiExtension=true
```
### Generator Options
The generator accepts the following options:

| Name          | Description                                                                               | Default      |
|---------------|-------------------------------------------------------------------------------------------|--------------|
| `name`        | The name of the plugin to be created. The suffix `Plugin` will be automatically appended. | -            |
| `uiExtension` | Whether to create a Vendure UI extension.                                                 | false        |
| `e2e`           | Whether to create an e2e test for the plugin.                                             | true        |
| `scope`       | The prefix the plugin should be registered with in the `tsconfig.base.json` file          | `@vendure-nx` |

### Example Output
The example command will generate the following files:

```diff
CREATE libs/plugin-example/project.json
CREATE libs/plugin-example/.babelrc
CREATE libs/plugin-example/.eslintrc.json
CREATE libs/plugin-example/README.md
CREATE libs/plugin-example/src/e2e/graphql/admin-e2e-definitions.graphql.ts
CREATE libs/plugin-example/src/e2e/graphql/shop-e2e-definitions.graphql.ts
CREATE libs/plugin-example/src/e2e/__data__/.gitkeep
CREATE libs/plugin-example/src/e2e/example.plugin.e2e-spec.ts
CREATE libs/plugin-example/src/index.ts
CREATE libs/plugin-example/src/lib/constants.ts
CREATE libs/plugin-example/src/lib/types.ts
CREATE libs/plugin-example/src/lib/example.plugin.ts
CREATE libs/plugin-example/src/ui/components/.gitkeep
CREATE libs/plugin-example/src/ui/index.ts
CREATE libs/plugin-example/src/ui/providers.ts
CREATE libs/plugin-example/src/ui/routes.ts
CREATE libs/plugin-example/src/ui/example-ui.scss
CREATE libs/plugin-example/tsconfig.json
CREATE libs/plugin-example/tsconfig.lib.json
CREATE libs/plugin-example/tsconfig.spec.json
CREATE libs/plugin-example/vite.config.ts
UPDATE tsconfig.base.json
```

The generator will update the paths in the `tsconfig.base.json` file to include the new plugin. Since
the scope is configured to be `@vendure-nx` as default, the result will look like this:

```JSON
{
  //...
  "compilerOptions": {
    //...
    "paths": {
      "@vendure-nx/plugin-example": ["libs/plugin-example/src/index.ts"],
    }
  }
}
```

## Change the default scope
If you want to build your own mono repository you might use a different scope than `@vendure-nx`.
You can change the default scope by going to the `tools/vendure-nx/generators/vendure-plugin-generator/schema.json` file and changing the `default` value `scope` property to your desired scope.

