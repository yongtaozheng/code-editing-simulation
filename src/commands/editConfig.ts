import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { getExtensionFile,getInput } from '../utils/util';

interface ConfigItem {
    key: string;
    inputTip: string;
    value: string;
}

interface DynamicObject {
    [key: string]: ConfigItem; 
}

export async function editConfig(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('simulateTypingPlugins.editConfig', async () => {
        const config:DynamicObject = await getExtensionFile(context, 'config.json');
        const configValues = Object.values(config);
        const configKeys = configValues.map((item:any) => item.inputTip);
        const selectedKey = await vscode.window.showQuickPick(configKeys);
        if (!selectedKey) {return;}
        const selectedIndex = configValues.findIndex((item:any) => item.inputTip === selectedKey) || 0;
        const selectedValue = configValues[selectedIndex].value + '';
        const newValue = await getInput(selectedKey, selectedValue);
        if (!newValue) {return;}
        configValues[selectedIndex].value = newValue;
        const configEntries = configValues.reduce((acc, item) => {
            acc[item.key] = item;
            return acc;
        }, {} as DynamicObject);
        
        Object.assign(config, configEntries);
        const configPath = path.join(context.extensionPath, 'config.json');
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        vscode.window.showInformationMessage(`配置项 ${selectedKey} 已更新为 ${newValue}`);
    });
    context.subscriptions.push(disposable);
    return disposable;
}