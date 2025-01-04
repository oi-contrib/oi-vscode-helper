function openPage(pagename, pagetitle) {
    vscode.postMessage({
        type: "openPage",
        title: pagetitle,
        name: pagename
    });
}