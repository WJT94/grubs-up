class Cart {
  constructor(id, customerId, time, address, parts, status) {
    this.id = id;
    this.customerId = customerId;
    this.time = time || null;
    this.address = address || null;
    this.parts = parts || [];
  }
}

module.exports = Cart;