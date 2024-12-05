import React, { useState } from "react";
import { store, getReceipts, sortReceipts } from "./storage.js";

export function makeTransfer(source, amount, date, completion) {
  return {
    source: String(source),
    amount: Number(amount),
    date: String(date),
    completion: Boolean(completion),
  };
}
