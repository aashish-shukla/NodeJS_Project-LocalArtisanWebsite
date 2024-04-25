document.addEventListener('DOMContentLoaded', () => {
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
        name.textContent = product.name;

        const price = document.createElement('p');
        price.textContent = `$${product.price}`;

        const artisan = document.createElement('p');
        artisan.textContent = `By: ${product.artisan}`;

        const category = document.createElement('p');
        category.textContent = `Category: ${product.category}`;

        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(artisan);
        card.appendChild(category);

        return card;
    };

    // Add a new product
    addProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = {
            name: document.getElementById('product-name').value,
            price: document.getElementById('product-price').value,
            artisan: document.getElementById('product-artisan').value,
            category: document.getElementById('product-category').value
        };
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Failed to add product');
            const newProduct = await response.json();
            const productCard = createProductCard(newProduct);
            productList.appendChild(productCard);
            addProductForm.reset();
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Fetch and display all products when the page loads
    fetchProducts();
});
