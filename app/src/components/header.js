import React, { useState, useContext } from "react";
import { foldersContext, transfersContext, fieldTypes } from "../context.js";
import {
  makeTransfer,
  handleNewTransfer,
  updateFolder,
  deleteFolder,
} from "../functions/handles.js";
import { AddTransfer } from "./forms.js";
import trash from "../images/trash.png";
import { store, getTransfers, sortTransfers } from "../functions/storage.js";
import { Dropbox } from "./extract.js";
import add from "../images/add.png";
import arrow from "../images/arrow.png";
import edit from "../images/edit.png"; // add edit function

export function FolderHeader({ collapsed, setCollapsed }) {
  const { transfers, transferType, setTransfers } =
    useContext(transfersContext);
  function findTotal() {
    return (getTransfers(transferType) || []).reduce(
      (acc, val) => acc + val.amount,
      0
    );
  }

  const total = findTotal();

  return (
    <div className="folderHeader">
      <h1 className="headerText" onClick={() => setCollapsed(!collapsed)}>
        {transferType}
      </h1>
      <Actions
        transfers={transfers}
        setTransfers={setTransfers}
        transferType={transferType}
      />
      <div>{total}</div>
    </div>
  );
}

function Actions({ transfers, setTransfers, transferType }) {
  const [open, setOpen] = useState(false);
  function handleToggleForm() {
    open ? setOpen(false) : setOpen(true);
  }
  return (
    <div className="actions">
      <DeleteFolderButton transferType={transferType} />
      <button className="iconButton" onClick={handleToggleForm}>
        <img src={add} alt="AddButton" />
      </button>
      <AddTransfer
        storedTransfers={transfers}
        setStoredTransfers={setTransfers}
        transferType={transferType}
        open={open} // change later
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

function DeleteFolderButton({ transferType }) {
  const { namesOfAll, setNamesOfAll, allFolders, setAllFolders } =
    useContext(foldersContext);
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
    <button className="iconButton" onClick={handleDeleteHeader}>
      <img src={trash} alt="Delete"></img>
    </button>
  );
}

let typeIndex = 0; // change to useref
function SortButton({ setStoredTransfers, transferType }) {
  return (
    <button
      className="iconButton"
      onClick={() => {
        sortTransfers(transferType, fieldTypes[typeIndex % 5]);
        typeIndex++;
        setStoredTransfers(getTransfers(transferType));
      }}
    >
      {/* {fieldTypes[typeIndex % 5]} */}
      <img src={arrow} />
    </button>
  );
}
