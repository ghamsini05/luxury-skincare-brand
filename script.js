// =========================================
//  LUMÉRA SKINCARE — PREMIUM SCRIPT
// =========================================

const products = [
  {
    id: 1,
    name: "Hydrating Cleanser",
    category: "cleanser",
    price: 28,
    badge: null,
    rating: 4.8,
    reviews: 142,
    description: "A gentle, sulfate-free formula that deeply cleanses while maintaining your skin's natural moisture barrier. Enriched with aloe vera and cucumber extract.",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Vitamin C Serum",
    category: "serum",
    price: 42,
    badge: "Bestseller",
    rating: 4.9,
    reviews: 317,
    description: "A brightening 15% vitamin C serum that fades dark spots, evens skin tone, and delivers a visible glow in just 2 weeks. Stabilized with vitamin E and ferulic acid.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Daily Moisturizer",
    category: "moisturizer",
    price: 35,
    badge: null,
    rating: 4.7,
    reviews: 208,
    description: "A lightweight, non-greasy moisturizer that provides 24-hour hydration. Formulated with hyaluronic acid, niacinamide, and ceramides for a plump, healthy complexion.",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Glow Repair Serum",
    category: "serum",
    price: 48,
    badge: "New",
    rating: 4.9,
    reviews: 94,
    description: "An overnight repair serum with retinol, peptides, and bakuchiol that visibly reduces fine lines and restores a luminous, youthful radiance while you sleep.",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Creamy Face Wash",
    category: "cleanser",
    price: 25,
    badge: null,
    rating: 4.6,
    reviews: 175,
    description: "A rich, creamy face wash that melts away impurities without stripping. With oat extract and shea butter, it leaves skin feeling soft and comfortable.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Soft Skin Moisturizer",
    category: "moisturizer",
    price: 38,
    badge: "Popular",
    rating: 4.8,
    reviews: 261,
    description: "A deeply nourishing moisturizer enriched with squalane, jojoba oil, and shea butter. Restores softness and suppleness even in the driest skin.",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1200&auto=format&fit=crop"
  }
];

// ===== STATE =====
let cart = [];
let currentCategory = "all";

// ===== DOM REFS =====
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const sortSelect = document.getElementById("sortSelect");
const cartCount = document.getElementById("cartCount");
const cartSidebarCount = document.getElementById("cartSidebarCount");
const cartItems = document.getElementById("cartItems");
const cartFooter = document.getElementById("cartFooter");
const cartTotal = document.getElementById("cartTotal");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const productCount = document.getElementById("productCount");
const noResults = document.getElementById("noResults");
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");
const modalOverlay = document.getElementById("modalOverlay");
const productModal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
const header = document.getElementById("header");

// ===== HEADER SCROLL =====
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
});

// ===== MOBILE NAV =====
menuBtn.addEventListener("click", () => mobileNav.classList.toggle("open"));
function closeMobileNav() { mobileNav.classList.remove("open"); }

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  toastMsg.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ===== CART SIDEBAR =====
function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}
document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// ===== CART LOGIC =====
function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else updateCartUI();
  }
}

function updateCartUI() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCount.textContent = total;
  cartSidebarCount.textContent = total;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    cartFooter.style.display = "none";
    return;
  }

  cartFooter.style.display = "block";
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p class="cart-price">$${item.price}</p>
        <div class="cart-item-qty">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartTotal.textContent = `$${totalPrice}`;
}

// ===== QUICK VIEW MODAL =====
function openModal(product) {
  modalContent.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <div class="modal-info">
      <p class="product-category">${product.category}</p>
      <h2>${product.name}</h2>
      <div class="product-rating" style="margin-bottom:16px">
        <span class="stars">${'★'.repeat(5)}</span>
        <span style="font-size:13px;color:var(--text-light)">${product.rating} (${product.reviews} reviews)</span>
      </div>
      <span class="price">$${product.price}</span>
      <p>${product.description}</p>
      <button class="add-cart modal-atc-btn">Add to Cart</button>
    </div>
  `;
  modalContent.querySelector(".modal-atc-btn").addEventListener("click", () => {
    addToCart(product);
    closeModal();
  });
  modalOverlay.classList.add("active");
  productModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("active");
  productModal.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

// ===== PRODUCTS RENDER =====
function displayProducts(list) {
  if (list.length === 0) {
    productGrid.innerHTML = "";
    noResults.style.display = "block";
    productCount.textContent = "No products found";
    return;
  }
  noResults.style.display = "none";
  productCount.textContent = `Showing ${list.length} product${list.length !== 1 ? "s" : ""}`;

  productGrid.innerHTML = "";
  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ""}
        <div class="product-actions">
          <button class="action-btn qv-btn" title="Quick View">👁</button>
          <button class="action-btn wl-btn" title="Wishlist">♡</button>
        </div>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <div class="product-rating">
          <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-footer">
          <span class="price">$${product.price}</span>
          <button class="add-cart atc-btn">Add to Cart</button>
        </div>
      </div>
    `;

    // Attach events directly — no inline onclick, no scope issues
    card.addEventListener("click", () => openModal(product));
    card.querySelector(".qv-btn").addEventListener("click", e => { e.stopPropagation(); openModal(product); });
    card.querySelector(".wl-btn").addEventListener("click", e => { e.stopPropagation(); showToast(`${product.name} saved to wishlist`); });
    card.querySelector(".atc-btn").addEventListener("click", e => { e.stopPropagation(); addToCart(product); });

    productGrid.appendChild(card);
  });
}

// ===== FILTER + SORT =====
function filterAndSort() {
  let result = [...products];
  const query = searchInput.value.toLowerCase().trim();

  if (currentCategory !== "all") {
    result = result.filter(p => p.category === currentCategory);
  }
  if (query) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }

  const sort = sortSelect.value;
  if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
  else if (sort === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));

  displayProducts(result);
}

// ===== EVENT LISTENERS =====
searchInput.addEventListener("input", () => {
  clearSearch.style.display = searchInput.value ? "block" : "none";
  filterAndSort();
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  clearSearch.style.display = "none";
  filterAndSort();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    filterAndSort();
  });
});

sortSelect.addEventListener("change", filterAndSort);

// ===== CONTACT FORM =====
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("Message sent! We'll get back to you soon.");
  e.target.reset();
});

// ===== NEWSLETTER FORM =====
document.getElementById("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("You're subscribed! Check your inbox for 10% off.");
  e.target.reset();
});

// ===== INIT =====
displayProducts(products);