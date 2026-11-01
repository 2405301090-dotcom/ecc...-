// ========================================================
// PRODUCTS DATA REPOSITORY
// ========================================================
const PRODUCTS = [
  {
    id: 1,
    title: 'Coconut Coir Pot',
    category: 'indoor',
    price: 12.99,
    img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
    emoji: '🪴',
    badge: 'Best Seller',
    desc: 'Perfect for small indoor plants. Made from compressed coconut fiber.'
  },
  {
    id: 2,
    title: 'Bamboo Fiber Planter',
    category: 'outdoor',
    price: 18.99,
    img: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=600&q=80',
    emoji: '🏺',
    badge: null,
    desc: 'Sturdy and weather-resistant. Ideal for balcony and garden use.'
  },
  {
    id: 3,
    title: 'Rice Husk Mini Pot',
    category: 'indoor',
    price: 8.49,
    img: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80',
    emoji: '🌱',
    badge: 'Eco Pick',
    desc: 'Compact and charming. Great for succulents, ferns, and cacti.'
  },
  {
    id: 4,
    title: 'Jute Hanging Basket',
    category: 'hanging',
    price: 22.99,
    img: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=600&q=80',
    emoji: '🌿',
    badge: null,
    desc: 'Hand-woven jute basket with a waterproof coconut liner.'
  },
  {
    id: 5,
    title: 'Peat-Free Starter Kit',
    category: 'seed-starter',
    price: 14.99,
    img: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=600&q=80',
    emoji: '🌾',
    badge: null,
    desc: 'Set of 24 biodegradable seed pots. Plant directly into soil!'
  },
  {
    id: 6,
    title: 'Organic Clay Planter',
    category: 'outdoor',
    price: 26.99,
    img: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=600&q=80',
    emoji: '🪨',
    badge: 'New',
    desc: 'Hand-thrown organic clay, fired at low temp. Classic and timeless.'
  }
];

// ========================================================
// ROBUST IMAGE ERROR HANDLERS (SOLVES ANY IMAGE ERROR)
// ========================================================
function handleProductImgError(img, emoji, color1 = '#a8d5a2', color2 = '#6b9e6b') {
  // Prevent infinite loop if already replaced
  if (img.dataset.hasFailed) return;
  img.dataset.hasFailed = "true";

  const parent = img.parentElement;
  if (!parent) return;

  const fallback = document.createElement('div');
  fallback.className = 'product-fallback-box';
  fallback.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
  fallback.innerHTML = `
    <div class="product-fallback-emoji">${emoji || '🪴'}</div>
    <div class="product-fallback-text">Eco Handcrafted Pot</div>
  `;

  img.style.display = 'none';
  parent.appendChild(fallback);
}

function handleAboutImgError(img) {
  if (img.dataset.hasFailed) return;
  img.dataset.hasFailed = "true";

  const parent = img.parentElement;
  if (!parent) return;

  img.style.display = 'none';
  const svgPlaceholder = document.createElement('div');
  svgPlaceholder.className = 'about-img-placeholder';
  svgPlaceholder.innerHTML = `
    <div class="eco-illustration">
      <div class="pot-svg">
        <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" style="width:200px; height:auto;">
          <ellipse cx="100" cy="200" rx="60" ry="12" fill="#c8b99a" opacity="0.3"/>
          <path d="M50 100 L60 190 Q100 200 140 190 L150 100 Z" fill="#d4a574" stroke="#b8956a" stroke-width="2"/>
          <path d="M50 100 Q100 85 150 100 Q100 115 50 100" fill="#c49564"/>
          <path d="M100 95 Q95 60 85 40 Q80 30 90 25 Q95 22 100 30 Q105 22 110 25 Q120 30 115 40 Q105 60 100 95" fill="#4a7c59"/>
          <path d="M100 80 Q80 55 65 50 Q55 47 60 40 Q63 35 70 42 Q80 50 100 80" fill="#5a9c6a"/>
          <path d="M100 80 Q120 55 135 50 Q145 47 140 40 Q137 35 130 42 Q120 50 100 80" fill="#5a9c6a"/>
        </svg>
      </div>
    </div>
  `;
  parent.appendChild(svgPlaceholder);
}

// ========================================================
// CART STATE & STORAGE
// ========================================================
let cart = [];

function loadCart() {
  try {
    const saved = localStorage.getItem('ecopot_cart');
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (err) {
    cart = [];
  }
  updateCartUI();
}

function saveCart() {
  try {
    localStorage.setItem('ecopot_cart', JSON.stringify(cart));
  } catch (err) {
    console.error('Failed to save cart', err);
  }
}

// ========================================================
// ADD TO CART & CART OPERATIONS
// ========================================================
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      img: product.img,
      emoji: product.emoji,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();

  // Animate badge
  triggerBadgeBump();

  // Show Toast
  showToast(`🌿 <strong>${product.title}</strong> added to cart!`, true);
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  const item = cart.find(i => i.id === productId);
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();

  if (item) {
    showToast(`Removed ${item.title} from cart.`);
  }
}

function clearCart() {
  if (cart.length === 0) return;
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    saveCart();
    updateCartUI();
    showToast('Your cart has been cleared.');
  }
}

// ========================================================
// UPDATE CART UI & CALCULATIONS
// ========================================================
function updateCartUI() {
  const navBadge = document.getElementById('navCartCount');
  const floatBadge = document.getElementById('floatingCartBadge');
  const headerCount = document.getElementById('cartHeaderCount');
  const itemsContainer = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const clearBtn = document.getElementById('clearCartBtn');

  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Update badges
  if (navBadge) navBadge.textContent = totalCount;
  if (floatBadge) floatBadge.textContent = totalCount;
  if (headerCount) headerCount.textContent = `(${totalCount} ${totalCount === 1 ? 'item' : 'items'})`;

  // Update Summary
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;

  // Update Checkout Modal Previews
  const previewCount = document.getElementById('checkoutItemCount');
  const previewTotal = document.getElementById('checkoutTotal');
  if (previewCount) previewCount.textContent = totalCount;
  if (previewTotal) previewTotal.textContent = `$${subtotal.toFixed(2)}`;

  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
    checkoutBtn.style.opacity = cart.length === 0 ? '0.6' : '1';
    checkoutBtn.style.cursor = cart.length === 0 ? 'not-allowed' : 'pointer';
  }

  if (clearBtn) {
    clearBtn.style.display = cart.length === 0 ? 'none' : 'block';
  }

  // Render Items List
  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🌱</div>
        <h4>Your cart is empty</h4>
        <p>Explore our handcrafted biodegradable pots and start your green journey.</p>
        <button class="btn btn-sm" onclick="closeCart(); document.getElementById('products').scrollIntoView({behavior:'smooth'});">
          Shop Eco Pots
        </button>
      </div>
    `;
    return;
  }

  itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img 
        src="${item.img}" 
        alt="${item.title}" 
        class="cart-item-img" 
        onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'68\\' height=\\'68\\' viewBox=\\'0 0 68 68\\'><rect width=\\'68\\' height=\\'68\\' fill=\\'%23b5d6a7\\'/><text x=\\'50%\\' y=\\'55%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-size=\\'28\\'>🪴</text></svg>';"
      />
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)" aria-label="Decrease quantity">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove item">
        🗑️
      </button>
    </div>
  `).join('');
}

function triggerBadgeBump() {
  const badges = document.querySelectorAll('.cart-count-badge, .floating-cart-badge');
  badges.forEach(b => {
    b.classList.remove('bump');
    void b.offsetWidth; // Force reflow
    b.classList.add('bump');
  });
}

// ========================================================
// CART DRAWER TOGGLE (OPEN / CLOSE)
// ========================================================
const cartDrawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
const openCartBtn = document.getElementById('cartToggleBtn');
const floatingCartBtn = document.getElementById('floatingCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');

function openCart() {
  if (cartDrawer && cartBackdrop) {
    cartDrawer.classList.add('open');
    cartBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  if (cartDrawer && cartBackdrop) {
    cartDrawer.classList.remove('open');
    cartBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

if (openCartBtn) openCartBtn.addEventListener('click', openCart);
if (floatingCartBtn) floatingCartBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

// Close on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCart();
    closeCheckout();
  }
});

// Clear cart button listener
const clearCartBtn = document.getElementById('clearCartBtn');
if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

// ========================================================
// CHECKOUT MODAL & ORDER PLACEMENT
// ========================================================
const checkoutModal = document.getElementById('checkoutModal');
const checkoutBtn = document.getElementById('checkoutBtn');
const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const checkoutFormContent = document.getElementById('checkoutFormContent');
const checkoutSuccess = document.getElementById('checkoutSuccess');

function openCheckout() {
  if (cart.length === 0) {
    showToast('Your cart is empty! Please add a pot first.');
    return;
  }
  closeCart();
  if (checkoutModal) {
    checkoutModal.classList.add('open');
    if (checkoutFormContent) checkoutFormContent.style.display = 'block';
    if (checkoutSuccess) checkoutSuccess.style.display = 'none';
    document.body.style.overflow = 'hidden';
  }
}

function closeCheckout() {
  if (checkoutModal) {
    checkoutModal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);
if (continueShoppingBtn) {
  continueShoppingBtn.addEventListener('click', () => {
    closeCheckout();
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  });
}

function handlePlaceOrder(e) {
  e.preventDefault();
  const orderId = `ECO-${Math.floor(10000 + Math.random() * 90000)}`;
  const confirmedOrderId = document.getElementById('confirmedOrderId');
  if (confirmedOrderId) confirmedOrderId.textContent = `#${orderId}`;

  // Clear cart
  cart = [];
  saveCart();
  updateCartUI();

  // Show success screen inside modal
  if (checkoutFormContent) checkoutFormContent.style.display = 'none';
  if (checkoutSuccess) checkoutSuccess.style.display = 'block';

  showToast(`🎉 Order #${orderId} confirmed! Thank you!`);
}

// ========================================================
// TOAST NOTIFICATION SYSTEM
// ========================================================
function showToast(message, withCartLink = false) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span>${message}</span>
    ${withCartLink ? `<span class="toast-link" onclick="openCart()">View Cart</span>` : ''}
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, 3500);
}

// ========================================================
// NAVBAR SCROLL & MOBILE MENU
// ========================================================
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ========================================================
// ANIMATED COUNTERS
// ========================================================
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
};

const fadeElements = document.querySelectorAll(
  '.product-card, .benefit-card, .testimonial-card, .process-step, .impact-card, .about-feature, .faq-item'
);

fadeElements.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 60);
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach(el => fadeObserver.observe(el));

const counterElements = document.querySelectorAll('.stat-num, .impact-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.getAttribute('data-target'), 10);
      if (!isNaN(target)) {
        animateCounter(entry.target, target);
      }
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

counterElements.forEach(el => counterObserver.observe(el));

// ========================================================
// PRODUCT FILTERS
// ========================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    productCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 30);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 250);
      }
    });
  });
});

// ========================================================
// FAQ ACCORDION
// ========================================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    faqItems.forEach(i => i.classList.remove('active'));
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// ========================================================
// NEWSLETTER & CONTACT HANDLERS
// ========================================================
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const btn = e.target.querySelector('button');
  const originalText = btn.textContent;

  btn.textContent = '✓ Subscribed!';
  btn.style.background = '#2d5a3a';
  btn.style.color = '#fff';
  input.value = '';

  showToast('🌱 Welcome to the eco family! Check your inbox for 15% off.');

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.style.color = '';
  }, 3000);
}

function handleContactSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#2d5a3a';

  e.target.reset();
  showToast('📬 Message sent! We will reply within 24 hours.');

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
  }, 3000);
}

// ========================================================
// INITIALIZE ON DOM READY
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
});
