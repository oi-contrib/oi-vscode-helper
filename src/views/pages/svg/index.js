window.addEventListener('message', function (e) {
    if (e && e.data && e.data.type == "svgeditor.content") {
        document.getElementById("view-id").innerHTML = e.data.text;
    }
});