// /model/Database.js
const fs = require('fs');
const path = require('path');

class Database {
  constructor(dbFilePath) {
    this.dbFilePath = dbFilePath;
  }

  ensureDirectoryExists() {
    const directory = path.dirname(this.dbFilePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  readDatabase() {
    try {
      const data = fs.readFileSync(this.dbFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // If the file doesn't exist or there's an error parsing it, return an empty object
      return {};
    }
  }

  writeDatabase(data) {
    this.ensureDirectoryExists();
    fs.writeFileSync(this.dbFilePath, JSON.stringify(data, null, 2), 'utf8');
  }

  // Does File IO directly, and will be slower than reading from the objects themselves
  setValue(key, value) {
    const data = this.readDatabase();
    data[key] = value;
    this.writeDatabase(data);
  }

  // Does File IO directly, and will be slower than reading from the objects themselves
  getValue(key) {
    const data = this.readDatabase();
    return data[key];
  }
}

module.exports = Database;
