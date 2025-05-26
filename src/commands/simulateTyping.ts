import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { getExtensionFile,stringToObject } from '../utils/util';

let timerId:NodeJS.Timeout | null = null;

async function typingCode(code:string,saveFlag:string,printSpeed:number,editor:vscode.TextEditor,position:vscode.Position = editor.selection.active){
    // 逐字输入
    for (let i = 0; i < code.length; i++) {
        // 检测保存标记（需保证剩余字符足够）
        const flagLen = saveFlag.length;
        if(i <= code.length - flagLen && code.slice(i, i + flagLen) === saveFlag){
            i += flagLen - 1;
            await editor.document.save();
            continue; // 不插入标记内容
        }
        const maxLine = editor.document.lineCount - 1;
        // 处理换行符
        if (code[i] === '\n') {
            if(code[i - 1] === '\n'){
                await editor.edit(editBuilder => {
                    editBuilder.insert(position, '\n'); // 在当前位置插入换行符
                });
            }
            // 移动光标到下一行行首
            const newLine = Math.min(position.line + 1, maxLine);
            position = new vscode.Position(newLine, 0);
        
            if(newLine > 20){
                // 计算滚动位置（核心修改点）
                const scrollPosition = new vscode.Range(
                    Math.max(0, newLine - 20),  // 向上滚动一行
                    position.character,
                    newLine,
                    position.character
                );
            
                // 平滑滚动（使用 AtTop 模式）
                editor.revealRange(
                    scrollPosition,
                    vscode.TextEditorRevealType.AtTop
                );
            }
            continue;
        }
        // 检测空格，空格一次性输入
        let spaceCount = 0;
        while (i < code.length && code[i] === ' ') {
            spaceCount++;
            i++; 
        }
        if (spaceCount > 0) {
            const space = ' '.repeat(spaceCount);
            await editor.edit(editBuilder => {
                editBuilder.insert(position, space);
            }); 
            position = position.translate(0, spaceCount); // 更新光标位置
        }
        // 获取当前行信息
        const currentLine = editor.document.lineAt(Math.min(position.line,maxLine));
        
        await editor.edit(editBuilder => {
            // 清空光标右侧内容
            const deleteRange = new vscode.Range(
                position,
                currentLine.range.end
            );
            editBuilder.delete(deleteRange);
            
            // 插入新字符
            editBuilder.insert(position, code[i]);
        });
        // 更新光标位置
        position = position.translate(0, 1);
        // 控制输入速度
        await new Promise(resolve => {
            timerId = setTimeout(resolve, printSpeed);
        });
    }
    await editor.document.save();
}

async function typingCodeByJson(json: { [key: string]: string }, saveFlag: string,printSpeed:number, editor: vscode.TextEditor) {
    for(const key in json){
        const value = json[key];
        await typingCodeByKey(key,value,saveFlag,printSpeed,editor);
    }
}

async function typingCodeByKey(key:string,code:string,saveFlag:string,printSpeed:number,editor:vscode.TextEditor){
   //获取key字符串所在的行数
   const lineNum = editor.document.getText().split('\n').findIndex((line) => line.trim() === key);
   if(lineNum === -1){return;}
    let position = new vscode.Position(lineNum, editor.document.lineAt(lineNum).text.length);
    await editor.edit(editBuilder => {
        editBuilder.insert(position, '\n');
    });
    await typingCode(code,saveFlag,printSpeed,editor,position);
}

function tranCode(code:string){
    const newCode = stringToObject(code);
    if(JSON.stringify(newCode) === '{}'){
        return code;
    }
    return newCode;
}

async function chooseCodeTxt() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {return;}
    const uri = await vscode.window.showOpenDialog({
        canSelectMany: false,
        openLabel: '选择代码文件',
        filters: { '代码文件': ['js', 'ts', 'py', 'java', 'html', 'css','vue','text','txt','json'] }
    });
    if(!uri?.[0]){
        return;
    }

    let code = '';
    const langMap: { [key: string]: string } = {
        js: 'javascript',
        ts: 'typescript',
        py: 'python',
        java: 'java',
        html: 'html',
        css: 'css',
        vue: 'vue',
        text: 'plaintext',
        txt: 'plaintext',
        json: 'json'
        };
    const ext = path.extname(uri[0].fsPath).substring(1);
    const lang = langMap[ext] || ext; // 使用官方语言标识符
    code = fs.readFileSync(uri[0].fsPath, 'utf8');
    // 自动检测语言模式
    await vscode.languages.setTextDocumentLanguage(editor.document, lang);

    if (!code) {return;}
    return code;
}

async function getCodeTxt(context: vscode.ExtensionContext,defaultFile:string) {
    //获取运行插件的目录路径
    const editor = vscode.window.activeTextEditor;
    if (!editor) {return;}
    const uri = editor.document.uri;
    const dirPath = path.dirname(uri.fsPath);
    const defaultPath = path.join(dirPath, defaultFile);
    if (fs.existsSync(defaultPath)) {
        return fs.readFileSync(defaultPath, 'utf8');
    }
    const codeTxt = await chooseCodeTxt();
    return codeTxt;
}

async function stopTyping(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('simulateTypingPlugins.stopTyping', () => {
        if (timerId) {
            clearTimeout(timerId);
            timerId = null; // 重置定时器ID
            vscode.window.showInformationMessage('输入已停止');  
        }
    });
    context.subscriptions.push(disposable);
    return disposable;
}

async function simulateTyping(context: vscode.ExtensionContext) {
    // 注册主命令
    const disposable = vscode.commands.registerCommand('simulateTypingPlugins.simulateTyping', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('请在活动编辑器中打开文件');
            return;
        }
        const config:any = await getExtensionFile(context, 'config.json');
        const saveFlagObj = config.saveFlag ?? {};
        const saveFlag = saveFlagObj.value ?? '@保存@';
        const printSpeedObj = config.printSpeed ?? {};
        const printSpeed = printSpeedObj.value ?? 50;
        const defaultFileObj = config.defaultFile ?? {};
        const defaultFile = defaultFileObj.value ?? '';
        const codeTxt = await getCodeTxt(context,defaultFile) ?? '';
        const json = tranCode(codeTxt);
        if(!json){
            vscode.window.showErrorMessage('文件内容为空');
            return;
        }
        if(typeof json === 'string'){
            await typingCode(json,saveFlag,printSpeed,editor);
            return; 
        }
        await typingCodeByJson(json,saveFlag,printSpeed,editor);
    });

    context.subscriptions.push(disposable);
    return disposable;
}
export { simulateTyping,stopTyping };