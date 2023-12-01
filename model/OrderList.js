// /model/OrderList.js
const Database = require('./Database');
const Order = require('./Order');
const OrderStatus = require('./OrderStatus');
const customerList = require('./CustomerList');
const productList = require('./ProductList');

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
    if (parts.length > 0) {
      const newOrder = new Order(this.nextOrderId++, customerId, time, address, parts, status);
      this.orders.push(newOrder);
      this.setValue('nextOrderId', this.nextOrderId);
      this.setValue('orders', this.orders);
      customerList.addCustomerOrder(customerId, newOrder.id);
      return newOrder;
    }
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

  getOrderObject(orderData) {
    if (orderData) {
      return new Order(
        orderData.id,
        orderData.customerId,
        orderData.time,
        orderData.address,
        orderData.parts,
        orderData.status
      );
    } else {
      return null;
    }
  }

  // Gets the order object by id
  getOrderById(id) {
    const orderData = this.orders.find(order => order.id === id);

    return this.getOrderObject(orderData);
  }

  // Returns a total price for the entire order
  getTotalPrice(id) {
    let total = 0;
    const order = this.getOrderById(id);

    if (order) {
      order.parts.forEach(part => {
        const product = productList.getProductById(part[0]);

        // Assuming part[0] is the product and part[1] is the quantity
        const subtotal = product.price * part[1];
        total += subtotal;
      });
    }

    return total;
  }

  getOrders() {
    return this.orders;
  }

  getLiveOrders() {
    return this.orders.filter(order => order.status === OrderStatus.ORDERED);
  }

  getCancelledOrders() {
    return this.orders.filter(order => order.status === OrderStatus.CANCELLED);
  }

  getCompleteOrders() {
    return this.orders.filter(order => order.status === OrderStatus.COMPLETE);
  }

  getOrdersByCustomer(customerId) {
    return this.orders.filter(order => order.customerId === customerId);
  }
}

const orderDbFilePath = './db/orders.json';
const instance = new OrderList(orderDbFilePath);
module.exports = instance;