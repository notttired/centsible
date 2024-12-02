import React, { useState } from "react";
import "./App.css";
import { store, getReceipts, sortReceipts } from "./storage.js";

// storedReceipts will be an array of objects with names
//objects have properties storeName, total, date, type

const fieldTypes = [`storeName`, `total`, `date`, `type`];
let typeIndex = 0;

function makeReceipt(storeName, total, date, type) {
  return {
    storeName: String(storeName),
    total: String(total),
    date: String(date),
    type: String(type),
  };
}

export default function App() {
  const [storedReceipts, setStoredReceipts] = useState(getReceipts());
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <div>
      <AllReceipts receipts={storedReceipts} />
      <AddReceipts
        storedReceipts={storedReceipts}
        setStoredReceipts={setStoredReceipts}
        openDialog={openDialog}
      />
      <button onClick={() => setOpenDialog(!openDialog)}>Open/Close</button>
      <SortButton setStoredReceipts={setStoredReceipts} />
    </div>
  );
}

export function SortButton({ setStoredReceipts }) {
  return (
    <button
      onClick={() => {
        sortReceipts(fieldTypes[typeIndex % 4]);
        typeIndex++;
        setStoredReceipts(getReceipts());
      }}
    >
      {fieldTypes[typeIndex % 4]}
    </button>
  );
}

export function AddReceipts({ storedReceipts, setStoredReceipts, openDialog }) {
  const [newReceipt, setNewReceipt] = useState({});
  if (!openDialog) {
    return null;
  }
  return (
    <div>
      {fieldTypes.map((singleType) => {
        return (
          <AddField
            newReceipt={newReceipt}
            setNewReceipt={setNewReceipt}
            fieldType={singleType}
            key={`${singleType}`}
          />
        );
      })}
      <button
        onClick={(e) => {
          let newStoredReceipts;
          if (!storedReceipts) {
            newStoredReceipts = [newReceipt];
          } else {
            newStoredReceipts = [...storedReceipts];
            newStoredReceipts.push(newReceipt);
          }
          store(newReceipt); // from another file
          setStoredReceipts(newStoredReceipts);
          setNewReceipt({});
          // clear current form
        }}
      >
        Submit
      </button>
    </div>
  );
}

export function AddField({ newReceipt, setNewReceipt, fieldType }) {
  // form validation!!
  return (
    <div className={`${fieldType}`}>
      <div>{fieldType}:</div>
      <input
        onChange={(e) => {
          const currentReceipt = { ...newReceipt, [fieldType]: e.target.value }; // [] msut enclose dynamic keys
          console.log(currentReceipt);
          setNewReceipt(currentReceipt);
        }}
      />
    </div>
  );
}

export function AllReceipts({ receipts }) {
  console.log(`Receipts: ${receipts}`);
  if (!receipts) {
    return null;
  }
  return receipts.map((newReceipt) => (
    <SingleReceipt
      receipt={newReceipt}
      key={`${newReceipt.total}${newReceipt.date}`}
    />
  ));
}

export function SingleReceipt({ receipt }) {
  return (
    <div>{`StoreName: ${receipt.storeName}, Total: ${receipt.total}, Date: ${receipt.date}, Type: ${receipt.type}`}</div>
  );
}
