const getPage = require("../views/index");

function WebviewViewProvider(_extensionUri, _context, _pagename, _callback) {
    this._extensionUri = _extensionUri;
    this._context = _context;
    this._pagename = _pagename;
    this._callback = _callback;
}

WebviewViewProvider.prototype.resolveWebviewView = function (webviewView) {
    webviewView.webview.options = {
        enableScripts: true,
        localResourceRoots: [this._extensionUri]
    };
    webviewView.webview.html = getPage(this._context, webviewView.webview, this._pagename);
    if (this._callback) this._callback(webviewView.webview);
}

module.exports = WebviewViewProvider; 