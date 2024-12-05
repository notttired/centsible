import React, { useState } from "react";
import { store, getTransfers, sortTransfers } from "./storage.js";

const fieldTypes = [`source`, `amount`, `date`, `recurrence`, `completion`];

export function makeTransfer(source, amount, date, recurrence, completion) {
  return {
    source: String(source),
    amount: Number(amount),
    date: String(date),
    recurrence: Boolean(recurrence),
    completion: Boolean(completion),
    // add form validation here
  };
}

export function handleNewTransfer(
  newTransfer,
  setNewTransfer,
  storedTransfers,
  setStoredTransfers,
  transferType
) {
  let newStoredTransfers;
  const toPush = makeTransfer(
    newTransfer.source,
    newTransfer.amount,
    newTransfer.date,
    newTransfer.recurrence,
    newTransfer.completion
  );
  if (!storedTransfers) {
    newStoredTransfers = [toPush];
  } else {
    newStoredTransfers = [...storedTransfers];
    newStoredTransfers.push(toPush);
  }
  store(toPush, transferType);
  setStoredTransfers(newStoredTransfers);
  setNewTransfer({});
}

let typeIndex = 0;
export function SortButton({ setStoredTransfers, transferType }) {
  return (
    <button
      onClick={() => {
        sortTransfers(transferType, fieldTypes[typeIndex % 5]);
        typeIndex++;
        setStoredTransfers(getTransfers(transferType));
      }}
    >
      {fieldTypes[typeIndex % 5]}
    </button>
  );
}

export function AddTransfer({
  storedTransfers,
  setStoredTransfers,
  transferType,
  openDialog,
}) {
  const [newTransfer, setNewTransfer] = useState({});
  if (!openDialog) {
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
        min="0" // syntax
        minLength="1"
      />
    </div>
  );
}

export function ListElements({ elements }) {
  if (!elements) {
    return null;
  }
  return elements.map((element) => (
    <SingleElement
      element={element}
      key={`${element.source}${element.amount}${element.date}${element.recurrence}${element.completion}`}
    />
  ));
}

function SingleElement({ element }) {
  return (
    <div>
      {`Source: ${element.source}, Amount: ${element.amount}, Date: ${element.date}, Recurrence: ${element.recurrence}, Completed: ${element.completion}`}
    </div>
  );
}
