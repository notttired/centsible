require("dotenv").config();
const { Client } = require("pg");

const SQL = `
DROP TABLE items;
DROP TABLE folders;
DROP TABLE usernames;

CREATE TABLE IF NOT EXISTS usernames (
    userID INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR (255) UNIQUE
);

CREATE TABLE IF NOT EXISTS folders (
    folderID INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR (255),
    folderName VARCHAR (255)
);

CREATE TABLE IF NOT EXISTS items (
    username VARCHAR (255), 
    folderName VARCHAR (255),
    source VARCHAR (255),
    amount INTEGER,
    date DATE,
    recurrence BOOLEAN,
    completion BOOLEAN,
    notes VARCHAR (500)
);
`;

async function main() {
  const client = new Client({
    host: process.env.host, // or wherever the db is hosted
    user: process.env.user,
    database: process.env.database,
    password: process.env.password,
    port: 5432, // The default port
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("finished");
}

main();
