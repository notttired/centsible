// make sure to consider what you're using it for, what functions will be run on anything you add

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
  return transfers;
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
