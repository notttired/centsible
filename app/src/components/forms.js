import React, { useState, useContext } from "react";
import { foldersContext, transfersContext, fieldTypes } from "../context.js";
import {
  makeTransfer,
  handleNewTransfer,
  updateFolder,
  deleteFolder,
} from "../functions/handles.js";

export function AddTransfer({ currentTransfer = makeTransfer(), open }) {
  const {
    transfers: storedTransfers,
    transferType,
    setTransfers: setStoredTransfers,
  } = useContext(transfersContext);
  const [newTransfer, setNewTransfer] = useState(currentTransfer);
  if (!open) {
    return null;
  }
  return (
    <div>
      {fieldTypes.map((singleType) => {
        return (
          <AddField
            newTransfer={newTransfer}
            setNewTransfer={setNewTransfer}
            fieldType={singleType}
            key={`${singleType}`}
          />
        );
      })}
      <button
        onClick={(e) => {
          handleNewTransfer(
            newTransfer,
            setNewTransfer,
            storedTransfers,
            setStoredTransfers,
            transferType
          );
        }}
      >
        Submit
      </button>
    </div>
  );
}

function AddField({ newTransfer, setNewTransfer, fieldType }) {
  // form validation!!
  return (
    <div className={`${fieldType}`}>
      <div>{fieldType}:</div>
      <input
        onChange={(e) => {
          const currentTransfer = {
            ...newTransfer,
            [fieldType]: e.target.value,
          }; // [] must enclose dynamic keys
          setNewTransfer(currentTransfer);
        }}
        // type={typeof fieldType} // check
        value={newTransfer[fieldType]}
        min="0" // syntax
        minLength="1"
      />
    </div>
  );
}
