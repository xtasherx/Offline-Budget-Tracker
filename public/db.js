let db;
const request = indexedDB.open("budget",1);
const saveTrans = (item) => {
    // create a transaction on the pending db with readwrite access
    const trans = db.transaction(["pendTrans"], "readwrite");
  
    // access your pending object store
    const store = trans.objectStore("pendTrans");
  
    // add to store
    store.add(item);
  }


request.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore("pendTrans", { autoIncrement: ture});
};

request.onsuccess = (e) => {
    db = e.target.result;
    if(navigator.online){
        checkDb();
    }
};

request.onerror = (e) => {
    console.log(e.target.errorCode);
};