// /modules/Order.js
const OrderStatus = require('./OrderStatus');

class Order {
  constructor(id, customerId, time, address, parts, status) {
    this.id = id;
    this.customerId = customerId;
    this.time = time;
    this.address = address;
    this.parts = parts || [];
    this.status = status || OrderStatus.ORDERED; // Default to ORDERED
  }
}

module.exports = { Order };
