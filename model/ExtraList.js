// /model/ExtraList.js
const Database = require('./Database');
const Extra = require('./Extra');

class ExtraList extends Database {
  constructor(dbFilePath) {
    super(dbFilePath);

    if (!ExtraList.instance) {
      ExtraList.instance = this;
      this.initialize();
    }

    return ExtraList.instance;
  }

  initialize() {
    const dbData = this.readDatabase();
    // Ensure "extras" and "nextExtraId" keys are initialized in the database
    if (!dbData.hasOwnProperty('extras') || !dbData.hasOwnProperty('nextExtraId')) {
      this.writeDatabase({ extras: [], nextExtraId: 1 });
      // Re-read the database after initializing to get the correct values
      const updatedData = this.readDatabase();
      this.extras = updatedData.extras || [];
      this.nextExtraId = updatedData.nextExtraId || 1;
    } else {
      this.extras = dbData.extras;
      this.nextExtraId = dbData.nextExtraId;
    }
  }

  addExtra(name, description, price, categories) {
    const newExtra = new Extra(this.nextExtraId++, name, description, price, categories);
    this.extras.push(newExtra);
    this.setValue('nextExtraId', this.nextExtraId);
    this.setValue('extras', this.extras);
    return newExtra;
  }

  updateExtra(id, updatedInfo) {
    const extraToUpdate = this.extras.find(extra => extra.id === id);

    if (extraToUpdate) {
      Object.assign(extraToUpdate, updatedInfo);
      this.setValue('extras', this.extras);
      return extraToUpdate;
    }

    return null;
  }

  deleteExtra(id) {
    const index = this.extras.findIndex(extra => extra.id === id);

    if (index !== -1) {
      this.extras.splice(index, 1);
      this.setValue('extras', this.extras);
      return true;
    }

    return false;
  }

  getExtraById(id) {
    return this.extras.find(extra => extra.id === id) || null;
  }

  getExtraByName(name) {
    return this.extras.find(extra => extra.name === name) || null;
  }

  getExtras() {
    return this.extras;
  }

  // Returns array of all extras under a certain category
  getExtrasByCategory(category) {
    return this.extras.filter(extra => extra.categories.includes(category)) || [];
  }
}

const extraDbFilePath = './db/extras.json';
const instance = new ExtraList(extraDbFilePath);
module.exports = instance;