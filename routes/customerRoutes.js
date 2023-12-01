const customerList = require('../model/CustomerList');
const productList = require('../model/ProductList');
const orderList = require('../model/OrderList');

module.exports = function (app) {

  app.get('/customer/login', (req, res) => {
    res.render('customer/login', { pageTitle: 'Customer Login', layout: 'layout' });
  });

  app.post('/customer/login', (req, res) => {
    const { email, password } = req.body;
    // Find the customer in the database
    const customer = customerList.getCustomerByEmail(email);

    if (customer && customer.password === password) {
      req.session.customer = customer; // Store the customer in the session
      res.redirect('/customer/dashboard');
    } else {
      res.redirect('/customer/login');
    }
  });

  app.get('/customer/register', (req, res) => {
    res.render('customer/register', { pageTitle: 'Sign Up', layout: 'layout' });
  });

  app.post('/customer/register', (req, res) => {
    const { name, email, password } = req.body;


    const customer = customerList.getCustomerByEmail(email);

    if (customer) {
      res.redirect('/customer/register');
    }
    else {
      customerList.addCustomer(name, email, password);
      req.session.customer = customer; // Store the customer in the session
      res.redirect('/customer/dashboard');
    }
  });

  app.get('/customer/dashboard', (req, res) => {
    const customer = req.session.customer;
    if (customer) {
      const products = productList.getProducts();
      res.render('customer/dashboard', { pageTitle: 'Dashboard', layout: 'layout', customer: customer, products: products });
    } else {
      res.redirect('/customer/login');
    }
  });

  app.get('/addToCart'), (req, res) => {
    const customer = req.session.customer;
    if (customer) {
      res.redirect('/customer/dashboard');
    } else {
      res.redirect('/customer/login');
    }
  }

  app.post('/addToCart', (req, res) => {
    const productId = req.body.productId;
    const cart = req.session.cart || {};
  
    // Check if the product is already in the cart
    if (cart[productId]) {
      // If so, increase the quantity by 1
      cart[productId]++;
    } else {
      // If not, add the product with a quantity of 1
      cart[productId] = 1;
    }
  
    // Update the session data with the modified cart
    req.session.cart = cart;

    res.redirect('/customer/dashboard');
  });
};