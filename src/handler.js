const { network } = require("oipage");

module.exports = function (context, webview, data) {

    // 查询网络
    if (data.type == "network") {
        webview.postMessage({
            type: "network",
            value: network()
        });
    }

    // 其他
    else {
        vscode.window.showInformationMessage("[entry]未定义的任务");
    }
};