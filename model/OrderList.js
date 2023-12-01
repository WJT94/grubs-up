// /model/OrderList.js
const Database = require('./Database');
const Order = require('./Order');

class OrderList extends Database {
  constructor(dbFilePath) {
    super(dbFilePath);

    if (!OrderList.instance) {
      OrderList.instance = this;
      this.initialize();
    }

    return OrderList.instance;
  }

  initialize() {
    const dbData = this.readDatabase();
    // Ensure "orders" and "nextOrderId" keys are initialized in the database
    if (!dbData.hasOwnProperty('orders') || !dbData.hasOwnProperty('nextOrderId')) {
      this.writeDatabase({ orders: [], nextOrderId: 1 });
      // Re-read the database after initializing to get the correct values
      const updatedData = this.readDatabase();
      this.orders = updatedData.orders || [];
      this.nextOrderId = updatedData.nextOrderId || 1;
    } else {
      this.orders = dbData.orders;
      this.nextOrderId = dbData.nextOrderId;
    }
  }

  addOrder(customerId, time, address, parts, status) {
    const newOrder = new Order(this.nextOrderId++, customerId, time, address, parts, status);
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

const orderDbFilePath = './db/orders.json';
const instance = new OrderList(orderDbFilePath);
module.exports = instance;