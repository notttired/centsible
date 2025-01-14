import React, { useState, useContext, createContext } from "react";
import {
  store,
  getTransfers,
  sortTransfers,
  retrieveData,
} from "./functions/storage.js";

import { Dropbox } from "./components/extract.js";

import {
  foldersContext,
  transfersContext,
  usernameContext,
  fieldTypes,
} from "./context.js";

import {
  makeTransfer,
  handleNewTransfer,
  updateFolder,
  deleteFolder,
} from "./functions/handles.js";

import { AddTransfer } from "./components/forms.js";
import { ListElements } from "./components/listElements.js";
import { FolderHeader } from "./components/header.js";
import checkmark from "./images/checkmark.png";

// More time: Add Expanding for groups, Add Color Coding, Add Sums of Information for groups, Add Notes to each

// localStorage.setItem(
//   `namesOfAll`,
//   JSON.stringify(["Income", "Expenses", "NewName"])
// );
// localStorage.setItem("NewName", JSON.stringify([makeTransfer(1, 1, 1, 1, 1)]));
// initialized and stores in localStorage

export default function App() {
  const [namesOfAll, setNamesOfAll] = useState(
    JSON.parse(localStorage.getItem(`namesOfAll`) || "[]")
  );
  const prevAllFolders = {};
  console.log(`namesOfAll: ${JSON.stringify(namesOfAll)}`);
  if (namesOfAll !== null && namesOfAll.length !== 0) {
    for (let folderName of namesOfAll) {
      prevAllFolders[folderName] = getTransfers(folderName);
    }
  }
  const [allFolders, setAllFolders] = useState(prevAllFolders); // allFolders: {name: [makeTransfers]}
  console.log(JSON.stringify(allFolders));

  return (
    <div className="appContainer">
      <nav className="navContainer">
        <MainNav />
      </nav>
      <foldersContext.Provider
        value={{ namesOfAll, setNamesOfAll, allFolders, setAllFolders }}
      >
        <Display />
        <AddFolder />
      </foldersContext.Provider>
    </div>
  );
}

function MainNav() {
  const name = useContext(usernameContext);
  return (
    <ul className="mainNav">
      <div className="navElement">Home</div>
      <div className="navElement">Summary</div>
      <h2 className="welcomeMessage">Welcome, {name}!</h2>
    </ul>
  );
}

function AddFolder() {
  const { namesOfAll, setNamesOfAll, allFolders, setAllFolders } =
    useContext(foldersContext);
  const [newName, setNewName] = useState("");
  function modifyAllFolders(newName) {
    const prevAllFolders = { ...allFolders, [newName]: [] };
    setAllFolders(prevAllFolders);
  }

  return (
    <div class="display">
      <div id="addFolder" className="singleFolderDisplay">
        <input
          className="folderInput"
          onChange={(e) => {
            setNewName(e.target.value);
          }}
        />
        <button
          className="folderSubmit iconButton"
          onClick={() => {
            console.log(namesOfAll);
            const newNames = [...namesOfAll];
            newNames.push(newName);
            store(newName, "namesOfAll");
            setNamesOfAll(newNames);
            modifyAllFolders(newName);
            setNewName("");
          }}
        >
          <img src={checkmark} alt="Submit"></img>
        </button>
      </div>
    </div>
  );
}

function Display() {
  const { allFolders, setAllFolders } = useContext(foldersContext);
  function modifyFolder(folderKey) {
    return function (toBeSet) {
      const newAllFolders = { ...allFolders, [folderKey]: toBeSet }; // syntax
      setAllFolders(newAllFolders);
    };
  }

  let displayedFolders = [];
  for (const folderKey in allFolders) {
    const folder = allFolders[folderKey]; // [makeTransfer]
    const singleFolderDisplay = (
      <div className="singleFolderDisplay">
        <transfersContext.Provider
          value={{
            transfers: folder,
            transferType: folderKey,
            setTransfers: modifyFolder(folderKey),
          }}
        >
          <DisplayTransfers />
        </transfersContext.Provider>
      </div>
    );
    displayedFolders.push(singleFolderDisplay);
  }
  return <div className="display">{displayedFolders}</div>;
}

// transfers is one folder
// transferType is the key to the folder
// setTransfers is modifying the folder
function DisplayTransfers() {
  const { transfers, transferType } = useContext(transfersContext);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="displayTransfers">
      <FolderHeader collapsed={collapsed} setCollapsed={setCollapsed} />
      {!collapsed ? (
        <ListElements elements={transfers} transferType={transferType} />
      ) : null}
    </div>
  );
}
