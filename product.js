/**
 * AURA ATELIER - Dynamic Product Detail Page Engine
 * Handles per-product unique reviews, live stock indicator, gallery, and cart integration.
 */

let currentPerfume = null;
let currentSelectedSize = "50ml";
let currentEffectivePrice = 0;

// Unique, product-specific initial reviews dictionary
const PRODUCT_SPECIFIC_DEFAULT_REVIEWS = {
  "flora-04": [
    {
      author: "Sarah M. (Lahore)",
      stars: 5,
      comment:
        "The sweet Bulgarian rose and soft vanilla make this my absolute signature. It lasts over 14 hours on fabric without feeling overpowering!",
    },
    {
      author: "Ayesha K. (Karachi)",
      stars: 5,
      comment:
        "Very delicate and expensive-smelling floral trail. Received multiple compliments at an evening dinner.",
    },
  ],
  "ward-royale": [
    {
      author: "Daniyal H. (Islamabad)",
      stars: 5,
      comment:
        "The Taif mountain rose opening blended with smoky agarwood is majestic. Easily lasts through an entire 16-hour workday.",
    },
    {
      author: "Rehan T. (Peshawar)",
      stars: 5,
      comment:
        "Royal and dark. If you appreciate authentic Middle Eastern oud with natural saffron, this is pure perfection.",
    },
  ],
  "oud-noir": [
    {
      author: "Usman B. (Rawalpindi)",
      stars: 5,
      comment:
        "Deep, resinous Assam oud and rich leather notes. Very strong projection, definitely made for winter nights.",
    },
    {
      author: "Zain A. (Faisalabad)",
      stars: 4,
      comment:
        "Intense, masculine, and sophisticated. Just 2 sprays are enough to leave a strong projection all day.",
    },
  ],
  "ambre-imperial": [
    {
      author: "Hamza S. (Multan)",
      stars: 5,
      comment:
        "Warm, sweet ambergris paired with roasted tonka beans and Bourbon vanilla. Cozy and extremely long-lasting.",
    },
    {
      author: "Maryam N. (Lahore)",
      stars: 5,
      comment:
        "Reminds me of luxury niche Parisian perfumes. The drydown after 4 hours is heavenly.",
    },
  ],
  "vetiver-celeste": [
    {
      author: "Bilal W. (Sialkot)",
      stars: 5,
      comment:
        "Clean, earthy Haitian vetiver with crisp pink peppercorn. Perfect fresh office wear fragrance.",
    },
    {
      author: "Farhan D. (Karachi)",
      stars: 4,
      comment:
        "Very refreshing green notes with cedarwood backbone. Great alternative to heavy sweet scents.",
    },
  ],
  "neroli-riviera": [
    {
      author: "Nadia P. (Islamabad)",
      stars: 5,
      comment:
        "Sparkling Italian bergamot and neroli flowers with a salty sea breeze finish. Ideal summer refresher.",
    },
    {
      author: "Kashif R. (Lahore)",
      stars: 5,
      comment:
        "Crisp and uplifting. Feels like stepping into a fresh Mediterranean citrus garden.",
    },
  ],
};

// URL Query Param reader (e.g. ?id=ward-royale)
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function loadDynamicProduct() {
  const productId = getQueryParam("id") || "flora-04";
  const allProducts = window.getStoredProducts
    ? window.getStoredProducts()
    : [];

  currentPerfume = allProducts.find((p) => p.id === productId);

  if (!currentPerfume) {
    currentPerfume = allProducts[0] || {
      id: "flora-04",
      name: "Flora No. 04",
      price: 3800,
      stock: 25,
      category: "floral",
      categoryTag: "FLORAL • AMBER • SENSUAL",
      badge: "Bestseller",
      summary: "Bulgarian Damask Rose, White Amber, Sweet Vanilla",
      image: "/images/flora.jpg",
    };
  }

  // Update Metadata & Titles
  const pageTitle = document.getElementById("pageTitle");
  if (pageTitle)
    pageTitle.textContent = `${currentPerfume.name} | AURA ATELIER`;

  const bcName = document.getElementById("bcProductName");
  if (bcName) bcName.textContent = currentPerfume.name;

  const dynName = document.getElementById("dynName");
  if (dynName) dynName.textContent = currentPerfume.name;

  const dynCategory = document.getElementById("dynCategory");
  if (dynCategory)
    dynCategory.textContent =
      currentPerfume.categoryTag || currentPerfume.category.toUpperCase();

  const dynBadge = document.getElementById("dynBadge");
  if (dynBadge)
    dynBadge.textContent = currentPerfume.badge || "EXTRAIT DE PARFUM";

  const dynDesc = document.getElementById("dynDescription");
  if (dynDesc)
    dynDesc.textContent = currentPerfume.description || currentPerfume.summary;

  // Live Stock Indicator
  const stockCount =
    currentPerfume.stock !== undefined ? currentPerfume.stock : 25;
  const stockPill = document.getElementById("dynStockPill");
  const addToBagBtn = document.querySelector(".btn-direct-order");

  if (stockPill) {
    if (stockCount > 0) {
      stockPill.textContent = `Only ${stockCount} Left in Stock`;
      stockPill.className = "stock-pill stock-ok";
      if (addToBagBtn) {
        addToBagBtn.disabled = false;
        addToBagBtn.style.opacity = "1";
        addToBagBtn.style.cursor = "pointer";
      }
    } else {
      stockPill.textContent = "Sold Out";
      stockPill.className = "stock-pill stock-low";
      if (addToBagBtn) {
        addToBagBtn.disabled = true;
        addToBagBtn.style.opacity = "0.5";
        addToBagBtn.style.cursor = "not-allowed";
      }
    }
  }

  // Base Price setup
  currentEffectivePrice = currentPerfume.price;
  const displayPrice = document.getElementById("displayPrice");
  if (displayPrice)
    displayPrice.textContent = `Rs. ${currentEffectivePrice.toLocaleString()}`;

  // Scent Notes Pyramid Setup
  const topNotes = document.getElementById("dynTopNotes");
  const heartNotes = document.getElementById("dynHeartNotes");
  const baseNotes = document.getElementById("dynBaseNotes");

  if (currentPerfume.notes) {
    if (topNotes)
      topNotes.textContent =
        currentPerfume.notes.top || "Sparkling Bergamot, Pink Pepper";
    if (heartNotes)
      heartNotes.textContent =
        currentPerfume.notes.heart || "Damask Rose, Precious Jasmine";
    if (baseNotes)
      baseNotes.textContent =
        currentPerfume.notes.base || "Aged Oud, White Amber, Bourbon Vanilla";
  } else {
    if (topNotes) topNotes.textContent = currentPerfume.summary;
    if (heartNotes)
      heartNotes.textContent =
        "Heart notes distilled from hand-picked botanical extracts";
    if (baseNotes)
      baseNotes.textContent =
        "Deep aged ambergris and natural essential woods lasting 16+ hours";
  }

  // Gallery Setup
  const galleryImages =
    currentPerfume.gallery && currentPerfume.gallery.length > 0
      ? currentPerfume.gallery
      : [
          currentPerfume.image || "/images/flora.jpg",
          "/images/hero-bg.jpg",
          "/images/ward_bottle1.jpg",
        ];

  const mainImg = document.getElementById("mainProductImg");
  if (mainImg) {
    mainImg.src = galleryImages[0];
  }

  const thumbContainer = document.getElementById("dynThumbnailsContainer");
  if (thumbContainer) {
    thumbContainer.innerHTML = galleryImages
      .map(
        (imgSrc, idx) => `
      <div class="thumb-box ${idx === 0 ? "active" : ""}" onclick="switchDynamicImage('${imgSrc}', this)">
        <img src="${imgSrc}" alt="${currentPerfume.name} angle ${idx + 1}" onerror="this.src='/images/hero-bg.jpg'" />
      </div>
    `,
      )
      .join("");
  }

  // Check wishlist state for current perfume
  updateWishlistButtonState();

  // Load reviews strictly for THIS specific perfume
  loadDynamicReviews(currentPerfume.id, currentPerfume.name);
}

// Switch Main Image on Thumbnail Click
window.switchDynamicImage = function (src, thumbEl) {
  const mainImg = document.getElementById("mainProductImg");
  if (mainImg) {
    mainImg.style.opacity = "0";
    setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = "1";
    }, 180);
  }
  document
    .querySelectorAll(".thumb-box")
    .forEach((b) => b.classList.remove("active"));
  if (thumbEl) thumbEl.classList.add("active");
};

// Volume Multiplier
window.selectDynamicVolume = function (size, multiplier, btn) {
  currentSelectedSize = size;
  currentEffectivePrice = Math.round(currentPerfume.price * multiplier);

  document
    .querySelectorAll(".vol-btn")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const displayPrice = document.getElementById("displayPrice");
  if (displayPrice) {
    displayPrice.textContent = `Rs. ${currentEffectivePrice.toLocaleString()}`;
  }
};

// Quantity Counter
window.changeDynamicQty = function (delta) {
  const input = document.getElementById("detailQty");
  if (!input) return;
  let val = parseInt(input.value, 10) || 1;
  val = Math.max(1, Math.min(10, val + delta));
  input.value = val;
};

// Add to Cart
window.addCurrentProductToCart = function () {
  if (!currentPerfume) return;
  const stockCount =
    currentPerfume.stock !== undefined ? currentPerfume.stock : 25;
  if (stockCount <= 0) {
    window.showToast("Sorry, this item is sold out!", "⚠️");
    return;
  }

  const input = document.getElementById("detailQty");
  const qty = input ? parseInt(input.value, 10) || 1 : 1;

  window.addToCart(
    currentPerfume.id,
    currentPerfume.name,
    currentEffectivePrice,
    currentSelectedSize,
    currentPerfume.image,
    qty,
  );
};

// Add to Wishlist
window.toggleCurrentProductWishlist = function () {
  if (!currentPerfume) return;
  window.toggleWishlist(
    currentPerfume.id,
    currentPerfume.name,
    currentEffectivePrice,
    currentPerfume.image,
  );
  updateWishlistButtonState();
};

function updateWishlistButtonState() {
  const btn = document.querySelector(".btn-wishlist-action");
  if (!btn || !currentPerfume) return;

  const wishlist = JSON.parse(localStorage.getItem("aura_user_wishlist")) || [];
  const isSaved = wishlist.some((item) => item.id === currentPerfume.id);

  if (isSaved) {
    btn.textContent = "♥ Saved";
    btn.style.color = "#ff5252";
    btn.style.borderColor = "#ff5252";
  } else {
    btn.textContent = "♥ Save";
    btn.style.color = "";
    btn.style.borderColor = "";
  }
}

// ==========================================================================
// DYNAMIC REVIEWS ENGINE (Har product ke apne specific reviews)
// ==========================================================================
function getReviewStorageKey(id) {
  return `aura_reviews_${id}`;
}

function loadDynamicReviews(id, perfumeName) {
  const container = document.getElementById("reviewsContainer");
  if (!container) return;

  const fallback = PRODUCT_SPECIFIC_DEFAULT_REVIEWS[id] || [
    {
      author: "Verified Connoisseur",
      stars: 5,
      comment: `The fragrance profile of ${perfumeName} is remarkable. Very long projection and smooth drydown.`,
    },
  ];

  const stored =
    JSON.parse(localStorage.getItem(getReviewStorageKey(id))) || fallback;

  container.innerHTML = stored
    .map(
      (rev) => `
    <div class="user-review-card">
      <div class="star-rating">${"★".repeat(rev.stars)}${"☆".repeat(5 - rev.stars)}</div>
      <p class="user-rev-comment">"${rev.comment}"</p>
      <span class="user-rev-author">— ${rev.author}</span>
      
      <!-- Brand Reply displayed if present -->
      ${
        rev.reply
          ? `
        <div class="user-review-brand-reply">
          <span class="brand-reply-badge">⚜️ Atelier Response</span>
          <p class="brand-reply-text">${rev.reply}</p>
        </div>
      `
          : ""
      }
    </div>
  `,
    )
    .join("");
}

window.handleDynamicReviewSubmit = function (e) {
  e.preventDefault();
  if (!currentPerfume) return;

  const author = document.getElementById("revAuthor").value.trim();
  const stars = parseInt(document.getElementById("revRating").value, 10);
  const comment = document.getElementById("revComment").value.trim();

  const newReview = { author, stars, comment };
  const key = getReviewStorageKey(currentPerfume.id);

  const initialFallback =
    PRODUCT_SPECIFIC_DEFAULT_REVIEWS[currentPerfume.id] || [];
  const currentReviews =
    JSON.parse(localStorage.getItem(key)) || initialFallback;

  currentReviews.unshift(newReview);
  localStorage.setItem(key, JSON.stringify(currentReviews));

  e.target.reset();
  loadDynamicReviews(currentPerfume.id, currentPerfume.name);
  window.showToast(
    `Thank you! Your review for ${currentPerfume.name} has been posted.`,
    "⭐",
  );
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadDynamicProduct();
});
