const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const customerList = require('./model/CustomerList');
const adminList = require('./model/AdminList');
const productList = require('./model/ProductList');
const orderList = require('./model/OrderList');
const extraList = require('./model/ExtraList');


// Initialise Express
const app = express();
const port = 3000;

// Configure Handlebars
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Configure CSS & other static files
app.use(express.static('public'));


// Configure routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000
  },
  store: new session.MemoryStore()
 }));

require('./routes/customerRoutes')(app);
require('./routes/adminRoutes')(app);

app.get('/', (req, res) => {
  res.render('home', { pageTitle: 'Home', layout: 'layout', products: productList.getProducts() });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

console.log(orderList.getTotalPrice(1));