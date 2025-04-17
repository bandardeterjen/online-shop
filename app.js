document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cartIcon = document.querySelector('.cart-icon');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartContent = document.querySelector('.cart-content');
    const cartTotal = document.querySelector('.cart-total');
    const cartCount = document.querySelector('.cart-count');
    const clearCartBtn = document.querySelector('.clear-cart');
    const checkoutBtn = document.querySelector('.checkout');
    const productsContainer = document.querySelector('.products');
    const productModal = document.querySelector('.product-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalBody = document.querySelector('.modal-body');

    // Cart array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Setup products
    const products = [
        {
            id: 1,
            title: 'Product 1',
            price: 150000,
            image: 'https://via.placeholder.com/300',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.'
        },
        {
            id: 2,
            title: 'Product 2',
            price: 250000,
            image: 'https://via.placeholder.com/300',
            description: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.'
        },
        {
            id: 3,
            title: 'Product 3',
            price: 350000,
            image: 'https://via.placeholder.com/300',
            description: 'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Cras ultricies ligula sed magna dictum porta. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.'
        },
        {
            id: 4,
            title: 'Product 4',
            price: 450000,
            image: 'https://via.placeholder.com/300',
            description: 'Pellentesque in ipsum id orci porta dapibus. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Vivamus suscipit tortor eget felis porttitor volutpat.'
        }
    ];

    // Format price to Rupiah
    function formatRupiah(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update cart UI
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.amount, 0);
        cartCount.textContent = totalItems;

        // Update cart items
        cartContent.innerHTML = cart.map(item => {
            const product = products.find(p => p.id === item.id);
            return `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="cart-item-info">
                        <h4>${product.title}</h4>
                        <p class="price">${formatRupiah(product.price)}</p>
                        <div class="cart-item-amount">
                            <i class="fas fa-minus decrease"></i>
                            <span>${item.amount}</span>
                            <i class="fas fa-plus increase"></i>
                        </div>
                    </div>
                    <i class="fas fa-trash cart-item-remove"></i>
                </div>
            `;
        }).join('');

        // Update cart total
        const total = cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product.price * item.amount);
        }, 0);
        cartTotal.textContent = formatRupiah(total);

        // Save cart to localStorage
        saveCart();
    }

    // Add to cart
    function addToCart(id) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.amount += 1;
        } else {
            cart.push({ id, amount: 1 });
        }

        updateCart();
    }

    // Remove from cart
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }

    // Increase item amount
    function increaseAmount(id) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.amount += 1;
            updateCart();
        }
    }

    // Decrease item amount
    function decreaseAmount(id) {
        const item = cart.find(item => item.id === id);
        if (item) {
            if (item.amount > 1) {
                item.amount -= 1;
            } else {
                removeFromCart(id);
            }
            updateCart();
        }
    }

    // Clear cart
    function clearCart() {
        cart = [];
        updateCart();
    }

    // Show product details
    function showProductDetails(id) {
        const product = products.find(p => p.id === id);
        if (product) {
            modalBody.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <div>
                    <h2>${product.title}</h2>
                    <p class="price">${formatRupiah(product.price)}</p>
                    <p>${product.description}</p>
                    <button class="add-to-cart-modal" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            productModal.style.display = 'flex';
        }
    }

    // Checkout function
    function checkout() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const phoneNumber = '6285773009666';
        let message = 'Halo, saya ingin memesan:\n\n';

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            message += `${product.title} - ${item.amount} x ${formatRupiah(product.price)}\n`;
        });

        const total = cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product.price * item.amount);
        }, 0);

        message += `\nTotal: ${formatRupiah(total)}\n\nTerima kasih!`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    }

    // Event Listeners
    cartIcon.addEventListener('click', () => {
        cartOverlay.style.display = 'flex';
    });

    closeCart.addEventListener('click', () => {
        cartOverlay.style.display = 'none';
    });

    clearCartBtn.addEventListener('click', clearCart);
    checkoutBtn.addEventListener('click', checkout);

    closeModal.addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            cartOverlay.style.display = 'none';
        }
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
    });

    // Add to cart buttons
    productsContainer.addEventListener('click', (e) => {
        // Product title click
        if (e.target.classList.contains('product-title')) {
            const productId = parseInt(e.target.closest('.product').dataset.id);
            showProductDetails(productId);
        }

        // Add to cart button click
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.closest('.product').dataset.id);
            addToCart(productId);
        }
    });

    // Cart item interactions
    cartContent.addEventListener('click', (e) => {
        // Remove item
        if (e.target.classList.contains('cart-item-remove')) {
            const productId = parseInt(e.target.closest('.cart-item').dataset.id);
            removeFromCart(productId);
        }

        // Increase amount
        if (e.target.classList.contains('increase')) {
            const productId = parseInt(e.target.closest('.cart-item').dataset.id);
            increaseAmount(productId);
        }

        // Decrease amount
        if (e.target.classList.contains('decrease')) {
            const productId = parseInt(e.target.closest('.cart-item').dataset.id);
            decreaseAmount(productId);
        }
    });

    // Modal add to cart button
    modalBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-modal')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
            productModal.style.display = 'none';
        }
    });

    // Initialize cart
    updateCart();
});
