const fs = require("fs");
const path = require("path");
const vscode = require("vscode");

async function getExtensionFile(context: any, fileName: string) {
  const filePath = path.join(context.extensionPath, fileName);
  let gitConfigData = {};
  if (fs.existsSync(filePath)) {
    gitConfigData = JSON.parse(fs.readFileSync(filePath, "utf8") || "{}");
  }
  return gitConfigData;
}
async function getInput(name: string, value = "") {
  const inputVal = await vscode.window.showInputBox({
    placeHolder: `请输入${name}`,
    value,
  });
  return inputVal;
}

function stringToObject(inputString: string) {
  const regex = /\[\[([^\]]+)\]\]([\s\S]*?)\[\[\1\]\]/g;
  const result: Record<string, string> = {};
  let match;
  while ((match = regex.exec(inputString))!== null) {
      const key = match[1].trim();
      const value = match[2];
      //去除value开头和结尾的换行符，保留空格
      if(value.startsWith('\n')){
        result[key] = value.slice(1);
      }else{
        result[key] = value;
       }
      if(value.endsWith('\n')){
        result[key] = result[key].slice(0,-1); 
      }
  }
  return result;
}
export { getExtensionFile,getInput,stringToObject };