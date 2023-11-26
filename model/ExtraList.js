// /model/ExtraList.js
const Database = require('./Database');
const Extra = require('./Extra');

class ExtraList extends Database {
  constructor(dbFilePath) {
    super(dbFilePath);
    const dbData = this.readDatabase();
    this.extras = dbData.extras || [];
    this.nextExtraId = dbData.nextExtraId || 1;

    // Ensure "extras" key is initialized in the database
    if (!dbData.hasOwnProperty('extras')) {
      this.writeDatabase({ extras: [], nextExtraId: this.nextExtraId });
    }

    // Ensure "nextExtraId" key is initialized in the database
    if (!dbData.hasOwnProperty('nextExtraId')) {
      this.nextExtraId = 1;
      this.writeDatabase({ ...dbData, nextExtraId: this.nextExtraId });
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

module.exports = ExtraList;
