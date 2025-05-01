"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
async function getExtensionFile(context, fileName) {
    const filePath = path.join(context.extensionPath, fileName);
    let gitConfigData = {};
    if (fs.existsSync(filePath)) {
        gitConfigData = JSON.parse(fs.readFileSync(filePath, "utf8") || "{}");
    }
    return gitConfigData;
}
module.exports = { getExtensionFile };
//# sourceMappingURL=util.js.map