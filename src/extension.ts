import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    // 注册主命令
    let disposable = vscode.commands.registerCommand('extension.simulateTyping', async (e) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('请在活动编辑器中打开文件');
            return;
        }

        // 选择输入源
        const sourceType = await vscode.window.showQuickPick(
            ['手动输入', '选择文件'],
            { placeHolder: '选择代码来源' }
        );

        let code = '';
        if (sourceType === '手动输入') {
            code = await vscode.window.showInputBox({
                prompt: '输入要模拟的代码',
                placeHolder: '例如：console.log("Hello World!");'
            }) || '';
        } else if (sourceType === '选择文件') {
            const uri = await vscode.window.showOpenDialog({
                canSelectMany: false,
                openLabel: '选择代码文件',
                filters: { '代码文件': ['js', 'ts', 'py', 'java', 'html', 'css','vue'] }
            });
            if (uri && uri[0]) {
                const langMap: { [key: string]: string } = {
                    js: 'javascript',
                    ts: 'typescript',
                    py: 'python',
                    java: 'java',
                    html: 'html',
                    css: 'css',
                    vue: 'vue'
                  };
                  const ext = path.extname(uri[0].fsPath).substring(1);
                  const lang = langMap[ext] || ext; // 使用官方语言标识符
                code = fs.readFileSync(uri[0].fsPath, 'utf8');
                // 自动检测语言模式
                await vscode.languages.setTextDocumentLanguage(editor.document, lang);
            }
        }

        if (!code) return;

        // 获取初始光标位置
        let position = editor.selection.active;
        
        // 开始逐字输入
        for (let i = 0; i < code.length; i++) {
            // 检测 "@保存@" 标记（需保证剩余字符足够）
            if (i <= code.length - 4 && 
                code[i] === '@' && 
                code[i+1] === '保' && 
                code[i+2] === '存' && 
                code[i+3] === '@') {
                i += 4;
                await editor.document.save();
                continue; // 不插入标记内容
            }
            const maxLine = editor.document.lineCount - 1;
            // 处理换行符
            if (code[i] === '\n') {
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
			// 获取当前行信息
			const currentLine = editor.document.lineAt(Math.min(position.line + 1,maxLine));
			
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
            await new Promise(resolve => 
                setTimeout(resolve, vscode.workspace.getConfiguration().get('simulateTyping.speed') || 50));
        }
        await editor.document.save();
    });

    context.subscriptions.push(disposable);
}