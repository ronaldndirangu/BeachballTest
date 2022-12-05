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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreVersions = void 0;
const fs = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const yarn_1 = require("../util/yarn");
function restoreVersions(options) {
    const workspaceData = (0, yarn_1.getWorkspace)(options.cwd);
    (0, yarn_1.getPackageJsonFiles)(options.cwd, workspaceData).forEach((packageJsonFile) => {
        const packageJsonFileDir = path_1.default.dirname(packageJsonFile);
        const changelogJsonFile = `${packageJsonFileDir}/changelog.json`;
        if (fs.existsSync(changelogJsonFile)) {
            const packageJson = fs.readJsonSync(packageJsonFile);
            const changelogJson = fs.readJsonSync(changelogJsonFile);
            const entries = changelogJson["entries"];
            if (Array.isArray(entries) && entries.length) {
                const lastEntry = entries[0];
                const oldVersion = packageJson.version;
                const newVersion = lastEntry.version;
                options.verbose &&
                    console.log(`Restoring version of ${packageJson.name}: v${oldVersion} -> ${newVersion}`);
                if (options.persist) {
                    packageJson.version = newVersion;
                    fs.writeJSONSync(packageJsonFile, packageJson, { spaces: 2 });
                }
            }
        }
        else {
            options.verbose && console.log(`Skipping ${packageJsonFileDir}`);
        }
    });
}
exports.restoreVersions = restoreVersions;
