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
exports.yarn = exports.getWorkspace = exports.getPackageJsonFiles = exports.getPackageInfos = void 0;
const execa = __importStar(require("execa"));
const fs = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function getPackageInfos(options, workspaceData = getWorkspace(options.cwd)) {
    const packageVersions = new Map();
    getPackageJsonFiles(options.cwd, workspaceData).forEach((packageJsonFile) => {
        const packageJson = fs.readJsonSync(packageJsonFile);
        const { name, version } = packageJson;
        if (!name) {
            throw new Error(`Workspace package ${packageJsonFile} must have a name!`);
        }
        if (!version) {
            throw new Error(`Workspace package ${name} must have a version!`);
        }
        packageVersions.set(name, packageJson);
    });
    return packageVersions;
}
exports.getPackageInfos = getPackageInfos;
function getPackageJsonFiles(cwd, workspaceData) {
    return Object.entries(workspaceData).map(([_, { location }]) => {
        return path_1.default.join(cwd, location, "package.json");
    });
}
exports.getPackageJsonFiles = getPackageJsonFiles;
function getWorkspace(cwd) {
    const workspaceData = yarn(["--silent", "--json", "workspaces", "info"], {
        cwd,
    });
    return JSON.parse(JSON.parse(workspaceData).data);
}
exports.getWorkspace = getWorkspace;
function yarn(args, options) {
    var _a;
    const result = execa.sync("yarn", args, { ...options, reject: false });
    if (result.failed) {
        throw new Error((_a = result.stderr) === null || _a === void 0 ? void 0 : _a.toString());
    }
    return result.stdout.toString();
}
exports.yarn = yarn;
