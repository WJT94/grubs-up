// /model/Extra.js
class Extra {
  constructor(id, name, description, price, categories) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.categories = categories || [];
  }
}

module.exports = Extra;
