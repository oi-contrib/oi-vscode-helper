const vscode = require("vscode");
const getPage = require("../views/index");
const handler = require("../handler");

function WebviewPanelFactory(context) {
    return function UtilWebviewPanel(pagename, pagetitle) {

        let panel = vscode.window.createWebviewPanel(
            "oi-helper/" + pagename,
            pagetitle,
            vscode.ViewColumn.One,
            {
                "enableScripts": true,
                "retainContextWhenHidden": true // 避免隐藏的时候被重置
            }
        );

        // 设置 webview 内容
        panel.webview.html = getPage(context, panel.webview, pagename);

        // 监听来自 H5 页面的消息
        panel.webview.onDidReceiveMessage(function (data) {

            // 打开新页面
            if (data && data.type == 'openPage') {
                UtilWebviewPanel(data.name, data.title);
            }

            // 其它
            else {
                handler(context, panel.webview, data);
            }
        });

        return panel;
    };
};

module.exports = WebviewPanelFactory;