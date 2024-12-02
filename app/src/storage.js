// make sure to consider what you're using it for, what functions will be run on anything you add

export function store(newReceipt) {
  let receipts = JSON.parse(localStorage.getItem(`allReceipts`) || `[]`);
  if (!receipts) {
    localStorage.setItem(`allReceipts`, JSON.stringify([newReceipt]));
  } else {
    receipts.push(newReceipt);
    localStorage.setItem(`allReceipts`, JSON.stringify(receipts));
  }
}

export function getReceipts() {
  const receipts = JSON.parse(localStorage.getItem(`allReceipts`));
  return receipts;
}

export function sortReceipts(type) {
  function sorter(a, b) {
    return String(a[type]).localeCompare(String(b[type])); // syntax and issues
  }
  let receipts = JSON.parse(localStorage.getItem(`allReceipts`));
  receipts.sort(sorter);
  localStorage.setItem(`allReceipts`, JSON.stringify(receipts));
}
