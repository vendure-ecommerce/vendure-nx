"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageExecutor = void 0;
var tslib_1 = require("tslib");
var devkit_1 = require("@nrwl/devkit");
var project_graph_1 = require("@nrwl/workspace/src/core/project-graph");
var create_package_json_1 = require("@nrwl/workspace/src/utilities/create-package-json");
var fs = (0, tslib_1.__importStar)(require("fs"));
var path = (0, tslib_1.__importStar)(require("path"));
function packageExecutor(options, context) {
    var _a, _b, _c, _d;
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var projGraph, packageJson, dependencies, _i, _e, _f, pkg, version, omit, _g, _h, pattern, re, rootPackageJson, _j, _k, _l, pkg, version, _m, _o, pattern, re, sourcePackageJsonPath, sourcePackageJson, _p, _q, _r, key, value;
        return (0, tslib_1.__generator)(this, function (_s) {
            projGraph = (0, project_graph_1.readCachedProjectGraph)();
            packageJson = (0, create_package_json_1.createPackageJson)((_a = context.projectName) !== null && _a !== void 0 ? _a : 'project', projGraph, {
                root: context.root,
            });
            if (options.packageName) {
                packageJson.name = options.packageName;
            }
            delete packageJson.devDependencies;
            dependencies = {};
            for (_i = 0, _e = Object.entries(packageJson.dependencies).sort(function (a, b) {
                return a[0] < b[0] ? -1 : 1;
            }); _i < _e.length; _i++) {
                _f = _e[_i], pkg = _f[0], version = _f[1];
                omit = false;
                for (_g = 0, _h = (_b = options.omit) !== null && _b !== void 0 ? _b : []; _g < _h.length; _g++) {
                    pattern = _h[_g];
                    re = new RegExp(pattern);
                    if (re.test(pkg)) {
                        omit = true;
                    }
                }
                if (!omit) {
                    dependencies[pkg] = version;
                }
            }
            if ((_c = options.include) === null || _c === void 0 ? void 0 : _c.length) {
                rootPackageJson = void 0;
                try {
                    rootPackageJson = JSON.parse(fs.readFileSync(path.join(context.root, 'package.json'), 'utf-8'));
                }
                catch (e) {
                    throw e;
                }
                for (_j = 0, _k = Object.entries(rootPackageJson.dependencies); _j < _k.length; _j++) {
                    _l = _k[_j], pkg = _l[0], version = _l[1];
                    for (_m = 0, _o = (_d = options.include) !== null && _d !== void 0 ? _d : []; _m < _o.length; _m++) {
                        pattern = _o[_m];
                        re = new RegExp(pattern);
                        if (re.test(pkg)) {
                            dependencies[pkg] = version;
                        }
                    }
                }
            }
            packageJson.dependencies = dependencies;
            sourcePackageJsonPath = path.join(process.cwd(), 'libs', context.projectName, 'package.json');
            if (fs.existsSync(sourcePackageJsonPath)) {
                sourcePackageJson = (0, devkit_1.readJsonFile)(sourcePackageJsonPath);
                for (_p = 0, _q = Object.entries(sourcePackageJson); _p < _q.length; _p++) {
                    _r = _q[_p], key = _r[0], value = _r[1];
                    if (!['name', 'dependencies'].includes(key)) {
                        packageJson[key] = value;
                    }
                }
            }
            (0, devkit_1.writeJsonFile)(options.outputPath + "/package.json", packageJson);
            return [2 /*return*/, { success: true }];
        });
    });
}
exports.packageExecutor = packageExecutor;
exports.default = packageExecutor;
//# sourceMappingURL=packageImpl.js.map