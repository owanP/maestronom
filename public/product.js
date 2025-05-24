document.addEventListener('DOMContentLoaded', function() {
    // Initialize both filter types
    initFilters();
    loadProducts();
});

function initFilters() {
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadProducts();
        });
    });
    
    // Sort buttons
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadProducts();
        });
    });
}

async function loadProducts() {
    try {
        // Get active filters
        const category = document.querySelector('.category-btn.active').dataset.category;
        const sortType = document.querySelector('.sort-btn.active').dataset.sortType;
        
        // Fetch products with both filters
        const response = await fetch(`/api/products?category=${category}&selling_type=${sortType}`);
        const products = await response.json();
        
        // Display results
        displayProducts(products);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('products-container').innerHTML = '<p>Error loading products</p>';
    }
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<p>No products found matching your criteria</p>';
        return;
    }
    
    products.forEach(product => {
        container.innerHTML += `
            <div class="product" onclick="window.location='product-detail.html?id=${product.id}'">
                ${product.selling_type === 'promo' ? '<span class="promo-badge">PROMO</span>' : ''}
                ${product.image_url ? `<img src="${product.image_url}" class="product-image">` : ''}
                <h3>${product.name}</h3>
                <p class="price">
                    ${product.selling_type === 'promo' ? 
                        `<span class="original-price">$${product.price}</span> $${(product.price*0.9).toFixed(2)}` : 
                        `$${product.price}`}
                </p>
                <p>${product.description.substring(0, 80)}...</p>
            </div>
        `;
    });
}