// /model/OrderList.js
const Database = require('./Database');
const Order = require('./Order');

class OrderList extends Database {
  constructor(dbFilePath) {
    super(dbFilePath);
    const dbData = this.readDatabase();
    this.orders = dbData.orders || [];
    this.nextOrderId = dbData.nextOrderId || 1;

    // Ensure "orders" key is initialised in the database
    if (!dbData.hasOwnProperty('orders')) {
      this.writeDatabase({ orders: [], nextOrderId: this.nextOrderId });
    }

    // Ensure "nextOrderId" key is initialised in the database
    if (!dbData.hasOwnProperty('nextOrderId')) {
      this.nextOrderId = 1;
      this.writeDatabase({ ...dbData, nextOrderId: this.nextOrderId });
    }
  }

  addOrder(customerId, time, parts, status) {
    const newOrder = new Order(this.nextOrderId++, customerId, time, parts, status);
    this.orders.push(newOrder);
    this.setValue('nextOrderId', this.nextOrderId);
    this.setValue('orders', this.orders);
    return newOrder;
  }

  updateOrder(id, updatedInfo) {
    const orderToUpdate = this.orders.find(order => order.id === id);

    if (orderToUpdate) {
      Object.assign(orderToUpdate, updatedInfo);
      this.setValue('orders', this.orders);
      return orderToUpdate;
    }

    return null;
  }

  fulfilOrder(id) {
    return this.updateOrder(id, { status: OrderStatus.COMPLETE });
  }

  cancelOrder(id) {
    return this.updateOrder(id, { status: OrderStatus.CANCELLED });
  }

  getOrderById(id) {
    return this.orders.find(order => order.id === id) || null;
  }

  getOrders() {
    return this.orders;
  }
}

module.exports = OrderList;
