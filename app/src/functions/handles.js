import { store } from "./storage.js";

export function makeTransfer(
  source = null,
  amount = null,
  date = null,
  recurrence = null,
  completion = null
) {
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

export function updateFolder(allFolders, setAllFolders, name, newFolder) {
  const newAllFolders = { ...allFolders, [name]: newFolder };
  setAllFolders(newAllFolders);
  localStorage.setItem(name, JSON.stringify(newFolder));
}

export function deleteFolder(allFolders, setAllFolders, name) {
  const newAllFolders = { ...allFolders };
  delete newAllFolders[name];
  setAllFolders(newAllFolders);
  localStorage.setItem(name, null);
}

// require functions: create folder, update name, delete folder
// add item, modify item, delete item
