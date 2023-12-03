
const adminList = require('../model/AdminList');
const productList = require("../model/ProductList");
const orderList = require('../model/OrderList');

module.exports = function (app) {

  app.get('/admin/login', (req, res) => {
    res.render('admin/login', { pageTitle: 'Admin Login', layout: 'layout' });
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

  app.get('/admin/register', (req, res) => {
    res.render('admin/register', { pageTitle: 'Sign Up', layout: 'layout' });
  });

  app.post('/admin/register', (req, res) => {
    const { name, email, password } = req.body;


    const admin = adminList.getAdminByEmail(email);

    if (admin) {
      res.redirect('/admin/register');
    }
    else {
      adminList.addAdmin(name, email, password);
      req.session.admin = admin; // Store the admin in the session
      res.redirect('/admin/dashboard');
    }
  });

  app.get('/admin/dashboard', (req, res) => {
    const admin = req.session.admin;
    const products = productList.getProducts();

    const liveOrders = orderList.getLiveOrders();

    // Prepare an array of objects for the Handlebars template
    const ordersArray = liveOrders.map(order => {
      const partsArray = order.parts.map(part => {
        const product = productList.getProductById(part[0]);
        return {
          name: product.name,
          quantity: part[1],
          subtotal: product.price * part[1],
        };
      });

      const total = partsArray.reduce((acc, part) => acc + part.subtotal, 0);

      return {
        id: order.id,
        name: order.name,
        customer: {
          name: order.customer.name,
        },
        address: order.address,
        parts: partsArray,
        total: total,
      };
    });

    if (admin) {
      res.render('admin/dashboard', { pageTitle: 'Admin Dashboard', layout: 'layout', products: products, orders: ordersArray })
    } else {
      res.redirect('/admin/login');
    }
  });


  // Define a route to display the form for editing a product
  app.get('/admin/edit-product/:id', (req, res) => {
    if (req.session.admin) {
      const productId = Number(req.params.id);
      const product = productList.getProductById(productId);

      res.render('admin/edit-product', { product, pageTitle: 'Edit Product', layout: 'layout' });
    }
  });

  // Define a route to handle the form submission for editing a product
  app.post('/admin/edit-product/:id', (req, res) => {
    if (req.session.admin) {
      const productId = Number(req.params.id);
      const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
      };

      productList.updateProduct(productId, updatedProduct);

      // Redirect back to the dashboard
      res.redirect('/admin/dashboard');
    }
  });


  // Define a route to display the form for editing a product
  app.get('/admin/add-product', (req, res) => {
    if (req.session.admin) {
      res.render('admin/add-product', { pageTitle: 'New Product', layout: 'layout' });
    }
  });

  // Define a route to handle the form submission for editing a product
  app.post('/admin/add-product', (req, res) => {
    const product = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
    };

    productList.addProduct(product.name, product.description, product.price);

    // Redirect back to the product list or another appropriate page
    res.redirect('/admin/dashboard');
  });

  app.get('/admin/delete-product/:id', (req, res) => {
    if (req.session.admin) {
      const productId = Number(req.params.id);

      productList.deleteProduct(productId);
    }

    res.redirect('/admin/dashboard');
  });
};