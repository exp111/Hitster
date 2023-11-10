function getFile(file) {
    for (let i in GLOBAL.files) {
        let val = GLOBAL.files[i];
        if (val.key == file)
            return val;
    }
    return null;
}

function loadFile(fileName) {
    let file = getFile(fileName);
    if (file == null)
        return false;
    let url = window.URL.createObjectURL(file.blob);
    GLOBAL.player.src = url;
    return true;
}

function load() {
    var select = document.getElementById("files");
    var current = select.options[select.selectedIndex].value;
    console.debug(`Loading ${current}`);
    if (!loadFile(current))
        alert(`File ${current} not found.`);
}

function play() {
    GLOBAL.player.play();
}

function stop() {
    GLOBAL.player.pause();
}