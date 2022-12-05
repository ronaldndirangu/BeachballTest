"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.git = void 0;
const execa_1 = __importDefault(require("execa"));
function git(args, options) {
    var _a;
    const result = execa_1.default.sync("git", args, { ...options, reject: false });
    if (result.failed) {
        throw new Error((_a = result.stderr) === null || _a === void 0 ? void 0 : _a.toString());
    }
    return result.stdout.toString();
}
exports.git = git;
