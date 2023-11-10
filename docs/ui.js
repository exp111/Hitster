async function loadFiles() {
    var files = GLOBAL.files;
    var select = document.getElementById("files");
    select.innerHTML = "";
    for (let i in files) {
        let val = files[i];
        //console.debug(val);
        select.append(new Option(val.key,val.key));
    }
}