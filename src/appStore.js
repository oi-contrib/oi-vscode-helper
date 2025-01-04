const vscode = require("vscode");
const UtilsWebviewPanelFactory = require("./utils/WebviewPanel");

let currentPanel = undefined;
module.exports = function (context) {
    let UtilsWebviewPanel = UtilsWebviewPanelFactory(context);

    // 如果已经存在，直接切换显示即可
    if (currentPanel) {
        const columnToShowIn = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        currentPanel.reveal(columnToShowIn);
    }

    // 如果不存在，打开
    else {
        currentPanel = UtilsWebviewPanel("welcome", "OI 小助手");

        // 被关闭的时候更新一下记录
        currentPanel.onDidDispose(
            () => {
                currentPanel = undefined;
            },
            null,
            context.subscriptions
        );
    }
};