function searchNetwork() {
    vscode.postMessage({
        type: "network"
    });
}

window.addEventListener('message', function (e) {
    if (e.data.type == "network") {
        document.getElementById("pre-id").innerText = JSON.stringify(e.data.value, null, 4);
    }
});