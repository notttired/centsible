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

export default function App() {
  //source, amount, date, completion, recurring
  const [income, setIncome] = useState(getTransfers("income"));
  //source, amount, date, completion, recurring
  const [expenses, setExpenses] = useState(getTransfers("expenses"));

  return (
    <div>
      <nav>Navigation</nav>
      <Display
        income={income}
        setIncome={setIncome}
        expenses={expenses}
        setExpenses={setExpenses}
      />
    </div>
  );
}

export function Display({ income, setIncome, expenses, setExpenses }) {
  return (
    <div>
      <Actions
        transfers={income}
        setTransfers={setIncome}
        transferType={"income"}
      />
      <DisplayTransfers transfers={income} />
      <Actions
        transfers={expenses}
        setTransfers={setExpenses}
        transferType={"expenses"}
      />
      <DisplayTransfers transfers={expenses} />
    </div>
  );
}

export function DisplayTransfers({ transfers }) {
  console.log(`income: ${transfers}`);
  return (
    <div>
      <ListElements elements={transfers} />
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
