import React, { useState } from "react";
import "./App.css";
import { store, getReceipts, getTransfers } from "./storage.js";
import { Dropbox } from "./extract.js";
import {
  makeTransfer,
  ListElements,
  AddTransfer,
  SortButton,
} from "./transactions.js";

// storedReceipts will be an array of objects with names
//objects have properties storeName, total, date, type

// localStorage.setItem("income", JSON.stringify([makeTransfer(1, 1, 1, 1, 1)]));
// NOTE: ADD FORM VALIDATION TO PREVENT DUPLICATION
// ALWAYS LIST OUT TYPE OF ELEMENT USING COMMENT

// More time: Add Grouping, Add Color Coding, Add Sums of groups, Add Notes to each

localStorage.setItem(
  `namesOfAll`,
  JSON.stringify(["income", "expenses", "newName"])
);
localStorage.setItem("newName", JSON.stringify([makeTransfer(1, 1, 1, 1, 1)]));

export default function App() {
  const [namesOfAll, setNamesOfAll] = useState(
    JSON.parse(localStorage.getItem(`namesOfAll`))
  );
  const prevAllFolders = {};
  for (let folderName of namesOfAll) {
    prevAllFolders[folderName] = getTransfers(folderName);
  }
  const [allFolders, setAllFolders] = useState(prevAllFolders); // allFolders: {name: [makeTransfers]}
  console.log(JSON.stringify(allFolders));

  return (
    <div>
      <nav>Navigation</nav>
      <AddFolder
        namesOfAll={namesOfAll}
        setNamesOfAll={setNamesOfAll}
        allFolders={allFolders}
        setAllFolders={setAllFolders}
      />
      <Display
        namesOfAll={namesOfAll}
        setNamesOfAll={setNamesOfAll}
        allFolders={allFolders}
        setAllFolders={setAllFolders}
      />
    </div>
  );
}

export function AddFolder({
  namesOfAll,
  setNamesOfAll,
  allFolders,
  setAllFolders,
}) {
  const [newName, setNewName] = useState("");
  function modifyAllFolders(newName) {
    const prevAllFolders = { ...allFolders, [newName]: [] };
    setAllFolders(prevAllFolders);
  }

  return (
    <div>
      <input
        onChange={(e) => {
          setNewName(e.target.value);
        }}
      />
      <button
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
        New
      </button>
    </div>
  );
}

export function Display({
  namesOfAll,
  setNamesOfAll,
  allFolders,
  setAllFolders,
}) {
  console.log(JSON.stringify(allFolders));
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
      <div>
        <Actions
          transfers={folder}
          setTransfers={modifyFolder(folderKey)}
          transferType={folderKey}
        />
        <DisplayTransfers
          namesOfAll={namesOfAll}
          setNamesOfAll={setNamesOfAll}
          allFolders={allFolders}
          setAllFolders={setAllFolders}
          transfers={folder}
          transferType={folderKey}
        />
      </div>
    );
    displayedFolders.push(singleFolderDisplay);
  }
  return <div>{displayedFolders}</div>;
}

export function DisplayTransfers({
  namesOfAll,
  setNamesOfAll,
  allFolders,
  setAllFolders,
  transfers, // [makeTransfer]
  transferType, // key for [makeTransfer] in allFolders
}) {
  return (
    <div>
      <FolderHeader
        namesOfAll={namesOfAll}
        setNamesOfAll={setNamesOfAll}
        allFolders={allFolders}
        setAllFolders={setAllFolders}
        transferType={transferType}
      />
      <ListElements
        elements={transfers}
        transferType={transferType}
        allFolders={allFolders}
        setAllFolders={setAllFolders}
      />
    </div>
  );
}

export function FolderHeader({
  namesOfAll,
  setNamesOfAll,
  allFolders,
  setAllFolders,
  transferType,
}) {
  console.log(JSON.stringify(namesOfAll));
  function handleDeleteHeader() {
    let newFolderNames = [...namesOfAll];
    newFolderNames.splice(
      newFolderNames.findIndex((name) => name === transferType),
      1
    );
    localStorage.setItem(`namesOfAll`, JSON.stringify(newFolderNames));
    setNamesOfAll(newFolderNames);
    const newAllFolders = { ...allFolders };
    delete newAllFolders[transferType];
    setAllFolders(newAllFolders);
  }
  return (
    <div>
      <h1>{transferType}</h1>
      <button onClick={handleDeleteHeader}>Delete</button>
    </div>
  );
}

export function Actions({ transfers, setTransfers, transferType }) {
  return (
    <div>
      <AddTransfer
        storedTransfers={transfers}
        setStoredTransfers={setTransfers}
        transferType={transferType}
        openDialog={true} // change later
      />
      <SortButton
        setStoredTransfers={setTransfers}
        transferType={transferType}
      />
      <Dropbox
        storedTransfers={transfers}
        setStoredTransfers={setTransfers}
        transferType={transferType}
      />
    </div>
  );
}
