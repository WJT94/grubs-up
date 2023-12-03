const Cart = require('./Cart');

class Customer {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.orders = {};
        this.cart = new Cart();
    }

    
}

module.exports = Customer;