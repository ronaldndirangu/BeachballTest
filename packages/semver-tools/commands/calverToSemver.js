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
exports.getSemanticVersions = exports.mapCalverToSemver = void 0;
const fs = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const git_1 = require("../util/git");
const yarn_1 = require("../util/yarn");
function mapCalverToSemver(dateBasedVersion, packagesToInclude, options) {
    // favorite the tag to be able to check it out local
    (0, yarn_1.yarn)(["gitfav", `midgard/versioned/v${dateBasedVersion}`], options);
    console.log(getSemanticVersions(dateBasedVersion, packagesToInclude, options));
}
exports.mapCalverToSemver = mapCalverToSemver;
function getSemanticVersions(dateBasedVersion, packagesToInclude, options) {
    // store the current branch name
    const branchName = (0, git_1.git)(["rev-parse", "--abbrev-ref", "HEAD"], options);
    try {
        // checkout the versioned tag and collect versions
        (0, git_1.git)(["checkout", `midgard/versioned/v${dateBasedVersion}`], options);
        return getVersions(packagesToInclude, options);
    }
    finally {
        // attempt to checkout the original branch regardless of
        // success of the operation
        (0, git_1.git)(["checkout", branchName], options);
    }
}
exports.getSemanticVersions = getSemanticVersions;
function getVersions(packagesToInclude, options) {
    const workspaceData = (0, yarn_1.getWorkspace)(options.cwd);
    const versions = {};
    (0, yarn_1.getPackageJsonFiles)(options.cwd, workspaceData).forEach((packageJsonFile) => {
        const packageJsonFileDir = path_1.default.dirname(packageJsonFile);
        const changelogJsonFile = `${packageJsonFileDir}/CHANGELOG.json`;
        const packageJson = fs.readJsonSync(packageJsonFile);
        const name = packageJson.name;
        if (packagesToInclude.length === 0 || packagesToInclude.includes(name)) {
            versions[name] = packageJson.version;
            if (fs.existsSync(changelogJsonFile)) {
                const changelogJson = fs.readJsonSync(changelogJsonFile);
                const entries = changelogJson["entries"];
                if (Array.isArray(entries) && entries.length) {
                    const lastEntry = entries[0];
                    versions[name] = lastEntry.version;
                }
            }
        }
    });
    return versions;
}
