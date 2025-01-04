function openPage(pagename) {
    vscode.postMessage({
        type: "openPage",
        name: pagename
    });
}