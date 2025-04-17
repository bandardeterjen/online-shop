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
    const paginationContainer = document.querySelector('.pagination');
    const navLinks = document.querySelectorAll('.nav-link');
    const footerLinks = document.querySelectorAll('.footer-link');
    const contactForm = document.querySelector('.contact-form');
    const pages = document.querySelectorAll('.page');

    // Cart array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Pagination variables
    const productsPerPage = 8;
    let currentPage = 1;

    // Setup products (now with 12 products for pagination demo)
    const products = [
        {
            id: 1,
            title: 'Product 1',
            price: 150000,
            image: 'https://via.placeholder.com/300',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        },
        {
            id: 2,
            title: 'Product 2',
            price: 250000,
            image: 'https://via.placeholder.com/300',
            description: 'Vestibulum ante ipsum primis in faucibus orci luctus.'
        },
        {
            id: 3,
            title: 'Product 3',
            price: 350000,
            image: 'https://via.placeholder.com/300',
            description: 'Curabitur non nulla sit amet nisl tempus convallis.'
        },
        {
            id: 4,
            title: 'Product 4',
            price: 450000,
            image: 'https://via.placeholder.com/300',
            description: 'Pellentesque in ipsum id orci porta dapibus.'
        },
        {
            id: 5,
            title: 'Product 5',
            price: 550000,
            image: 'https://via.placeholder.com/300',
            description: 'Nulla quis lorem ut libero malesuada feugiat.'
        },
        {
            id: 6,
            title: 'Product 6',
            price: 650000,
            image: 'https://via.placeholder.com/300',
            description: 'Vivamus magna justo, lacinia eget consectetur sed.'
        },
        {
            id: 7,
            title: 'Product 7',
            price: 750000,
            image: 'https://via.placeholder.com/300',
            description: 'Cras ultricies ligula sed magna dictum porta.'
        },
        {
            id: 8,
            title: 'Product 8',
            price: 850000,
            image: 'https://via.placeholder.com/300',
            description: 'Donec sollicitudin molestie malesuada.'
        },
        {
            id: 9,
            title: 'Product 9',
            price: 950000,
            image: 'https://via.placeholder.com/300',
            description: 'Praesent sapien massa, convallis a pellentesque nec.'
        },
        {
            id: 10,
            title: 'Product 10',
            price: 1050000,
            image: 'https://via.placeholder.com/300',
            description: 'Curabitur arcu erat, accumsan id imperdiet et.'
        },
        {
            id: 11,
            title: 'Product 11',
            price: 1150000,
            image: 'https://via.placeholder.com/300',
            description: 'Mauris blandit aliquet elit, eget tincidunt nibh.'
        },
        {
            id: 12,
            title: 'Product 12',
            price: 1250000,
            image: 'https://via.placeholder.com/300',
            description: 'Proin eget tortor risus. Cras ultricies ligula.'
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

    // Render products for current page
    function renderProducts() {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = products.slice(startIndex, endIndex);

        productsContainer.innerHTML = productsToShow.map(product => `
            <div class="product" data-id="${product.id}">
                <img src="${product.image}" alt="${product.title}">
                <h2 class="product-title">${product.title}</h2>
                <p class="price">${formatRupiah(product.price)}</p>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `).join('');

        renderPagination();
    }

    // Render pagination buttons
    function renderPagination() {
        const totalPages = Math.ceil(products.length / productsPerPage);
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                currentPage = i;
                renderProducts();
            });
            paginationContainer.appendChild(button);
        }
    }

    // Switch between pages
    function switchPage(pageName) {
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.classList.contains(`${pageName}-page`)) {
                page.classList.add('active');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageName) {
                link.classList.add('active');
            }
        });

        // Scroll to top when switching pages
        window.scrollTo(0, 0);
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

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(link.dataset.page);
        });
    });

    // Footer links
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(link.dataset.page);
        });
    });

    // Contact form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.');
        contactForm.reset();
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

    // Add to cart buttons - delegated event listener
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

    // Initialize
    renderProducts();
    updateCart();
});
