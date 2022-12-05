// @ts-check
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
const yargs = __importStar(require("yargs"));
const replaceStars_1 = require("./commands/replaceStars");
const restoreVersions_1 = require("./commands/restoreVersions");
const helpString = "\n\
Manage package versions:\n\
- Restore package versions from changelog.json files";
yargs
    .strict()
    .demandCommand()
    .usage(helpString)
    .help()
    .alias("help", "h")
    .version(false)
    .command("restore", "Restore versions from changelog.json files", function (yargs) {
    yargs
        .option("verbose", {
        describe: "Enables logging.",
        default: false,
        alias: "v",
    })
        .option("dry-run", {
        describe: "If set, the changes won't be persisted to the disk.",
        default: false,
        alias: "d",
    });
}, (args) => (0, restoreVersions_1.restoreVersions)({
    ...args,
    cwd: process.cwd(),
    persist: !args["dry-run"],
}))
    .command("replace-stars", "Replace * dependencies with an actual version.", function (yargs) {
    yargs
        .option("dry-run", {
        describe: "If set, the changes won't be persisted to the disk.",
        type: "boolean",
        default: false,
        alias: "d",
    })
        .option("exact", {
        describe: 'Sets dependencies as exact versions. The default is to use the caret range (e.g. "^1.2.3".), ' +
            'which will resolve to the latest version with the same major version (e.g. "1.9.7"), but ' +
            'with "exact" it would only use version "1.2.3"',
        type: "boolean",
        default: false,
        alias: "e",
    })
        .option("verbose", {
        describe: "Enables logging.",
        default: false,
        type: "boolean",
        alias: "v",
    });
}, (args) => (0, replaceStars_1.replaceStars)({
    verbose: args.verbose,
    exact: args.exact,
    cwd: process.cwd(),
    persist: !args["dry-run"],
}))
    .example("restore --dry-run --verbose", "Restore package versions from changelog.json files")
    .example("replace-stars --dry-run --verbose", "Packages with '*' dependencies will receive an actual version.").argv;
