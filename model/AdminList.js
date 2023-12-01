// /model/AdminList.js
const Database = require('./Database');
const Admin = require('./Admin');

class AdminList extends Database {
  constructor(dbFilePath) {
    super(dbFilePath);
    const dbData = this.readDatabase();

    // Ensure "admins" and "nextAdminId" keys are initialized in the database
    if (!dbData.hasOwnProperty('admins') || !dbData.hasOwnProperty('nextAdminId')) {
      this.writeDatabase({ admins: [], nextAdminId: 1 });
      // Re-read the database after initializing to get the correct values
      const updatedData = this.readDatabase();
      this.admins = updatedData.admins || [];
      this.nextAdminId = updatedData.nextAdminId || 1;
    } else {
      this.admins = dbData.admins;
      this.nextAdminId = dbData.nextAdminId;
    }
  }

  addAdmin(name, email, password) {
    const newAdmin = new Admin(this.nextAdminId++, name, email, password);
    this.admins.push(newAdmin);
    this.setValue('nextAdminId', this.nextAdminId);
    this.setValue('admins', this.admins);
    return newAdmin;
  }

  updateAdmin(id, updatedInfo) {
    const adminToUpdate = this.admins.find(admin => admin.id === id);

    if (adminToUpdate) {
      Object.assign(adminToUpdate, updatedInfo);
      this.setValue('admins', this.admins);
      return adminToUpdate;
    }

    return null;
  }

  deleteAdmin(id) {
    const index = this.admins.findIndex(admin => admin.id === id);

    if (index !== -1) {
      this.admins.splice(index, 1);
      this.setValue('admins', this.admins);
      return true;
    }

    return false;
  }

  getAdmins() {
    return this.admins;
  }

  getAdminById(id) {
    return this.admins.find(admin => admin.id === id) || null;
  }

  getAdminByName(name) {
    return this.admins.find(admin => admin.name === name) || null;
  }

  getAdminByEmail(email) {
    return this.admins.find(admin => admin.email === email) || null;
  }
}

const adminDbFilePath = './db/admins.json';
const instance = new AdminList(adminDbFilePath);
module.exports = instance;