const vscode = require("vscode");
const getPage = require("../views/index");

function CustomSVGEditorProvider(context) {
    this.context = context;
}

CustomSVGEditorProvider.viewType = "oi-vscode-helper.svgeditor";

CustomSVGEditorProvider.register = function (context) {
    let provider = new CustomSVGEditorProvider(context);
    let providerRegistration = vscode.window.registerCustomEditorProvider(CustomSVGEditorProvider.viewType, provider, {
        webviewOptions: {
            retainContextWhenHidden: true
        },
        // supportsMultipleEditorsPerDocument: false // 默认情况下，VS Code 只允许每个自定义文档有一个编辑器，如果想要多个需要开启
    });
    return providerRegistration;
};

// 打开文件的时候执行
CustomSVGEditorProvider.prototype.resolveCustomTextEditor = function (document, webviewPanel, _token) {

    webviewPanel.webview.options = {
        enableScripts: true
    };
    webviewPanel.webview.html = getPage(this.context, webviewPanel.webview, "svg");

    function updateWebview() {
        webviewPanel.webview.postMessage({
            type: 'svgeditor.content',
            text: document.getText(),
        });
    }

    let changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
        if (e.document.uri.toString() === document.uri.toString()) {
            updateWebview();
        }
    });

    webviewPanel.onDidDispose(() => {
        changeDocumentSubscription.dispose();
    });

    updateWebview();
};

module.exports = CustomSVGEditorProvider; 