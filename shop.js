// Change this line at the top of shop.js:
const FRAGRANCE_DATABASE = window.getStoredProducts
  ? window.getStoredProducts()
  : [];

let activeCategory = "all";
let maxPrice = 6000;

// Render Products to the Grid
function renderCatalog(items) {
  const grid = document.getElementById("productsGrid");
  const emptyMsg = document.getElementById("emptyMsg");
  const totalCountEl = document.getElementById("totalCount");

  if (totalCountEl) totalCountEl.textContent = items.length;

  if (items.length === 0) {
    grid.innerHTML = "";
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  grid.innerHTML = items
    .map(
      (product) => `
    <article class="product-card">
      <div class="card-badge">${product.badge}</div>
      <button class="wishlist-heart-btn" onclick="toggleWishlist('${product.id}', '${product.name}', ${product.price}, '${product.image}')" title="Save to wishlist">♥</button>
      <div class="card-image-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.src='/images/hero-bg.jpg'" />
        <div class="card-quick-actions">
          <button class="btn-whatsapp-order" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '50ml', '${product.image}')">
            + Add to Cart
          </button>
        </div>
      </div>
      <div class="card-body">
        <span class="product-category">${product.categoryTag}</span>
        <h3 class="product-name"><a href="${product.detailsLink}">${product.name}</a></h3>
        <p class="product-notes-summary">${product.summary}</p>
        <div class="product-footer">
          <span class="product-price">Rs. ${product.price.toLocaleString()} <small>${product.volume}</small></span>
          <a href="${product.detailsLink}" class="btn-view">View Details →</a>
        </div>
      </div>
    </article>
  `,
    )
    .join("");
}
// Filter and Sort Controller
window.filterProducts = function () {
  const searchTerm = (document.getElementById("fragranceSearch")?.value || "")
    .toLowerCase()
    .trim();
  const sortMode = document.getElementById("sortSelect")?.value || "featured";

  let results = FRAGRANCE_DATABASE.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesPrice = item.price <= maxPrice;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm) ||
      item.summary.toLowerCase().includes(searchTerm) ||
      item.categoryTag.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesPrice && matchesSearch;
  });

  // Sorting
  if (sortMode === "price-low") {
    results.sort((a, b) => a.price - b.price);
  } else if (sortMode === "price-high") {
    results.sort((a, b) => b.price - a.price);
  } else if (sortMode === "name") {
    results.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderCatalog(results);
};

window.setCategory = function (cat, buttonEl) {
  activeCategory = cat;

  document
    .querySelectorAll(".cat-pill")
    .forEach((btn) => btn.classList.remove("active"));
  if (buttonEl) buttonEl.classList.add("active");

  filterProducts();
};

window.updatePriceFilter = function (val) {
  maxPrice = parseInt(val, 10);
  const display = document.getElementById("priceDisplay");
  if (display) display.textContent = `Rs. ${maxPrice.toLocaleString()}`;
  filterProducts();
};

window.resetFilters = function () {
  activeCategory = "all";
  maxPrice = 6000;

  const searchInput = document.getElementById("fragranceSearch");
  if (searchInput) searchInput.value = "";

  const priceRange = document.getElementById("priceRange");
  if (priceRange) priceRange.value = 6000;

  const display = document.getElementById("priceDisplay");
  if (display) display.textContent = "Rs. 6,000";

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) sortSelect.value = "featured";

  document.querySelectorAll(".cat-pill").forEach((btn, idx) => {
    btn.classList.toggle("active", idx === 0);
  });

  filterProducts();
};

// Initial Render
document.addEventListener("DOMContentLoaded", () => {
  renderCatalog(FRAGRANCE_DATABASE);
});
