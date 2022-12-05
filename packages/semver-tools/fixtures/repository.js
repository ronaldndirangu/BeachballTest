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
exports.Repository = exports.RepositoryFactory = void 0;
const fs = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const git_1 = require("../util/git");
const tmpdir_1 = require("./tmpdir");
class RepositoryFactory {
    constructor() {
        this.repositories = [];
    }
    create() {
        const repoPath = (0, tmpdir_1.tmpdir)({ prefix: "midgard-semver-tools-repo-" });
        this.repositories.push(repoPath);
        return new Repository(repoPath);
    }
    cleanUp() {
        this.repositories.forEach((repoPath) => {
            fs.removeSync(repoPath);
        });
    }
}
exports.RepositoryFactory = RepositoryFactory;
class Repository {
    constructor(path) {
        this.repoPath = path;
        (0, git_1.git)(["init"], { cwd: path });
        (0, git_1.git)(["config", "user.email", '"test@test.com"'], { cwd: path });
        (0, git_1.git)(["config", "user.name", '"Test"'], { cwd: path });
    }
    get path() {
        return this.repoPath;
    }
    add(newFilename, content) {
        fs.ensureFileSync(path_1.default.join(this.repoPath, newFilename));
        if (content) {
            fs.writeFileSync(path_1.default.join(this.repoPath, newFilename), content);
        }
        (0, git_1.git)(["add", "-A"], { cwd: this.repoPath });
        (0, git_1.git)(["commit", "-m", "committing changes"], { cwd: this.repoPath });
    }
    tag(tag) {
        (0, git_1.git)(["tag", tag], { cwd: this.repoPath });
    }
}
exports.Repository = Repository;
