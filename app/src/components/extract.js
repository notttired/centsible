import React, { useState } from "react";
import { store, getReceipts, getTransfers } from "../functions/storage.js";
import dropboxImg from "../images/dropbox.png";
import { handleNewTransfer } from "../functions/handles.js";
const Tesseract = require(`tesseract.js`);

export function Dropbox({ storedTransfers, setStoredTransfers, transferType }) {
  function handleSubmit() {
    const form = document.querySelector("#fileDropbox");
    form.click();
  }
  return (
    <div className="dropbox">
      <button className="iconButton" onClick={handleSubmit}>
        <img src={dropboxImg} alt="DropBox" />
      </button>
      <input
        id="fileDropbox"
        type="file"
        onChange={async (e) => {
          const images = e.target.files;
          const newTransfers = await handleReceipts(images);
          for (let newTransfer of newTransfers) {
            handleNewTransfer(
              newTransfer,
              () => {
                console.log("hi");
              },
              storedTransfers,
              setStoredTransfers,
              transferType
            );
          }
        }}
        multiple
      />
    </div>
  );
}

export async function handleReceipts(images) {
  const parsedReceipts = await parseImageReceipts(images);
  const extractedReceipts = extractText(parsedReceipts);
  console.log(extractedReceipts);
  return extractedReceipts;
}

// make sure they are the right file type

export async function parseImageReceipts(images) {
  let parsedText = [];
  const worker = await Tesseract.createWorker(`eng`);
  for (let i = 0; i < images.length; i++) {
    const {
      data: { text },
    } = await worker.recognize(images[i]);
    parsedText.push(text);
  }
  await worker.terminate();
  return parsedText;
}

export function extractText(receipts) {
  const regexDate = new RegExp(/\d{2}[/-]\d{2}[/-]\d{2,4}/, "i"); // cannot use string vs literal
  const regexSubtotal = new RegExp(/\nsubtotal/, "i");
  const regexTotal = new RegExp(/\ntotal/, "i");
  let receiptInfo = [];

  function extractSingle(receipt) {
    console.log(`receipt: ${receipt}, ${typeof receipt}`);
    const dateStart = receipt.search(regexDate); // include backup if search fails
    const totalStart = receipt.search(regexTotal);

    const date = takeWord(receipt.slice(dateStart + 1)); // MATCH INDICIES
    const total = takeWord(receipt.slice(totalStart + 7));
    return {
      source: null,
      amount: total,
      date: date,
      recurrence: false,
      completion: true,
    };
  }

  for (let receipt of receipts) {
    // FOR "IN" AND FOR "OF" ARE DIFFERENT!!!
    receiptInfo.push(extractSingle(receipt));
  }
  return receiptInfo;
}

function takeWord(word) {
  const regexSpace = new RegExp(/\s/, `i`);
  let index = word.search(regexSpace);
  return word.slice(0, index);
}
