const vscode = require("vscode");
const { fullPathSync, simpleScss } = require("oipage");
const { readFileSync } = require("fs");
const pkg = require("../../package.json");

let getCodeFactory = function (pagename) {
    return function (dotName) {
        return readFileSync(fullPathSync("./pages/" + pagename + "/index." + dotName, __dirname), 'utf8');
    };
};

let normalizeCode = readFileSync(fullPathSync("./libs/normalize.css", __dirname), 'utf8');
let commonCode = simpleScss(readFileSync(fullPathSync("./common.scss", __dirname), 'utf8'));
let visliteCode = readFileSync(fullPathSync("./libs/vislite.js", __dirname), 'utf8');
module.exports = function (context, webview, pagename) {
    let getCode = getCodeFactory(pagename);
    const imagesPath = vscode.Uri.joinPath(context.extensionUri, 'images');

    const templateCode = getCode("html");
    const styleCode = simpleScss(getCode("scss"));
    const scriptCode = getCode("js");

    // 拼接页面
    let template = `<!DOCTYPE html>
<html lang="zh-cn">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OI 助手 / ${pagename}</title>
    <style>${normalizeCode}</style>
    <style>${commonCode}</style>
    <style>${styleCode}</style>
    <script>${visliteCode}</script>
</head>

<body>
    ${templateCode}
    <script>
        var vscode = acquireVsCodeApi();
        ${scriptCode}
    </script>
</body>

</html>`;

    // 校对
    template = template
        .replaceAll("${images}", webview.asWebviewUri(imagesPath)) // 图片路径
        .replaceAll("${version}", pkg.version); // 版本

    return template;
};