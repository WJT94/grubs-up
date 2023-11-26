// /model/ProductList.js
const Database = require('./Database');
const Product = require('./Product');

class ProductList extends Database {
  constructor(dbFilePath) {
    super(dbFilePath);
    const dbData = this.readDatabase();

    // Ensure "products" and "nextProductId" keys are initialized in the database
    if (!dbData.hasOwnProperty('products') || !dbData.hasOwnProperty('nextProductId')) {
      this.writeDatabase({ products: [], nextProductId: 1 });
      // Re-read the database after initializing to get the correct values
      const updatedData = this.readDatabase();
      this.products = updatedData.products || [];
      this.nextProductId = updatedData.nextProductId || 1;
    } else {
      this.products = dbData.products;
      this.nextProductId = dbData.nextProductId;
    }
  }

  addProduct(name, description, price, category) {
    const newProduct = new Product(this.nextProductId++, name, description, price, category);
    this.products.push(newProduct);
    this.setValue('nextProductId', this.nextProductId);
    this.setValue('products', this.products);
    return newProduct;
  }

  updateProduct(id, updatedInfo) {
    const productToUpdate = this.products.find(product => product.id === id);

    if (productToUpdate) {
      Object.assign(productToUpdate, updatedInfo);
      this.setValue('products', this.products);
      return productToUpdate;
    }

    return null;
  }

  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);

    if (index !== -1) {
      this.products.splice(index, 1);
      this.setValue('products', this.products);
      return true;
    }

    return false;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find(product => product.id === id) || null;
  }

  getProductByName(name) {
    return this.products.find(product => product.name === name) || null;
  }


}

module.exports = ProductList;
