const vscode = require("vscode");
const openAppStore = require("./appStore");
const UtilsWebviewViewProvider = require("./utils/WebviewViewProvider");
const handler = require("./handler");
const fs = require('fs');
const path = require('path');

// 文件编辑器
const CustomSVGEditorProvider = require("./editor/CustomSVGEditorProvider");

// 插件激活
function activate(context) {

	// 打开入口页面
	context.subscriptions.push(vscode.window.registerWebviewViewProvider("oi-vscode-helper.entry", new UtilsWebviewViewProvider(context.extensionUri, context, "entry", function (webview) {

		webview.onDidReceiveMessage(function (data) {
			if (data.type == "openPage" && data.name == "welcome") {
				openAppStore(context);
			} else {
				handler(context, webview, data);
			}
		});

	}), {}));

	// 打开列表页面
	context.subscriptions.push(vscode.commands.registerCommand("oi-vscode-helper.appStore", () => { openAppStore(context); }));

	// 注册自定义文件编辑器
	context.subscriptions.push(CustomSVGEditorProvider.register(context)); // svg

	// 代码片段
	let codeSnippet_sourcePath = path.join(__dirname, "./codeSnippet");
	let codeSnippet_commands = JSON.parse(fs.readFileSync(path.join(__dirname, "../scripts/codeSnippet/commands.json")));
	for (let item of codeSnippet_commands) {
		context.subscriptions.push(vscode.commands.registerCommand("oi-vscode-helper.codeSnippet." + item[0], () => {
			let editor = vscode.window.activeTextEditor;
			if (editor !== undefined) {

				const cursorPosition = editor.selection.active;

				editor.edit((editBuilder) => {
					editBuilder.insert(cursorPosition, fs.readFileSync(path.join(codeSnippet_sourcePath, item[0].replace(/\./g, "/"), item[1])) + "");
				});

			}
		}));
	}
}

// 插件销毁
function deactivate() {

}

module.exports = {
	activate,
	deactivate
};
