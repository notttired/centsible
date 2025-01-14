// consider asynchronous functions and timing
// ensure data typing is correct AS YOU CODE

function set(key, value) {
  localStorage.setItem(`${key}`, JSON.stringify(value));
}

export function store(newReceipt, type) {
  let transfers = JSON.parse(localStorage.getItem(`${type}`) || `[]`);
  if (!transfers) {
    localStorage.setItem(`${type}`, JSON.stringify([newReceipt]));
  } else {
    transfers.push(newReceipt);
    localStorage.setItem(`${type}`, JSON.stringify(transfers));
  }
}

export function getTransfers(type) {
  const transfers = JSON.parse(localStorage.getItem(`${type}`));
  return transfers; // returns array of makeTransfers
}

export function sortTransfers(type, fieldType) {
  function sorter(a, b) {
    return String(a[fieldType]).localeCompare(String(b[fieldType])); // syntax and issues
  }
  let transfers = JSON.parse(localStorage.getItem(`${type}`));
  if (transfers) {
    transfers.sort(sorter);
    localStorage.setItem(`${type}`, JSON.stringify(transfers));
  }
}

export async function retrieveData(userID, token) {
  console.log("retrieving");
  async function getFolders() {
    const out = await fetch("/db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        type: "getFolders",
        params: {
          userID: userID,
        },
      }),
    });
    console.log(`out: ${JSON.stringify(out)}`);
    const response = await out.json();
    return response;
  }

  async function getItems(folderName) {
    const out = await fetch("/db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        type: "getItems",
        params: {
          userID: userID,
          folderName: folderName,
        },
      }),
    });
    console.log(`out: ${JSON.stringify(out)}`);
    const response = await out.json();
    return response;
  }

  const foldersList = await getFolders();
  console.log(
    `folderslist: ${JSON.stringify(foldersList)} ${typeof foldersList}`
  );
  set("namesOfAll", foldersList);
  if (foldersList.length !== 0) {
    for (let folder of foldersList) {
      const folderName = folder.folderName;
      const items = await getItems(folderName); // ensure folder.foldername is the right way to retreive
      set(folderName, items); // ensure items is in correct format
    }
  }
}

export async function depositData(userID, token) {
  console.log("depositing");
  async function storeFolders(foldersList) {
    const out = await fetch("/db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        type: "storeFolders",
        params: {
          userID: userID,
          foldersList: foldersList,
        },
      }),
    });
    return await out;
  }

  async function storeItems(folderName, itemsList) {
    const out = await fetch("/db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        type: "storeItems",
        params: {
          userID: userID,
          folderName: folderName,
          itemsList: itemsList,
        },
      }),
    });
    return await out;
  }
  const foldersList = getTransfers("namesOfAll");
  console.log(foldersList);
  if (foldersList.length !== 0) {
    await storeFolders(foldersList);
    for (let folderName of foldersList) {
      const items = getTransfers(folderName);
      await storeItems(folderName, items);
    }
  }
}
