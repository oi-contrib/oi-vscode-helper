const vscode = require("vscode");
const openAppStore = require("./appStore");
const UtilsWebviewViewProvider = require("./utils/WebviewViewProvider");
const handler = require("./handler");

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
}

// 插件销毁
function deactivate() {

}

module.exports = {
	activate,
	deactivate
};
