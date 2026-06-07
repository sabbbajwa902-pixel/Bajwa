// =============================================
// PRODUCT DATABASE
// =============================================

const products = [
    {
        id: 1,
        name: "Premium Cotton T-Shirt",
        category: "shirts",
        price: 49.99,
        originalPrice: 79.99,
        image: "👕",
        description: "Comfortable and stylish premium cotton shirt",
        badge: "Sale"
    },
    {
        id: 2,
        name: "Casual Slim Fit Shirt",
        category: "shirts",
        price: 59.99,
        originalPrice: 89.99,
        image: "👔",
        description: "Perfect for casual wear or office",
        badge: "Popular"
    },
    {
        id: 3,
        name: "Oxford White Dress Shirt",
        category: "shirts",
        price: 69.99,
        originalPrice: 99.99,
        image: "🧥",
        description: "Classic dress shirt for formal occasions",
        badge: "Premium"
    },
    {
        id: 4,
        name: "Striped Casual Shirt",
        category: "shirts",
        price: 54.99,
        originalPrice: 84.99,
        image: "👕",
        description: "Trendy striped design for everyday wear",
        badge: "New"
    },
    {
        id: 5,
        name: "Classic Blue Jeans",
        category: "pants",
        price: 79.99,
        originalPrice: 119.99,
        image: "👖",
        description: "Timeless denim jeans for any occasion",
        badge: "Sale"
    },
    {
        id: 6,
        name: "Black Slim Fit Pants",
        category: "pants",
        price: 64.99,
        originalPrice: 94.99,
        image: "👖",
        description: "Perfect fit for both casual and formal",
        badge: "Popular"
    },
    {
        id: 7,
        name: "Khaki Chinos",
        category: "pants",
        price: 59.99,
        originalPrice: 89.99,
        image: "👖",
        description: "Versatile chinos for smart casual look",
        badge: "New"
    },
    {
        id: 8,
        name: "Dark Grey Trouser",
        category: "pants",
        price: 69.99,
        originalPrice: 109.99,
        image: "👖",
        description: "Elegant grey trousers for formal wear",
        badge: "Premium"
    },
    {
        id: 9,
        name: "Limited Edition Graphic Tee",
        category: "new",
        price: 44.99,
        originalPrice: 64.99,
        image: "👕",
        description: "Exclusive limited edition design",
        badge: "New"
    },
    {
        id: 10,
        name: "Luxury Silk Shirt",
        category: "new",
        price: 89.99,
        originalPrice: 139.99,
        image: "🧥",
        description: "Premium silk fabric for ultimate comfort",
        badge: "New"
    },
    {
        id: 11,
        name: "Summer Cotton Pants",
        category: "new",
        price: 54.99,
        originalPrice: 84.99,
        image: "👖",
        description: "Lightweight perfect for summer",
        badge: "New"
    },
    {
        id: 12,
        name: "Athletic Performance Shirt",
        category: "new",
        price: 39.99,
        originalPrice: 59.99,
        image: "👕",
        description: "Breathable fabric for active lifestyle",
        badge: "New"
    }
];

// =============================================
// CART MANAGEMENT
// =============================================

let cart = JSON.parse(localStorage.getItem('bajwaCart')) || [];

function updateCart() {
    localStorage.setItem('bajwaCart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        updateCart();
    }
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        document.getElementById('subtotal').textContent = '$0.00';
        document.getElementById('total').textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${subtotal.toFixed(2)}`;
}

function openCart() {
    document.getElementById('cart-modal').classList.add('active');
    updateCartDisplay();
}

function closeCart() {
    document.getElementById('cart-modal').classList.remove('active');
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification(`Thank you for your order! Total: $${total.toFixed(2)}`);
    cart = [];
    updateCart();
    closeCart();
}

// =============================================
// PRODUCT RENDERING
// =============================================

function renderProducts(filter = 'all') {
    const productsGrid = document.getElementById('products-grid');
    
    let filteredProducts = products;
    if (filter !== 'all') {
        filteredProducts = products.filter(product => product.category === filter);
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.image}
                <div class="product-badge">${product.badge}</div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                    $${product.price.toFixed(2)}
                </div>
                <div class="product-footer">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="wishlist-btn" onclick="addToWishlist(${product.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// =============================================
// FILTER FUNCTIONALITY
// =============================================

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Filter products
            const filter = button.dataset.filter;
            renderProducts(filter);
        });
    });
}

// =============================================
// CATEGORY NAVIGATION
// =============================================

function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const filter = card.dataset.filter;
            const filterButtons = document.querySelectorAll('.filter-btn');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            const activeButton = Array.from(filterButtons).find(btn => btn.dataset.filter === filter);
            if (activeButton) {
                activeButton.classList.add('active');
            }
            
            renderProducts(filter);
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// =============================================
// NAVIGATION & HAMBURGER MENU
// =============================================

function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const cartIconLink = document.querySelector('.cart-icon');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Cart icon click handler
    cartIconLink.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });
}

// =============================================
// CONTACT FORM HANDLING
// =============================================

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;
            
            // In a real application, you would send this data to a server
            console.log('Contact Form Data:', { name, email, message });
            
            showNotification('Thank you! We\'ll get back to you soon.');
            contactForm.reset();
        });
    }
}

// =============================================
// NEWSLETTER SUBSCRIPTION
// =============================================

function handleNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    console.log('Newsletter subscription:', email);
    showNotification('Successfully subscribed to our newsletter!');
    event.target.reset();
}

// =============================================
// WISHLIST FUNCTIONALITY
// =============================================

let wishlist = JSON.parse(localStorage.getItem('bajwaWishlist')) || [];

function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    const isInWishlist = wishlist.some(item => item.id === productId);

    if (isInWishlist) {
        wishlist = wishlist.filter(item => item.id !== productId);
        showNotification(`Removed from wishlist`);
    } else {
        wishlist.push(product);
        showNotification(`${product.name} added to wishlist!`);
    }

    localStorage.setItem('bajwaWishlist', JSON.stringify(wishlist));
}

// =============================================
// NOTIFICATION SYSTEM
// =============================================

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #000;
        color: #d4af37;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 999;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// =============================================
// SCROLL ANIMATIONS
// =============================================

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe product cards and feature cards
    document.querySelectorAll('.product-card, .feature, .category-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // Render products
    renderProducts();
    
    // Setup event listeners
    setupFilters();
    setupCategoryCards();
    setupNavigation();
    setupContactForm();
    setupScrollAnimations();
    
    // Initialize cart count
    updateCartCount();
    
    // Close cart when clicking outside
    document.getElementById('cart-modal').addEventListener('click', (e) => {
        if (e.target.id === 'cart-modal') {
            closeCart();
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && !href.includes('cart')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    console.log('Bajwa Clothes - E-commerce website loaded successfully!');
});

// =============================================
// UTILITY FUNCTIONS
// =============================================

// Search products (for future enhancement)
function searchProducts(query) {
    return products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
}

// Sort products
function sortProducts(sortBy) {
    let sorted = [...products];
    
    switch(sortBy) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
            sorted = sorted.filter(p => p.badge === 'New');
            break;
    }
    
    return sorted;
}
