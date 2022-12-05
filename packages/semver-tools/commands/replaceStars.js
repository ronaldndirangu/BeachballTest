"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceStars = void 0;
const fs = __importStar(require("fs-extra"));
const yarn_1 = require("../util/yarn");
function replaceStars(options) {
    const workspaceData = (0, yarn_1.getWorkspace)(options.cwd);
    const packageInfos = (0, yarn_1.getPackageInfos)(options, workspaceData);
    (0, yarn_1.getPackageJsonFiles)(options.cwd, workspaceData).forEach((packageJsonFile) => {
        options.verbose && console.log(`Processing ${packageJsonFile}`);
        const packageJson = fs.readJsonSync(packageJsonFile);
        const packageName = packageJson.name;
        const workspaceDependencies = new Set([
            ...workspaceData[packageName].workspaceDependencies,
            ...workspaceData[packageName].mismatchedWorkspaceDependencies,
        ]);
        ["dependencies", "devDependencies"].forEach((depType) => {
            if (packageJson[depType]) {
                const dependencies = packageJson[depType];
                packageJson[depType] = replacePackageVersions(packageInfos, workspaceDependencies, dependencies, options);
            }
        });
        if (options.persist) {
            fs.writeJSONSync(packageJsonFile, packageJson, { spaces: 2 });
        }
    });
    if (options.verbose) {
        console.log("");
        if (options.persist) {
            console.log("Dependencies updated");
        }
        else {
            console.log("Dry-run, no packages updated");
        }
    }
}
exports.replaceStars = replaceStars;
function replacePackageVersions(workspacePackageInfos, workspaceDependencies, dependencies, options) {
    const updatedDependencies = {};
    return Object.entries(dependencies)
        .map(([name, version]) => {
        const packageInfo = workspacePackageInfos.get(name);
        const dependency = {};
        dependency[name] = version;
        if (packageInfo && workspaceDependencies.has(name)) {
            const newVersion = `${options.exact ? "" : "^"}${packageInfo.version}`;
            if (version !== "*") {
                options.verbose &&
                    console.log(`  skipping a pinned dependency: ${name}:${version}`);
            }
            else if (version !== newVersion) {
                options.verbose &&
                    console.log(`  ${name}: ${version} -> ${newVersion}`);
                dependency[name] = newVersion;
            }
            else {
                options.verbose && console.log(`  ${name}: no change`);
            }
        }
        return dependency;
    })
        .reduce((acc, val) => {
        return { ...acc, ...val };
    }, updatedDependencies);
}
