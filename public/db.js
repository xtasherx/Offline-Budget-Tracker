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

  function checkDb() {
    const transaction = db.transaction(["pendTrans"], "readwrite");
    const store = transaction.objectStore("pendTrans");
    // save current db data to grabDb variable
    const grabDb = store.getAll();
  
    grabDb.onsuccess = () => {
      if (grabDb.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(grabDb.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
        .then(response => response.json())
        .then(() => {
       
          const transaction = db.transaction(["pendTrans"], "readwrite");        
          const store = transaction.objectStore("pendTrans");
          store.clear();
        });
      }
    };
  }


request.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore("pendTrans", { autoIncrement: true});
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

window.addEventListener("online", checkDb);