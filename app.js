const CustomerList = require('./model/CustomerList');
const AdminList = require('./model/AdminList');
const ProductList = require('./model/ProductList');
const OrderList = require('./model/OrderList');

const express = require('express');

// Database file paths in the /db/ folder
const customerDbFilePath = './db/customers.json';
const adminDbFilePath = './db/admins.json';
const productDbFilePath = './db/products.json';
const orderDbFilePath = './db/orders.json';

// Example usage for CustomerList
const customerList = new CustomerList(customerDbFilePath);
const customer1 = customerList.addCustomer('Customer A', 'a@customers.com', '123456');
const customer2 = customerList.addCustomer('Customer B', 'b@customers.com', '123456');
const customer3 = customerList.addCustomer('Customer C', 'a@customers.com', '123456');
const customer4 = customerList.addCustomer('Customer D', 'b@customers.com', '123456');

// Update customer information
customerList.updateCustomer(customer1.id, { email: 'newjohn@example.com' });

// Get customer
const foundCustomer = customerList.getCustomerByName('Customer B');
console.log("Found Customer:", foundCustomer);

// Delete customer
customerList.deleteCustomer(foundCustomer.id);


// Example usage for ProductList
const productList = new ProductList(productDbFilePath);
const product1 = productList.addProduct('Product One', 'Description for Product One', 19);
const product2 = productList.addProduct('Product Two', 'Description for Product Two', 9.60);
const product3 = productList.addProduct('Product Three', 'Description for Product Three', 14);
const product4 = productList.addProduct('Product Four', 'Description for Product Four', 12);
const product5 = productList.addProduct('Product Five', 'Description for Product Five', 13);
// console.log('Products after creation:', productList.getProducts());

// Update product information
productList.updateProduct(product1.id, { description: 'Updated description', price: 19.5 });
// console.log('Products after update:', productList.getProducts());

// Delete a product
const deleted = productList.deleteProduct(product2.id);
if (deleted) {
  console.log('Product deleted:', product2);
} else {
  console.log('Product not found.');
}






const app = express();
const port = 3000;

app.get('/products', (req, res) => {
    const products = productList.getProducts();
    res.send(`<h1>Products</h1><pre>${JSON.stringify(products, null, 2)}</pre>`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});