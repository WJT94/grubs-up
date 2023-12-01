// /modules/Order.js
const OrderStatus = require('./OrderStatus');
const productList = require('./ProductList');

class Order {
  constructor(id, customerId, time, address, parts, status) {
    this.id = id;
    this.customerId = customerId;
    this.time = time;
    this.address = address;
    this.parts = parts || [];
    this.status = status || OrderStatus.ORDERED; // Default to ORDERED
  }

  getPart(index) {
    const partArray = this.parts[index];
    const part = {
      product: productList.getProductById(partArray[0]),
      quantity: partArray[1],
      comments: partArray[2]
    };
      
    return part;
  }
}

module.exports = Order;
