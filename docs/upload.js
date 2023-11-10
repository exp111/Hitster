function askForFile(callback, accept) {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = callback;
    input.accept = accept;
    input.click();
}

function handleZipFile(event) {
    console.debug("Got Zip File");
    let files = event.target.files;
    let promises = [];
    let start = new Date();
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        console.debug(`Loading Zip ${file.name}`);
        promises.push(loadFromZip(file));
    }

    Promise.all(promises).then(() => {
        // info at the end of load
        let txt = `Loaded Zip in ${(new Date() - start) / 1000} seconds. Refreshing site.`;
        console.log(txt);
        /*alert(txt);
        if (!Global.DEBUG.enabled)
            window.location.reload();*/
    });
}

let start = new Date();

function setProgressBar(text, val) {
    console.debug(`${text} (${(new Date() - start) / 1000} seconds)`);
    let progress = document.getElementById("load-progress");
    //let loadText = document.getElementById("load-text");
    //loadText.textContent = text;
    progress.value = val;
    //TODO: set text
}

async function loadFromZip(f) {
    //TODO: JSZip doesn't support windows style paths (\\)
    //TODO: warn user cause deleting
    start = new Date();
    setProgressBar("Opening file...", 0);
    return JSZip.loadAsync(f)
        .then(async (zip) => {
            console.debug(zip);
            promises = [];
            files = [];

            // Load map
            setProgressBar("Loading files...", 10);
            clearDB();

            function fileRead(path, entry) {
                if (entry.dir)
                    return;

                if (!entry.name.endsWith(".mp3"))
                    return;

                let name = entry.name.replace(/\.[^/.]+$/, "");

                let promise = entry.async("blob").then(blob => {
                    files.push(createFileDBObj(name, blob));
                });
                promises.push(promise);
            }
            zip.forEach(fileRead);

            await Promise.all(promises);
            // save files in one transaction
            setProgressBar("Saving files to db...", 60);
            let tx = await openDBTransaction();
            let store = tx.store;
            files.forEach((f) => {
                store.put(f);
            });
            tx.commit();
            setProgressBar(`Waiting for transaction...`, 70);
            await tx.done;
            setProgressBar(`Done.`, 100);
        });
}