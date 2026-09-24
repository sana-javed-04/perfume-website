/**
 * AURA ATELIER - Main Client Script
 * Complete Cart & Wishlist System with Toast Notice, Clickable Links & WhatsApp Checkout
 */

const WHATSAPP_PHONE_NUMBER = "15551234567";

const CART_STORAGE_KEY = "aura_user_cart";
const WISHLIST_STORAGE_KEY = "aura_user_wishlist";

let cartItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
let wishlistItems =
  JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY)) || [];

// ==========================================================================
// TOAST NOTIFICATION ENGINE (Chota sa stylish popup jab item add ho)
// ==========================================================================
window.showToast = function (message, icon = "✨") {
  let toastContainer = document.getElementById("auraToastContainer");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "auraToastContainer";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "aura-toast";
  toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  // Trigger entrance
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Auto remove after 3.2 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3200);
};

// ==========================================================================
// 1. CART CONTROLLER
// ==========================================================================
window.addToCart = function (
  id,
  name,
  price,
  size = "50ml",
  image = "/images/flora.jpg",
  qty = 1,
) {
  const existingIndex = cartItems.findIndex(
    (item) => item.id === id && item.size === size,
  );

  const targetLink = `/product.html?id=${id}`;

  if (existingIndex > -1) {
    cartItems[existingIndex].qty += qty;
  } else {
    cartItems.push({
      id,
      name,
      price: parseInt(price, 10),
      size,
      image,
      qty,
      link: targetLink,
    });
  }

  saveCart();
  updateCounters();
  renderCartDrawer();

  // Show luxury Toast Popup
  showToast(`${name} (${size}) added to your Bag!`, "🛍️");
};

window.updateCartQty = function (index, delta) {
  if (cartItems[index]) {
    cartItems[index].qty += delta;
    if (cartItems[index].qty <= 0) {
      const removedName = cartItems[index].name;
      cartItems.splice(index, 1);
      showToast(`${removedName} removed from Bag`, "🗑️");
    }
  }
  saveCart();
  updateCounters();
  renderCartDrawer();
};

window.removeFromCart = function (index) {
  if (cartItems[index]) {
    const removedName = cartItems[index].name;
    cartItems.splice(index, 1);
    showToast(`${removedName} removed from Bag`, "🗑️");
  }
  saveCart();
  updateCounters();
  renderCartDrawer();
};

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

function renderCartDrawer() {
  const container = document.getElementById("cartItemsContainer");
  const totalPriceEl = document.getElementById("cartTotalPrice");
  const countEl = document.getElementById("cartDrawerCount");

  if (!container) return;

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  if (countEl) countEl.textContent = totalQty;
  if (totalPriceEl)
    totalPriceEl.textContent = `Rs. ${totalPrice.toLocaleString()}`;

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="empty-drawer-state">
        <span>🛍️</span>
        <p>Your bag is currently empty.</p>
        <a href="/shop.html" class="btn-primary-sm" onclick="closeCartDrawer()">Explore Perfumes</a>
      </div>
    `;
    return;
  }

  container.innerHTML = cartItems
    .map((item, index) => {
      const targetLink = item.link || `/product.html?id=${item.id}`;

      return `
      <div class="drawer-item-row">
        <!-- Clickable Image -->
        <a href="${targetLink}" onclick="closeCartDrawer()">
          <img src="${item.image}" alt="${item.name}" class="drawer-item-img" onerror="this.src='/images/hero-bg.jpg'" style="cursor: pointer;" />
        </a>

        <div class="drawer-item-info">
          <!-- Clickable Title -->
          <h4>
            <a href="${targetLink}" onclick="closeCartDrawer()" class="wishlist-product-title-link">
              ${item.name}
            </a>
          </h4>
          <span class="drawer-item-meta">${item.size} • Rs. ${item.price.toLocaleString()}</span>
          
          <div class="drawer-qty-row">
            <button onclick="updateCartQty(${index}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="updateCartQty(${index}, 1)">+</button>
            <button class="remove-link" onclick="removeFromCart(${index})">Remove</button>
          </div>
        </div>
        <strong class="drawer-item-subtotal">Rs. ${(item.price * item.qty).toLocaleString()}</strong>
      </div>
    `;
    })
    .join("");
}

window.checkoutCartViaWhatsApp = function () {
  if (cartItems.length === 0) {
    showToast("Your shopping bag is empty!", "⚠️");
    return;
  }

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  let itemsText = "";
  cartItems.forEach((item, i) => {
    itemsText +=
      `${i + 1}. *${item.name}* (${item.size})%0A` +
      `   Quantity: ${item.qty} | Price: Rs. ${(item.price * item.qty).toLocaleString()}%0A`;
  });

  const msg =
    `*NEW ORDER FROM AURA ATELIER* 🛍️%0A%0A` +
    `*Order Summary:*%0A${itemsText}%0A` +
    `*Grand Total:* Rs. ${totalPrice.toLocaleString()}%0A%0A` +
    `Please share delivery address and payment details. Thank you!`;

  window.open(`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${msg}`, "_blank");
};

// ==========================================================================
// 2. WISHLIST CONTROLLER (Clickable Title & Image Navigation)
// ==========================================================================
window.toggleWishlist = function (id, name, price, image) {
  const index = wishlistItems.findIndex((item) => item.id === id);
  const targetLink = `/product.html?id=${id}`;

  if (index > -1) {
    const removedName = wishlistItems[index].name;
    wishlistItems.splice(index, 1);
    showToast(`${removedName} removed from Wishlist`, "🤍");
  } else {
    wishlistItems.push({
      id,
      name,
      price: parseInt(price, 10),
      image,
      link: targetLink,
    });
    showToast(`${name} saved to your Wishlist!`, "♥");
  }

  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
  updateCounters();
  renderWishlistDrawer();
};

function renderWishlistDrawer() {
  const container = document.getElementById("wishlistItemsContainer");
  const countEl = document.getElementById("wishlistDrawerCount");

  if (!container) return;
  if (countEl) countEl.textContent = wishlistItems.length;

  if (wishlistItems.length === 0) {
    container.innerHTML = `
      <div class="empty-drawer-state">
        <span>♥</span>
        <p>No perfumes saved in your wishlist yet.</p>
        <a href="/shop.html" class="btn-primary-sm" onclick="closeWishlistDrawer()">Browse Scents</a>
      </div>
    `;
    return;
  }

  container.innerHTML = wishlistItems
    .map((item) => {
      const targetLink = item.link || `/product.html?id=${item.id}`;

      return `
      <div class="drawer-item-row">
        <!-- Clickable Image -->
        <a href="${targetLink}" onclick="closeWishlistDrawer()">
          <img src="${item.image}" alt="${item.name}" class="drawer-item-img" onerror="this.src='/images/hero-bg.jpg'" style="cursor: pointer;" />
        </a>

        <div class="drawer-item-info">
          <!-- Clickable Title -->
          <h4>
            <a href="${targetLink}" onclick="closeWishlistDrawer()" class="wishlist-product-title-link">
              ${item.name}
            </a>
          </h4>
          <span class="drawer-item-meta">Rs. ${item.price.toLocaleString()}</span>
          
          <div style="display:flex; gap: 0.8rem; margin-top: 0.5rem; align-items: center;">
            <button class="btn-move-cart" onclick="addToCart('${item.id}', '${item.name}', ${item.price}, '50ml', '${item.image}'); toggleWishlist('${item.id}');">
              + Move to Bag
            </button>
            <button class="remove-link" onclick="toggleWishlist('${item.id}')">Remove</button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

function updateCounters() {
  const cartBadge = document.getElementById("cartCount");
  const wishBadge = document.getElementById("wishlistCount");

  const totalCartQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
  if (cartBadge) cartBadge.textContent = totalCartQty;
  if (wishBadge) wishBadge.textContent = wishlistItems.length;
}

// Drawers Toggle Handlers
window.openCartDrawer = function () {
  renderCartDrawer();
  document.getElementById("cartDrawer")?.classList.add("active");
  document.getElementById("cartOverlay")?.classList.add("active");
};
window.closeCartDrawer = function () {
  document.getElementById("cartDrawer")?.classList.remove("active");
  document.getElementById("cartOverlay")?.classList.remove("active");
};

window.openWishlistDrawer = function () {
  renderWishlistDrawer();
  document.getElementById("wishlistDrawer")?.classList.add("active");
  document.getElementById("wishlistOverlay")?.classList.add("active");
};
window.closeWishlistDrawer = function () {
  document.getElementById("wishlistDrawer")?.classList.remove("active");
  document.getElementById("wishlistOverlay")?.classList.remove("active");
};

// ==========================================================================
// 3. THEME TOGGLE
// ==========================================================================
function initTheme() {
  const savedTheme =
    localStorage.getItem("aura-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  setTheme(savedTheme);

  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current =
        document.documentElement.getAttribute("data-theme") || "dark";
      const nextTheme = current === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("aura-theme", theme);
  const iconSpan = document.querySelector("#theme-toggle .theme-icon");
  if (iconSpan) iconSpan.textContent = theme === "dark" ? "☀️" : "🌙";
}

// ==========================================================================
// 4. HERO SLIDER CONTROLLER
// ==========================================================================
class HeroSlider {
  constructor() {
    this.slides = document.querySelectorAll(".hero-slide");
    this.dots = document.querySelectorAll(".indicator-dot");
    this.timerFill = document.getElementById("heroTimerFill");
    this.ambientOrb = document.getElementById("ambientOrb");
    this.total = this.slides.length;
    this.current = 0;
    this.duration = 6000;
    this.startTime = null;
    this.animFrameId = null;

    if (this.total === 0) return;

    this.bindEvents();
    this.startCycle();
  }

  showSlide(index) {
    this.current = (index + this.total) % this.total;
    this.slides.forEach((slide, i) =>
      slide.classList.toggle("active", i === this.current),
    );
    this.dots.forEach((dot, i) =>
      dot.classList.toggle("active", i === this.current),
    );

    const activeSlide = this.slides[this.current];
    const themeColor =
      activeSlide.getAttribute("data-theme-color") ||
      "rgba(185, 142, 78, 0.22)";
    if (this.ambientOrb) {
      this.ambientOrb.style.background = `radial-gradient(circle, ${themeColor} 0%, transparent 70%)`;
    }
    this.startTime = performance.now();
  }

  nextSlide() {
    this.showSlide(this.current + 1);
  }
  prevSlide() {
    this.showSlide(this.current - 1);
  }

  bindEvents() {
    document
      .getElementById("heroNext")
      ?.addEventListener("click", () => this.nextSlide());
    document
      .getElementById("heroPrev")
      ?.addEventListener("click", () => this.prevSlide());
    this.dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        this.showSlide(parseInt(dot.getAttribute("data-index"), 10));
      });
    });
  }

  startCycle() {
    this.startTime = performance.now();
    const loop = (currentTime) => {
      const elapsed = currentTime - this.startTime;
      const progress = Math.min((elapsed / this.duration) * 100, 100);
      if (this.timerFill) this.timerFill.style.width = `${progress}%`;
      if (elapsed >= this.duration) this.nextSlide();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateCounters();
  if (document.querySelector(".hero-slide")) {
    new HeroSlider();
  }
});

// ==========================================================================
// 5. SHARED PRODUCT STORAGE HELPER (Single Dynamic Source of Truth)
// ==========================================================================
const DEFAULT_PRODUCTS = [
  {
    id: "flora-04",
    name: "Flora No. 04",
    category: "floral",
    price: 3800,
    volume: "50ml",
    badge: "Bestseller",
    categoryTag: "FLORAL • AMBER • SENSUAL",
    summary: "Bulgarian Damask Rose, Silken White Amber, Cashmere Musk",
    description:
      "A sensual ode to dawn-harvested Bulgarian Damask roses, wrapped in crystalline white amber, cashmere silk, and creamy Bourbon vanilla.",
    image: "/images/flora.jpg",
    gallery: [
      "/images/flora.jpg",
      "/images/hero-bg.jpg",
      "/images/ward_bottle1.jpg",
    ],
    notes: {
      top: "Sparkling Italian Bergamot, White Peach, Pink Peppercorn",
      heart: "Damask Rose Petals, Grasse Jasmine, French Violet",
      base: "White Ambergris, Warm Cashmere Woods, Bourbon Vanilla",
    },
    detailsLink: "/product.html?id=flora-04",
  },
  {
    id: "ward-royale",
    name: "Ward Royale",
    category: "oriental",
    price: 4200,
    volume: "50ml",
    badge: "Imperial Reserve",
    categoryTag: "ORIENTAL • SPICED • NOBLE",
    summary: "Sacred Taif Rose, Smoky Cambodi Agarwood, Golden Saffron",
    description:
      "An opulent composition honoring centuries of royal Middle Eastern distillation. Sacred Taif mountain rose oil fused with 25-year-old aged smoky Cambodi agarwood.",
    image: "/images/ward.jpg",
    gallery: [
      "/images/ward.jpg",
      "/images/ward_bottle1.jpg",
      "/images/ingredients-oud.jpg",
    ],
    notes: {
      top: "Taif Mountain Rose, Golden Kashmiri Saffron, Cardamom",
      heart: "Smoky Agarwood (Oud), Amber Resin, Moroccan Cedar",
      base: "Frankincense, Castoreum Accord, Dark Patchouli",
    },
    detailsLink: "/product.html?id=ward-royale",
  },
  {
    id: "oud-noir",
    name: "Oud Noir Absolu",
    category: "woody",
    price: 5500,
    volume: "50ml",
    badge: "Private Reserve",
    categoryTag: "WOODY • RESINOUS • MAJESTIC",
    summary: "Wild Assam Agarwood, Black Leather, Roasted Birch Bark",
    description:
      "Wild resinous Assam heartwood macerated with dark Tuscan leather, roasted birch, and black Bourbon vanilla. Deep, powerful projection.",
    image: "/images/ingredients-oud.jpg",
    gallery: [
      "/images/ingredients-oud.jpg",
      "/images/hero-bg.jpg",
      "/images/ward.jpg",
    ],
    notes: {
      top: "Black Pepper, Nutmeg, Smoky Birch",
      heart: "Dark Tuscan Leather, Roasted Cedar",
      base: "Pure Assam Agarwood, Smoked Vanilla",
    },
    detailsLink: "/product.html?id=oud-noir",
  },
  {
    id: "ambre-imperial",
    name: "Ambre Impérial",
    category: "oriental",
    price: 4600,
    volume: "50ml",
    badge: "Aged 120 Days",
    categoryTag: "AMBER • VANILLA • WARM",
    summary: "Smoked Ambergris, Tonka Bean, Madagascar Bourbon Vanilla",
    description:
      "Rich golden amber warm and sweet with rich roasted tonka beans and Bourbon vanilla.",
    image: "/images/ward_bottle1.jpg",
    gallery: [
      "/images/ward_bottle1.jpg",
      "/images/flora.jpg",
      "/images/hero-bg.jpg",
    ],
    notes: {
      top: "Warm Cardamom, Pink Pepper",
      heart: "Ambergris, Roasted Tonka Bean",
      base: "Bourbon Vanilla, Benzoin Resin",
    },
    detailsLink: "/product.html?id=ambre-imperial",
  },
  {
    id: "vetiver-celeste",
    name: "Vétiver Céleste",
    category: "woody",
    price: 3600,
    volume: "50ml",
    badge: "Classic",
    categoryTag: "EARTHY • GREEN • CRISP",
    summary: "Haitian Vetiver, Oakmoss, Pink Peppercorn, Cedarwood",
    description:
      "Crisp earthy green vetiver combined with damp oakmoss and fresh pink pepper.",
    image: "/images/hero-bg.jpg",
    gallery: [
      "/images/hero-bg.jpg",
      "/images/flora.jpg",
      "/images/ingredients-oud.jpg",
    ],
    notes: {
      top: "Pink Peppercorn, Bitter Orange",
      heart: "Haitian Vetiver, Cedarwood",
      base: "Damp Oakmoss, White Musk",
    },
    detailsLink: "/product.html?id=vetiver-celeste",
  },
  {
    id: "neroli-riviera",
    name: "Néroli Riviera",
    category: "fresh",
    price: 3400,
    volume: "50ml",
    badge: "Summer Edition",
    categoryTag: "FRESH • CITRUS • SPARKLING",
    summary: "Italian Bergamot, Orange Blossom, Sparkling Sea Salt",
    description:
      "A sparkling summer scent inspired by the French Riviera. Bright orange blossoms and fresh ocean breeze.",
    image: "/images/flora.jpg",
    gallery: ["/images/flora.jpg", "/images/ward.jpg", "/images/hero-bg.jpg"],
    notes: {
      top: "Italian Bergamot, Mandarin Orange",
      heart: "Neroli Blossom, Jasmine Petals",
      base: "Sea Salt Accord, White Amber",
    },
    detailsLink: "/product.html?id=neroli-riviera",
  },
];

window.getStoredProducts = function () {
  const data = localStorage.getItem("aura_custom_products");
  return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
};

window.saveStoredProducts = function (list) {
  localStorage.setItem("aura_custom_products", JSON.stringify(list));
};

// ==========================================================================
// MOBILE MENU DRAWER CONTROLLER
// ==========================================================================
window.toggleMobileMenu = function () {
  const drawer = document.getElementById("mobileSideDrawer");
  const overlay = document.getElementById("mobileDrawerOverlay");

  if (drawer && overlay) {
    const isActive = drawer.classList.contains("active");
    if (isActive) {
      drawer.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    } else {
      drawer.classList.add("active");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }
};
