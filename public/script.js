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
    price.textContent = `₹${product.price || 'Price not provided'}`;

    const artisan = document.createElement('p');
    artisan.textContent = `By: ${product.artisan || 'Artisan not provided'}`;

    const category = document.createElement('p');
    category.textContent = `Category: ${product.category || 'Category not provided'}`;

    // Create image element and set its attributes
    const image = document.createElement('img');
    image.src = product.imageUrl || '/assets/default-image.jpg'; // Use default image if imageUrl not provided
    image.alt = product.name || 'Product Image';
    image.width = 320;
    image.height = 320;

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

// Function to create an enlarged product card with blurry background
const createEnlargedProductCard = (product) => {
    const card = document.createElement('div');
    card.classList.add('product-card-enlarged'); // Add a class for styling

    const content = document.createElement('div');
    content.classList.add('product-content');

    const name = document.createElement('h2');
    name.textContent = product.name || 'Name not provided';

    const price = document.createElement('p');
    price.textContent = `₹${product.price || 'Price not provided'}`;

    const artisan = document.createElement('p');
    artisan.textContent = `By: ${product.artisan || 'Artisan not provided'}`;

    const category = document.createElement('p');
    category.textContent = `Category: ${product.category || 'Category not provided'}`;

    // Create image element and set its attributes
    const image = document.createElement('img');
    image.src = product.imageUrl || '/assets/default-image.jpg'; // Use default image if imageUrl not provided
    image.alt = product.name || 'Product Image';

    content.appendChild(name);
    content.appendChild(price);
    content.appendChild(artisan);
    content.appendChild(category);
    card.appendChild(content);
    card.appendChild(image); // Append image to card

    // Apply inline CSS for enlarged effect and blurry background
    card.style.position = 'fixed';
    card.style.top = '50%';
    card.style.left = '50%';
    card.style.transform = 'translate(-50%, -50%)';
    card.style.zIndex = '9999';
    card.style.background = 'rgba(0, 0, 0, 0.8)';
    card.style.padding = '20px';
    card.style.borderRadius = '10px';
    card.style.overflow = 'auto';
    card.style.maxWidth = '80%';
    card.style.maxHeight = '80%';

    content.style.color = '#fff';
    content.style.textAlign = 'center';
    content.style.marginBottom = '20px';

    name.style.fontSize = '28px';
    name.style.marginBottom = '10px';

    price.style.fontSize = '20px';
    price.style.fontWeight = 'bold';

    artisan.style.fontSize = '18px';

    category.style.fontSize = '18px';

    image.style.width = '100%';
    image.style.maxHeight = 'calc(100% - 150px)'; // Adjust height based on content size

    return card;
};

// Event listener to handle click on product card for enlarged effect
productList.addEventListener('click', (event) => {
    const card = event.target.closest('.product-card');
    if (card) {
        const product = getProductFromCard(card);
        const enlargedCard = createEnlargedProductCard(product);
        document.body.appendChild(enlargedCard);

        // Close enlarged card when clicked outside
        enlargedCard.addEventListener('click', (event) => {
            if (!event.target.closest('.product-content')) {
                enlargedCard.remove();
            }
        });
    }
});

// Function to retrieve product data from card
const getProductFromCard = (card) => {
    const product = {
        name: card.querySelector('h2').textContent,
        price: card.querySelector('p').textContent.replace('₹', ''),
        artisan: card.querySelectorAll('p')[1].textContent.replace('By: ', ''),
        category: card.querySelectorAll('p')[2].textContent.replace('Category: ', ''),
        imageUrl: card.querySelector('img').src
    };
    return product;
};

// Fetch and display all products when the page loads
fetchProducts();
