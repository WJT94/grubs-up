class Customer {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.orders = {};
    }

    
}

module.exports = Customer;