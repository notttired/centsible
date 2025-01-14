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

export function ListElements({ elements, transferType }) {
  if (!elements) {
    return null;
  }
  return (
    <div className="listElements">
      {elements.map(
        (
          element // element: a makeTransfer
        ) => (
          <FullElement
            element={element}
            transferType={transferType}
            elements={elements}
          />
        )
      )}
    </div>
  );
}

function FullElement({ element, transferType, elements }) {
  const [actionsOpen, setActionsOpen] = useState(false);
  return (
    <div className="fullElement" onClick={() => setActionsOpen(!actionsOpen)}>
      <SingleElement
        element={element}
        key={`${element.source}${element.amount}${element.date}${element.recurrence}${element.completion}`}
      />
      {actionsOpen ? (
        <ElementActions
          transfer={element} // makeTransfer
          allTransfers={elements} // [makeTransfer]
          transferType={transferType} // key for allTransfers in allFolders
        />
      ) : null}
    </div>
  );
}

function ElementActions({ transfer, allTransfers, transferType }) {
  return (
    <div>
      <DeleteElementButton
        transfer={transfer}
        allTransfers={allTransfers}
        transferType={transferType}
      />
      <EditElementButton transfer={transfer} />
    </div>
  );
}

function DeleteElementButton({ transfer, allTransfers, transferType }) {
  const { allFolders, setAllFolders } = useContext(foldersContext);
  function handleDeleteTransfer() {
    let newTransfers = [...allTransfers];
    newTransfers.splice(
      newTransfers.findIndex((singleTransfer) => singleTransfer === transfer),
      1 // make sure this works
    );
    updateFolder(allFolders, setAllFolders, transferType, newTransfers);
  }
  return (
    <button className="iconButton" onClick={handleDeleteTransfer}>
      <img src={trash} alt="Delete"></img>
    </button>
  );
}

function EditElementButton({ transfer }) {
  return <AddTransfer currentTransfer={transfer} open={true} />;
}

function SingleElement({ element }) {
  return (
    <div className="singleElement">
      {fieldTypes.map((type) => (
        <SinglePart type={type} value={element[type]} />
      ))}
    </div>
  );
}

function SinglePart({ type, value }) {
  return <div className="singlePart">{JSON.stringify(value)}</div>;
}
