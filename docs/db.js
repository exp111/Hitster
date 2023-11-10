const fileStoreName = "fileStore";
const fileDBName = "hitster.files";
let fileDbPromise = null;

function openFilesDataBase() {
    if (fileDbPromise) {
        return fileDbPromise;
    }
    fileDbPromise = idb.openDB(fileDBName, 1, {
        upgrade(db, oldVersion) {
            if (oldVersion < 1) {
                const tileStore = db.createObjectStore(fileStoreName, {
                    keyPath: 'key',
                });
            }
        },
    });
    return fileDbPromise;
}
async function openDBTransaction() {
    return (await openFilesDataBase()).transaction(fileStoreName, "readwrite");
}

function createFileDBObj(name, blob) {
    let info = createFileDBInfo(name);
    return {
        blob,
        ...info,
    };
}

function createFileDBInfo(name) {
    info = {
        key: name,
        createdAt: Date.now()
    };
    return info;
}

async function clearDB() {
    return (await openFilesDataBase()).clear(fileStoreName);
}

async function refreshFiles() {
    const db = await openFilesDataBase();
    let files = await db.getAll(fileStoreName);
    GLOBAL.files = files;
    return GLOBAL.files;
}