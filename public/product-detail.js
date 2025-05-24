document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        fetchProductDetails(productId);
    } else {
        document.getElementById('product-detail-container').innerHTML = '<p>Product not found.</p>';
    }
});

async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const product = await response.json();
        displayProductDetails(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        document.getElementById('product-detail-container').innerHTML = `
            <p class="error">Failed to load product details.</p>
        `;
    }
}

function displayProductDetails(product) {
    const container = document.getElementById('product-detail-container');
    container.innerHTML = `
        <div class="product-detail">
            ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" class="product-image">` : ''}
            <h1>${product.name}</h1>
            <p class="price">Price: $${product.price}</p>
            <div class="description">
                <h3>Description</h3>
                <p>${product.description}</p>
            </div>
            <a href="product.html" class="back-button">Back to Products</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    const productId = new URLSearchParams(window.location.search).get('id');
    if (!productId) return showError();

    fetch(`/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById('product-detail').innerHTML = `
                <div class="product-detail-card">
                    ${product.image_url ? `<img src="${product.image_url}" class="detail-image">` : ''}
                    <div class="detail-info">
                        <h1>${product.name}</h1>
                        <p class="price">$${product.price}</p>
                        <div class="description">
                            <h3>Description</h3>
                            <p>${product.description}</p>
                        </div>
                        <a href="product.html" class="back-button">Back to Products</a>
                    </div>
                </div>
            `;
        })
        .catch(() => showError());
});

function showError() {
    document.getElementById('product-detail').innerHTML = `
        <div class="error-message">
            <p>Product not found</p>
            <a href="product.html" class="back-button">Back to Products</a>
        </div>
    `;
}