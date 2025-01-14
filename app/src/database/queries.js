require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.host, // or wherever the db is hosted
  user: process.env.user,
  database: process.env.database,
  password: process.env.password,
  port: 5432, // The default port
});

async function getFolders(userID) {
  return (
    await pool.query("SELECT * FROM folders WHERE username = ($1)", [userID])
  ).rows;
}

async function storeFolders(userID, foldersList) {
  // list of folder names
  await pool.query("DELETE FROM folders"); // syntax
  for (let folder of foldersList) {
    insertFolder(userID, folder);
  }
}

async function getItems(userID, folderName) {
  return (
    await pool.query(
      "SELECT * FROM items WHERE username = ($1) AND folderName = ($2)",
      [userID, folderName]
    )
  ).rows;
}

async function storeItems(userID, folderName, itemsList) {
  // itemsList is a list of makeTransfers
  await pool.query(
    "DELETE FROM items WHERE username = ($1) AND folderName = ($2)",
    [userID, folderName]
  );
  for (let item of itemsList) {
    const folderID = await pool.query(
      "SELECT foldername FROM folders WHERE username = ($1) AND folderName = ($2)",
      [userID, folderName]
    ); // syntax of returned table
    insertItem(userID, folderID, item);
  }
}

async function insertFolder(userID, folderName) {
  await pool.query(
    "INSERT INTO folders (username, folderName) VALUES (($1), ($2))",
    [userID, folderName]
  );
}

// check syntax
async function insertItem(userID, folderID, item) {
  // item is a makeTransfer
  await pool.query(
    "INSERT INTO items (username, folderName, source, amount, date, recurrence, completion, notes) VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8))",
    [
      userID,
      folderID,
      item.source,
      item.amount,
      item.date,
      item.recurrence,
      item.completion,
      item.notes,
    ]
  );
}

module.exports = {
  getFolders,
  storeFolders,
  getItems,
  storeItems,
};
