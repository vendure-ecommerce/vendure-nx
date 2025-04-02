import { ExecutorContext, readJsonFile, writeJsonFile } from '@nx/devkit';
import { createPackageJson } from '@nx/js';
import { readCachedProjectGraph } from '@nx/workspace/src/core/project-graph';
import * as fs from 'fs';
import * as path from 'path';

interface PackageOptions {
    /**
     * @description
     * The name of the final npm package. If not set, defaults to the nx project name.
     */
    packageName?: string;
    outputPath: string;
    /**
     * @description
     * Packages that get automatically detected by Nx's graph traversal might not actually be
     * needed. In which case, you can explictly omit them using regex syntax.
     */
    omit?: string[];
    /**
     * @description
     * If a package _is_ needed but is for some reason not picked up by Nx, you can explicitly
     * include it. The provided regex patterns will be matched against the packages in the root
     * package.json dependencies.
     */
    include?: string[];
}

export async function packageExecutor(options: PackageOptions, context: ExecutorContext) {
    const projGraph = readCachedProjectGraph();
    const packageJson = createPackageJson(context.projectName ?? 'project', projGraph, {
        root: context.root,
    });
    if (options.packageName) {
        packageJson.name = options.packageName;
    }
    delete packageJson.devDependencies;
    const dependencies: { [name: string]: string } = {};
    for (const [pkg, version] of Object.entries(packageJson.dependencies ?? {}).sort((a, b) =>
        a[0] < b[0] ? -1 : 1,
    )) {
        let omit = false;
        for (const pattern of options.omit ?? []) {
            const re = new RegExp(pattern);
            if (re.test(pkg)) {
                omit = true;
            }
        }
        if (!omit) {
            dependencies[pkg] = version as string;
        }
    }

    if (options.include?.length) {
        let rootPackageJson: any;
        try {
            rootPackageJson = JSON.parse(fs.readFileSync(path.join(context.root, 'package.json'), 'utf-8'));
        } catch (e: any) {
            throw e;
        }
        for (const [pkg, version] of Object.entries(rootPackageJson.dependencies)) {
            for (const pattern of options.include ?? []) {
                const re = new RegExp(pattern);
                if (re.test(pkg)) {
                    dependencies[pkg] = version as string;
                }
            }
        }
    }

    packageJson.dependencies = dependencies;

    // Copy any other keys from the source package.json file
    const sourcePackageJsonPath = path.join(process.cwd(), 'libs', context.projectName, 'package.json');
    if (fs.existsSync(sourcePackageJsonPath)) {
        const sourcePackageJson = readJsonFile(sourcePackageJsonPath);
        for (const [key, value] of Object.entries(sourcePackageJson)) {
            if (!['name', 'dependencies'].includes(key)) {
                packageJson[key] = value;
            }
        }
    }

    writeJsonFile(`${options.outputPath}/package.json`, packageJson);
    return { success: true };
}

export default packageExecutor;
