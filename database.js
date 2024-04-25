// database.js

let products = [
    { id: 1, name: 'Handcrafted Necklace', price: 25.99, artisan: 'Jane Doe' },
    { id: 2, name: 'Wooden Sculpture', price: 49.99, artisan: 'John Smith' },
    // Add more sample products as needed
  ];
  
  const getAllProducts = () => {
    return products;
  };
  
  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };
  
  const addProduct = (product) => {
    products.push(product);
  };
  
  const updateProduct = (id, updatedProduct) => {
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
    }
  };
  
  const deleteProduct = (id) => {
    products = products.filter(product => product.id !== id);
  };
  
  module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
  };
  