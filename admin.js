/**
 * AURA ATELIER - Advanced Admin Engine
 * Product CRUD, Stock Management, Unread Review Notification Badges & Review Moderation
 */

const DEFAULT_ADMIN_PIN = "1234";
let currentReviewProductId = null;

// ==========================================================================
// 1. PIN AUTHENTICATION
// ==========================================================================
window.handleAdminLogin = function (e) {
  e.preventDefault();
  const inputPin = document.getElementById("adminPin").value.trim();

  if (inputPin === DEFAULT_ADMIN_PIN) {
    sessionStorage.setItem("aura_admin_auth", "true");
    checkAdminAuth();
    showToast("Admin Console Unlocked", "⚜️");
  } else {
    alert("Incorrect Passcode. Default PIN is 1234.");
  }
};

window.logoutAdmin = function () {
  sessionStorage.removeItem("aura_admin_auth");
  checkAdminAuth();
};

function checkAdminAuth() {
  const isAuth = sessionStorage.getItem("aura_admin_auth") === "true";
  const gate = document.getElementById("adminLoginGate");
  const dash = document.getElementById("adminDashboard");
  const logoutBtn = document.getElementById("adminLogoutBtn");

  if (isAuth) {
    if (gate) {
      gate.classList.add("is-hidden");
      gate.style.setProperty("display", "none", "important");
    }
    if (dash) {
      dash.classList.remove("is-hidden");
      dash.style.setProperty("display", "block", "important");
    }
    if (logoutBtn) logoutBtn.style.display = "flex";
    renderAdminProducts();
  } else {
    if (gate) {
      gate.classList.remove("is-hidden");
      gate.style.setProperty("display", "flex", "important");
    }
    if (dash) {
      dash.classList.add("is-hidden");
      dash.style.setProperty("display", "none", "important");
    }
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

// Helper: Check for unread reviews
function getUnreadReviewCount(prodId) {
  const key = `aura_reviews_${prodId}`;
  const reviews = JSON.parse(localStorage.getItem(key)) || [];
  const readCount = parseInt(
    localStorage.getItem(`aura_read_reviews_${prodId}`) || "0",
    10,
  );
  return Math.max(0, reviews.length - readCount);
}

// ==========================================================================
// 2. RENDER LIVE CATALOG (With Dynamic Unread Badges)
// ==========================================================================
function renderAdminProducts() {
  const container = document.getElementById("adminProductsContainer");
  const countEl = document.getElementById("adminTotalCount");
  const products = getStoredProducts();

  if (countEl) countEl.textContent = products.length;
  if (!container) return;

  container.innerHTML = products
    .map((item, index) => {
      const stockCount = item.stock !== undefined ? item.stock : 25;
      const stockBadgeClass = stockCount > 5 ? "stock-ok" : "stock-low";
      const unreadReviews = getUnreadReviewCount(item.id);

      return `
      <div class="admin-product-card">
        <div class="admin-prod-top">
          <img src="${item.image}" alt="${item.name}" class="admin-prod-thumb" onerror="this.src='/images/hero-bg.jpg'" />
          
          <div class="admin-prod-info">
            <div class="admin-prod-headline">
              <div style="display:flex; align-items:center; gap:0.6rem;">
                <h4>${item.name}</h4>
                ${
                  unreadReviews > 0
                    ? `
                  <span class="new-review-alert-badge" title="${unreadReviews} new unread review(s)">
                    🔴 ${unreadReviews} New
                  </span>
                `
                    : ""
                }
              </div>
              <span class="stock-pill ${stockBadgeClass}">${stockCount} In Stock</span>
            </div>
            <span class="admin-prod-meta">${item.categoryTag || item.category.toUpperCase()} • <strong>Rs. ${item.price.toLocaleString()}</strong></span>
            <p class="admin-prod-summary">${item.summary}</p>
          </div>
        </div>

        <div class="admin-prod-footer-bar">
          <div class="admin-btn-cluster">
            <button class="action-btn edit-btn" onclick="openEditModal(${index})">
              ✏️ Edit
            </button>
            <button class="action-btn reviews-btn ${unreadReviews > 0 ? "highlight-review-btn" : ""}" onclick="openReviewsModal('${item.id}', '${item.name}')">
              💬 Reviews ${unreadReviews > 0 ? `(${unreadReviews})` : ""}
            </button>
            <a href="${item.detailsLink}" target="_blank" class="action-btn view-btn">
              👁️ View
            </a>
          </div>
          <button class="action-btn delete-btn" onclick="deleteProduct(${index})">
            🗑️ Delete
          </button>
        </div>
      </div>
    `;
    })
    .join("");
}

// ==========================================================================
// 3. ADD NEW PERFUME
// ==========================================================================
window.handleSaveProduct = function (e) {
  e.preventDefault();

  const name = document.getElementById("pName").value.trim();
  const category = document.getElementById("pCategory").value;
  const price = parseInt(document.getElementById("pPrice").value, 10);
  const stock = parseInt(document.getElementById("pStock").value, 10) || 20;
  const badge =
    document.getElementById("pBadge").value.trim() || "Exclusive Edition";
  const summary = document.getElementById("pSummary").value.trim();
  const description = document.getElementById("pDesc").value.trim();
  const rawImages = document.getElementById("pImages").value.trim();

  const gallery = rawImages
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const mainImage = gallery[0] || "/images/flora.jpg";
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-");

  const newProduct = {
    id,
    name,
    category,
    price,
    stock,
    volume: "50ml",
    badge,
    categoryTag: category.toUpperCase() + " • EXTRAIT",
    summary,
    description,
    image: mainImage,
    gallery:
      gallery.length > 1
        ? gallery
        : [mainImage, "/images/hero-bg.jpg", "/images/ward_bottle1.jpg"],
    detailsLink: `/product.html?id=${id}`,
  };

  const currentList = getStoredProducts();
  currentList.unshift(newProduct);
  saveStoredProducts(currentList);

  document.getElementById("addPerfumeForm").reset();
  renderAdminProducts();
  showToast(`${name} published with ${gallery.length} images!`, "✨");
};

// ==========================================================================
// 4. EDIT PRODUCT MODAL
// ==========================================================================
window.openEditModal = function (index) {
  const products = getStoredProducts();
  const p = products[index];

  document.getElementById("editProdIndex").value = index;
  document.getElementById("editName").value = p.name;
  document.getElementById("editPrice").value = p.price;
  document.getElementById("editStock").value =
    p.stock !== undefined ? p.stock : 25;
  document.getElementById("editBadge").value = p.badge || "";
  document.getElementById("editSummary").value = p.summary;
  document.getElementById("editDesc").value = p.description || p.summary;

  const images =
    p.gallery && p.gallery.length > 0 ? p.gallery.join(", ") : p.image;
  document.getElementById("editImages").value = images;

  document.getElementById("editProductModal").style.display = "flex";
};

window.closeEditModal = function () {
  document.getElementById("editProductModal").style.display = "none";
};

window.handleUpdateProduct = function (e) {
  e.preventDefault();
  const index = parseInt(document.getElementById("editProdIndex").value, 10);
  const products = getStoredProducts();

  const rawImages = document.getElementById("editImages").value.trim();
  const gallery = rawImages
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  products[index].name = document.getElementById("editName").value.trim();
  products[index].price = parseInt(
    document.getElementById("editPrice").value,
    10,
  );
  products[index].stock = parseInt(
    document.getElementById("editStock").value,
    10,
  );
  products[index].badge = document.getElementById("editBadge").value.trim();
  products[index].summary = document.getElementById("editSummary").value.trim();
  products[index].description = document
    .getElementById("editDesc")
    .value.trim();
  products[index].gallery = gallery;
  products[index].image = gallery[0] || products[index].image;

  saveStoredProducts(products);
  closeEditModal();
  renderAdminProducts();
  showToast("Perfume details updated successfully!", "💾");
};

window.deleteProduct = function (index) {
  const products = getStoredProducts();
  const target = products[index];
  if (confirm(`Are you sure you want to delete ${target.name}?`)) {
    products.splice(index, 1);
    saveStoredProducts(products);
    renderAdminProducts();
    showToast(`${target.name} removed from store`, "🗑️");
  }
};

// ==========================================================================
// 5. REVIEWS MODAL (Clears Badge Once Opened)
// ==========================================================================
window.openReviewsModal = function (id, name) {
  currentReviewProductId = id;
  document.getElementById("revModalTitle").textContent =
    `Customer Reviews for: ${name}`;

  // Mark reviews as read for this perfume
  const key = getReviewStorageKey(id);
  const reviews = JSON.parse(localStorage.getItem(key)) || [];
  localStorage.setItem(`aura_read_reviews_${id}`, reviews.length.toString());

  renderModalReviews();
  renderAdminProducts(); // Refresh catalog to immediately remove red icon
  document.getElementById("reviewsManageModal").style.display = "flex";
};

window.closeReviewsModal = function () {
  document.getElementById("reviewsManageModal").style.display = "none";
};

function getReviewStorageKey(id) {
  return `aura_reviews_${id}`;
}

function renderModalReviews() {
  const container = document.getElementById("modalReviewsFeed");
  if (!container || !currentReviewProductId) return;

  const key = getReviewStorageKey(currentReviewProductId);
  const reviews = JSON.parse(localStorage.getItem(key)) || [];

  if (reviews.length === 0) {
    container.innerHTML = `<div class="empty-reviews-state" style="text-align:center; padding:2rem 0; color:var(--text-muted);"><p>No customer reviews on this fragrance yet.</p></div>`;
    return;
  }

  container.innerHTML = reviews
    .map((rev, index) => {
      const hasReply = rev.reply && rev.reply.trim().length > 0;

      return `
      <div class="admin-review-card">
        <div class="admin-review-header">
          <div>
            <strong class="rev-author-name">${rev.author}</strong>
            <span class="star-rating">${"★".repeat(rev.stars)}${"☆".repeat(5 - rev.stars)}</span>
          </div>
          <span class="rev-index-tag">Review #${index + 1}</span>
        </div>

        <p class="admin-review-text">"${rev.comment}"</p>

        ${
          hasReply
            ? `
          <div class="admin-existing-reply">
            <div class="reply-header-tag">
              <span>⚜️ Atelier Response</span>
              <button class="reply-del-btn" onclick="deleteReply(${index})" title="Delete this reply">&times; Remove Reply</button>
            </div>
            <p class="reply-content-text">${rev.reply}</p>
          </div>
        `
            : ""
        }

        <div class="admin-review-actions-bar">
          <button class="review-action-btn reply-btn" onclick="toggleInlineReplyForm(${index})">
            💬 ${hasReply ? "Edit Reply" : "Reply to this review"}
          </button>
          <button class="review-action-btn del-btn" onclick="deleteCustomerReview(${index})">
            🗑️ Delete review
          </button>
        </div>

        <div class="inline-reply-box" id="replyBox_${index}" style="display: none;">
          <form onsubmit="handleSaveInlineReply(event, ${index})">
            <label class="reply-box-label">Your Response to ${rev.author}:</label>
            <textarea id="replyText_${index}" rows="2" placeholder="Write your polite reply here..." required>${hasReply ? rev.reply : ""}</textarea>
            <div class="inline-reply-buttons">
              <button type="submit" class="btn-reply-publish">Publish Response</button>
              <button type="button" class="btn-reply-cancel" onclick="toggleInlineReplyForm(${index})">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;
    })
    .join("");
}

window.toggleInlineReplyForm = function (index) {
  const box = document.getElementById(`replyBox_${index}`);
  if (!box) return;
  const isHidden = box.style.display === "none";
  box.style.display = isHidden ? "block" : "none";
  if (isHidden) {
    const textarea = document.getElementById(`replyText_${index}`);
    if (textarea) textarea.focus();
  }
};

window.handleSaveInlineReply = function (e, index) {
  e.preventDefault();
  const key = getReviewStorageKey(currentReviewProductId);
  const reviews = JSON.parse(localStorage.getItem(key)) || [];
  const replyContent = document
    .getElementById(`replyText_${index}`)
    .value.trim();

  if (reviews[index]) {
    reviews[index].reply = replyContent;
    localStorage.setItem(key, JSON.stringify(reviews));
    renderModalReviews();
    showToast("Reply published under this review!", "💬");
  }
};

window.deleteReply = function (index) {
  const key = getReviewStorageKey(currentReviewProductId);
  const reviews = JSON.parse(localStorage.getItem(key)) || [];
  if (reviews[index]) {
    delete reviews[index].reply;
    localStorage.setItem(key, JSON.stringify(reviews));
    renderModalReviews();
    showToast("Reply removed", "🗑️");
  }
};

window.deleteCustomerReview = function (index) {
  const key = getReviewStorageKey(currentReviewProductId);
  const reviews = JSON.parse(localStorage.getItem(key)) || [];

  if (confirm(`Delete this customer review?`)) {
    reviews.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(reviews));

    // Update read count
    localStorage.setItem(
      `aura_read_reviews_${currentReviewProductId}`,
      reviews.length.toString(),
    );

    renderModalReviews();
    renderAdminProducts();
    showToast("Review deleted permanently", "🗑️");
  }
};

// Click outside modal to close
window.addEventListener("click", (e) => {
  const editModal = document.getElementById("editProductModal");
  const revModal = document.getElementById("reviewsManageModal");
  if (e.target === editModal) closeEditModal();
  if (e.target === revModal) closeReviewsModal();
});

document.addEventListener("DOMContentLoaded", () => {
  checkAdminAuth();
});
