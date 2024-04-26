// Get DOM elements
const modal = document.getElementById('add-product-modal');
const btn = document.getElementById('add-product-btn');
const span = document.querySelector('.close');
const productList = document.getElementById('product-list');
const addProductForm = document.getElementById('add-product-form');
const categoryLinks = document.querySelectorAll('#products-nav a');

// Function to toggle modal visibility
const toggleModal = () => {
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
};

// Event listeners
btn.addEventListener('click', toggleModal);
span.addEventListener('click', toggleModal);
window.addEventListener('click', (event) => {
    if (event.target === modal) toggleModal();
});

// Filter products by category
categoryLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const category = link.dataset.category;
        fetchProducts(category);
    });
});

// Fetch and display products
const fetchProducts = async (category = '') => {
    try {
        let url = '/api/products';
        if (category) url += `?category=${category}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Display products
const displayProducts = (products) => {
    productList.innerHTML = ''; // Clear existing content
    products.forEach(product => {
        const productCard = createProductCard(product);
        productList.appendChild(productCard);
    });
};

// Create a product card
const createProductCard = (product) => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    const name = document.createElement('h2');
    name.textContent = product.name || 'Name not provided';

    const price = document.createElement('p');
    price.textContent = `$${product.price || 'Price not provided'}`;

    const artisan = document.createElement('p');
    artisan.textContent = `By: ${product.artisan || 'Artisan not provided'}`;

    const category = document.createElement('p');
    category.textContent = `Category: ${product.category || 'Category not provided'}`;

    // Create image element and set its attributes
    const image = document.createElement('img');
    image.src = product.imageUrl || '/assets/default-image.jpg'; // Use default image if imageUrl not provided
    image.alt = product.name || 'Product Image';
    image.width = 160;
    image.height = 160;

    card.appendChild(name);
    card.appendChild(price);
    card.appendChild(artisan);
    card.appendChild(category);
    card.appendChild(image); // Append image to card

    return card;
};

// Add a new product
addProductForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(addProductForm);

    // Append other input field values to FormData
    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;
    const productArtisan = document.getElementById('product-artisan').value;
    const productCategory = document.getElementById('product-category').value;

    formData.append('name', productName);
    formData.append('price', productPrice);
    formData.append('artisan', productArtisan);
    formData.append('category', productCategory);

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Failed to add product');
        const newProduct = await response.json();
        const productCard = createProductCard(newProduct);
        productList.appendChild(productCard);
        addProductForm.reset();
        toggleModal(); // Close modal after adding product
    } catch (error) {
        console.error('Error:', error);
    }
});

// Fetch and display all products when the page loads
fetchProducts();