function openPage(pagename, pagetitle) {
    vscode.postMessage({
        type: "openPage",
        title: pagetitle,
        name: pagename
    });
}

document.getElementById("textarea1").value = localStorage.getItem("note-textarea1") || "";
document.getElementById("textarea2").value = localStorage.getItem("note-textarea2") || "";

function saveNoteData(event, id) {
    localStorage.setItem("note-" + id, event.target.value, id);
}