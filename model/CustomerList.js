// /model/CustomerList.js
const Database = require('./Database');
const Customer = require('./Customer');

class CustomerList extends Database {
  constructor(dbFilePath) {
    super(dbFilePath);
    const dbData = this.readDatabase();

    // Ensure "customers" and "nextCustomerId" keys are initialized in the database
    if (!dbData.hasOwnProperty('customers') || !dbData.hasOwnProperty('nextCustomerId')) {
      this.writeDatabase({ customers: [], nextCustomerId: 1 });
      // Re-read the database after initializing to get the correct values
      const updatedData = this.readDatabase();
      this.customers = updatedData.customers || [];
      this.nextCustomerId = updatedData.nextCustomerId || 1;
    } else {
      this.customers = dbData.customers;
      this.nextCustomerId = dbData.nextCustomerId;
    }
  }

  addCustomer(name, email, password) {
    const newCustomer = new Customer(this.nextCustomerId++, name, email, password);
    this.customers.push(newCustomer);
    this.setValue('nextCustomerId', this.nextCustomerId);
    this.setValue('customers', this.customers);
    return newCustomer;
  }

  updateCustomer(id, updatedInfo) {
    const customerToUpdate = this.customers.find(customer => customer.id === id);

    if (customerToUpdate) {
      Object.assign(customerToUpdate, updatedInfo);
      this.setValue('customers', this.customers);
      return customerToUpdate;
    }

    return null;
  }

  deleteCustomer(id) {
    const index = this.customers.findIndex(customer => customer.id === id);

    if (index !== -1) {
      this.customers.splice(index, 1);
      this.setValue('customers', this.customers);
      return true;
    }

    return false;
  }

  getCustomers() {
    return this.customers;
  }

  getCustomerById(id) {
    return this.customers.find(customer => customer.id === id) || null;
  }

  getCustomerByName(name) {
    return this.customers.find(customer => customer.name === name) || null;
  }

  getCustomerByEmail(email) {
    return this.customers.find(customer => customer.email === email) || null;
  }

  addCustomerOrder(customerId, orderId) {
    const customerToUpdate = this.customers.find(customer => customer.id === customerId);

    if (customerToUpdate) {
      console.log(customerToUpdate);
    } else {
      error("No Customer found with an ID of", customerId);
    }
  }
}

const customerDbFilePath = './db/customers.json';
const instance = new CustomerList(customerDbFilePath);
module.exports = instance;
