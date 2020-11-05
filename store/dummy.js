/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

const db = {};
const fs = require('fs');
const config = require('../config');

let filePath = 'store/files';
if (config.env.node_env === 'test') {
  filePath = 'store/files/test';
}

async function chargeData() {
  const BufferUsers = await fs.readFileSync(`${filePath}/users.txt`);
  const BufferFavoritos = await fs.readFileSync(`${filePath}/favoritos.txt`);
  const BufferTokens = await fs.readFileSync(`${filePath}/tokens.txt`);
  const users = BufferUsers.toString();
  const favoritos = BufferFavoritos.toString();
  const tokens = BufferTokens.toString();
  db.users = JSON.parse(users);
  db.favoritos = JSON.parse(favoritos);
  db.tokens = JSON.parse(tokens);
}
chargeData();

async function list(table) {
  return db[table] || [];
}

async function insert(table, data) {
  db[table].push(data);
  const tableStore = JSON.stringify(db[table]);
  await fs.writeFileSync(`${filePath}/${table}.txt`, tableStore);
  return data;
}

async function query(table, q) {
  console.log(table, q);
  const col = await list(table);
  const keys = Object.keys(q);
  const key = keys[0];
  return col.filter((element) => element[key] === q[key]) || [];
}

async function remove(table, query) {
  let col = await list(table);
  const keys = Object.keys(query);
  const key = keys[0];
  const res = col.filter((element) => element[key] === query[key])[0];
  const index = col.indexOf(res);
  col.splice(index, 1);
  if (col.length === 0) {
    col = [];
  }
  db[table] = col;
  await fs.writeFileSync(`${filePath}/${table}.txt`, JSON.stringify(col));
  return res;
}

async function clearTable(table) {
  db[table] = [];
  await fs.writeFileSync(`${filePath}/${table}.txt`, JSON.stringify(db[table]));
}

module.exports = {
  list,
  remove,
  query,
  insert,
  clearTable,
};
