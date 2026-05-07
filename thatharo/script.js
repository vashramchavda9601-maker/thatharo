const UNSPLASH_IXID = 'M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const UNSPLASH_IXLIB = 'rb-4.1.0';

function unsplashImage(photoId, { w, h, q = 80 } = {}) {
    const width = w ?? 800;
    const height = h ?? 1000;
    return `https://images.unsplash.com/photo-${photoId}?q=${q}&w=${width}&h=${height}&auto=format&fit=crop&ixlib=${UNSPLASH_IXLIB}&ixid=${UNSPLASH_IXID}`;
}

// Products Data - 10 Clothes (3 Pairs + 7 Singles)
const products = [
    // Pairs (3)
    {
        id: 1,
        name: "Fire Edition Set",
        price: 1450,
        image: unsplashImage("1736322969168-7105551d1798"),
        type: "pair",
        description: "Shirt + Pant Set"
    },
    {
        id: 2,
        name: "Neon Drop Set",
        price: 1380,
        image: unsplashImage("1773525912586-fbc51bbe0fdf"),
        type: "pair",
        description: "Oversize Shirt + Cargo"
    },
    {
        id: 3,
        name: "Street King Set",
        price: 1520,
        image: unsplashImage("1706287043719-3fad472e98a6"),
        type: "pair",
        description: "Graphic Tee + Jeans"
    },
    // Single Shirts (4)
    {
        id: 4,
        name: "Red Flame Shirt",
        price: 1299,
        image: unsplashImage("1773848090839-cde4f57e135a"),
        type: "shirt"
    },
    {
        id: 5,
        name: "Blue Neon Tee",
        price: 1249,
        image: unsplashImage("1758267928031-a87e5a5c6c5b"),
        type: "shirt"
    },
    {
        id: 6,
        name: "Black Out Shirt",
        price: 1320,
        image: unsplashImage("1742392133846-a8b416e81661"),
        type: "shirt"
    },
    {
        id: 7,
        name: "Purple Haze Tee",
        price: 1275,
        image: unsplashImage("1717201395230-d1e281d59f41"),
        type: "shirt"
    },
    // Single Pants (4)
    {
        id: 8,
        name: "Cargo Beast",
        price: 1499,
        image: unsplashImage("1754555009601-498e9873197e"),
        type: "pant"
    },
    {
        id: 9,
        name: "Slim Fit Black",
        price: 1350,
        image: unsplashImage("1749016750415-d0952eb0a221"),
        type: "pant"
    },
    {
        id: 10,
        name: "Neon Jogger",
        price: 1420,
        image: unsplashImage("1772521235788-efabff053656"),
        type: "pant"
    }
];

let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartModal = document.getElementById('cartModal');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const closeModal = document.querySelector('.close');
const cartIcon = document.querySelector('.cart-icon');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const loader = document.querySelector('.loader');
const ctaPrimary = document.querySelector('.cta-primary');
const ctaSecondary = document.querySelector('.cta-secondary');
const contactForm = document.querySelector('.contact-form');

// Load Products
function loadProducts() {
    productsGrid.innerHTML = '';
    const fallbackProductImage = unsplashImage("1706287043719-3fad472e98a6");
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='${fallbackProductImage}'">
                ${product.type === 'pair' ? '<div class="pair-badge">PAIR</div>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                ${product.description ? `<p class="product-desc">${product.description}</p>` : ''}
                <div class="product-price">₹${product.price}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> ADD TO BAG
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    showNotification(`${product.name} added to bag! 🔥`);
}

// Update Cart Display
function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Show Cart Modal
function showCart() {
    cartItems.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div style="padding: 2rem; text-align: center; color: #888;">Your bag is empty 😎</div>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; border-radius: 10px; object-fit: cover;">
                    <div>
                        <h4>${item.name}</h4>
                        <p>₹${item.price} x ${item.quantity}</p>
                    </div>
                </div>
                <div style="text-align: right;">
                    <strong>₹${itemTotal}</strong>
                    <br><small style="cursor: pointer; color: #ff0040;" onclick="removeFromCart(${item.id})">Remove</small>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    cartTotal.textContent = `₹${total.toLocaleString('hi-IN')}`;
    cartModal.style.display = 'block';
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showCart();
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #ff0040, #00d4ff);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event Listeners
cartIcon.addEventListener('click', showCart);
closeModal.addEventListener('click', () => cartModal.style.display = 'none');
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.style.display = 'none';
});

hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));

// Close mobile menu after clicking a link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
});

ctaPrimary.addEventListener('click', () => {
    document.getElementById('collection').scrollIntoView({ behavior: 'smooth' });
});

ctaSecondary.addEventListener('click', () => {
    document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Welcome to the family! 🔥');
    contactForm.reset();
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Featured Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}, 4000);

// Hide Loader & Initialize
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
        loadProducts();
    }, 2000);
});

// Add CSS for pair badge
const style = document.createElement('style');
style.textContent = `
    .pair-badge {
        position: absolute;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #ff0040, #00d4ff);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        box-shadow: 0 5px 15px rgba(255, 0, 64, 0.4);
        animation: pulse 2s infinite;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 0;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .product-desc {
        color: #b8b8b8;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }
`;
document.head.appendChild(style);
