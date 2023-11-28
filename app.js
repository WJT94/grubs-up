const CustomerList = require('./model/CustomerList');
const AdminList = require('./model/AdminList');
const ProductList = require('./model/ProductList');
const OrderList = require('./model/OrderList');
const ExtraLIst = require('./model/ExtraList');


const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');



// Database file paths in the /db/ folder
const customerDbFilePath = './db/customers.json';
const adminDbFilePath = './db/admins.json';
const productDbFilePath = './db/products.json';
const orderDbFilePath = './db/orders.json';

// create lists to link to database
const customerList = new CustomerList(customerDbFilePath);
const productList = new ProductList(productDbFilePath);



const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

app.get('/', (req, res) => {
  res.send(`
  <h1>GrubsUp</h1>
  <p>By Litva Kebabs</p>
  <h3><a href="/customer/login">Dig in</a></h3>
  <h3><a href="/admin/login">Staff Login</a></h3>
  `);
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

app.get('/customer/login', (req, res) => {
  res.send(`
    <h1>Login Page</h1>
    <form action="/customer/login" method="post">
      <label for="email">Email:</label>
      <input type="email" name="email" required>
      <label for="password">Password:</label>
      <input type="password" name="password" required>
      <button type="submit">Login</button>
    </form>
  `);
});

app.get('/customer/dashboard', (req, res) => {
  const customer = req.session.customer;
  if (customer) {
    res.send(`<h1>Welcome, ${customer.name}!</h1><a href="/logout">Logout</a>`);
  } else {
    res.redirect('/customer/login');
  }
});

app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;

  // Find the admin in the database
  const admin = adminList.getAdminByEmail(email);

  if (admin && admin.password === password) {
    req.session.admin = admin; // Store the admin in the session
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin/login');
  }
});

app.get('/admin/login', (req, res) => {
  res.send(`
    <h1>Admin Login Page</h1>
    <form action="/admin/login" method="post">
      <label for="email">Email:</label>
      <input type="email" name="email" required>
      <label for="password">Password:</label>
      <input type="password" name="password" required>
      <button type="submit">Login</button>
    </form>
  `);
});

app.get('/admin/dashboard', (req, res) => {
  const customer = req.session.customer;
  if (customer) {
    res.send(`<h1>Welcome, ${admin.name}!</h1><a href="/logout">Logout</a>`);
  } else {
    res.redirect('/customer/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
