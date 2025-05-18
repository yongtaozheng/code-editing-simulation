import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import {simulateTyping,stopTyping} from './commands/simulateTyping';
import {editConfig} from './commands/editConfig';

export function activate(context: vscode.ExtensionContext) {
    simulateTyping(context);
    stopTyping(context);
    editConfig(context);
}