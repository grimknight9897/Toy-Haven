/**
 * Toy Haven - Product Catalog Dataset
 */
const productsData = [
  {
    id: "prod-101",
    name: "Hunter from bionicle",
    category: "Figurines",
    price: 49.99,
    image: "Hunter(bionicle).jpg",
    featured: true
  },
  {
    id: "prod-102",
    name: "Rubik's Snake",
    category: "Toys",
    price: 34.50,
    image: "rubik's snake.jpg",
    featured: true
  },
  {
    id: "prod-103",
    name: "Dominuos",
    category: "Board Games",
    price: 59.99,
    image: "Dominous.jpg",
    featured: true
  },
  {
    id: "prod-104",
    name: "lego nexo knight",
    category: "Diecast Cars",
    price: 29.99,
    image: "lego nexo knights.jpg",
    featured: true
  },
  {
    id: "prod-105",
    name: "Neuro-Sama",
    category: "Figurines",
    price: 89.99,
    image: "AnimeCatgirl.webp",
    featured: true
  },
  {
    id: "prod-106",
    name: "Remote Control Stunt Drone",
    category: "Toys",
    price: 42.00,
    image: "rc-drone.jpg",
    featured: false
  },
  {
    id: "prod-107",
    name: "Monopoly GO!",
    category: "Board Games",
    price: 24.99,
    image: "Monopoly.jpg",
    featured: true
  },
  {
    id: "prod-108",
    name: "Bat-tank from the 2021 batman movie",
    category: "Diecast Cars",
    price: 39.99,
    image: "2021 bat-tank.jpg",
    featured: false
  },
  {
    id: "prod-109",
    name: "Indominus rex",
    category: "Toys",
    price: 39.99,
    image: "Indominus rex(2015).jpg",
    featured: false
  },
    {
    id: "prod-110",
    name: "Optimus Prime",
    category: "Figurines",
    price: 59.99,
    image: "Optimus prime.jpg",
    featured: true
  },
{
    id: "prod-111",
    name: "Lego Batman with mech",
    category: "Figurines",
    price: 49.99,
    image: "lego batman.jpg",
    featured: true
  }
];
/**
 * Toy Haven - Global Functions and Page Interactive Script
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  updateCartBadge();
  initNewsletter();

  // Page-specific initializers based on present DOM elements
  if (document.querySelector(".hero-carousel")) {
    initCarousel();
  }

  if (document.getElementById("featured-products-container")) {
    renderFeaturedProducts();
  }

  if (document.getElementById("catalog-products-container")) {
    initCatalogPage();
  }

  if (document.getElementById("wishlist-container")) {
    renderWishlistPage();
  }

  if (document.querySelector(".accordion")) {
    initAccordion();
  }
});

/* --------------------------------------------------------------------------
   1. NAVIGATION & CARRIER BADGE (REUSABLE ACROSS ALL PAGES)
   -------------------------------------------------------------------------- */
function initNavigation() {
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navMenu = document.getElementById("nav-menu");

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
      const isExpanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
      hamburgerBtn.setAttribute("aria-expanded", !isExpanded);
      hamburgerBtn.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }
}

/**
 * Reusable utility function to get local storage cart contents
 */
function getCartFromStorage() {
  return JSON.parse(localStorage.getItem("indexCart")) || [];
}

/**
 * Reusable helper to keep cart badge updated in navigation across pages
 */
function updateCartBadge() {
  const badge = document.getElementById("cart-count-badge");
  if (!badge) return;

  const cart = getCartFromStorage();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalItems;
}

/* --------------------------------------------------------------------------
   2. HERO CAROUSEL (HOME PAGE)
   -------------------------------------------------------------------------- */
function initCarousel() {
  const slides = document.querySelectorAll(".carousel-slide");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = setInterval(nextSlide, 5000);

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function resetTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetTimer();
    });

    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetTimer();
    });
  }
}

/* --------------------------------------------------------------------------
   3. PRODUCT CARD CREATION & HOME PAGE FEATURED HIGHLIGHTS
   -------------------------------------------------------------------------- */
/**
 * Reusable function to create an interactive Product Card HTML string
 */
function createProductCardHTML(product) {
  const wishlist = JSON.parse(localStorage.getItem("indexWishlist")) || {};
  const isWishlisted = wishlist[product.id] ? "Remove Wishlist" : "Wishlist";

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-details">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <div class="product-actions">
          <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
          <button class="btn btn-secondary toggle-wishlist-btn" data-id="${product.id}">${isWishlisted}</button>
        </div>
      </div>
    </article>
  `;
}

function renderFeaturedProducts() {
  const container = document.getElementById("featured-products-container");
  if (!container) return;

  const featuredList = productsData.filter((item) => item.featured);
  container.innerHTML = featuredList.map(createProductCardHTML).join("");
  attachProductCardEvents(container);
}

/* --------------------------------------------------------------------------
   4. CATALOG PAGE (FILTERING & SEARCH)
   -------------------------------------------------------------------------- */
function initCatalogPage() {
  const container = document.getElementById("catalog-products-container");
  const searchInput = document.getElementById("product-search");
  const categoryFilter = document.getElementById("category-filter");
  const noResultsMsg = document.getElementById("no-results");

  function renderFilteredCatalog() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = productsData.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm);
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
      container.innerHTML = "";
      noResultsMsg.classList.remove("hidden");
    } else {
      noResultsMsg.classList.add("hidden");
      container.innerHTML = filtered.map(createProductCardHTML).join("");
      attachProductCardEvents(container);
    }
  }

  if (searchInput) searchInput.addEventListener("input", renderFilteredCatalog);
  if (categoryFilter) categoryFilter.addEventListener("change", renderFilteredCatalog);

  // Initial render of all products
  renderFilteredCatalog();
}

/**
 * Reusable event listener setup for dynamically generated product cards
 */
function attachProductCardEvents(containerElement) {
  containerElement.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      addToCartGlobal(id);
    });
  });

  containerElement.querySelectorAll(".toggle-wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      toggleWishlistGlobal(id, e.target);
    });
  });
}

function addToCartGlobal(productId) {
  let cart = getCartFromStorage();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  localStorage.setItem("indexCart", JSON.stringify(cart));
  updateCartBadge();
  alert("Item added to cart!");
}

function toggleWishlistGlobal(productId, buttonElement) {
  let wishlist = JSON.parse(localStorage.getItem("indexWishlist")) || {};

  if (wishlist[productId]) {
    delete wishlist[productId];
    if (buttonElement) buttonElement.textContent = "Wishlist";
  } else {
    wishlist[productId] = { status: "Interested" };
    if (buttonElement) buttonElement.textContent = "Remove Wishlist";
  }

  localStorage.setItem("indexWishlist", JSON.stringify(wishlist));
}

/* --------------------------------------------------------------------------
   5. WISHLIST / COLLECTION PAGE
   -------------------------------------------------------------------------- */
function renderWishlistPage() {
  const container = document.getElementById("wishlist-container");
  const emptyMsg = document.getElementById("empty-wishlist-msg");
  if (!container) return;

  const wishlist = JSON.parse(localStorage.getItem("indexWishlist")) || {};
  const wishlistedIds = Object.keys(wishlist);

  if (wishlistedIds.length === 0) {
    container.innerHTML = "";
    emptyMsg.classList.remove("hidden");
    return;
  }

  emptyMsg.classList.add("hidden");
  const wishlistedProducts = productsData.filter((p) => wishlistedIds.includes(p.id));

  container.innerHTML = wishlistedProducts
    .map((product) => {
      const currentStatus = wishlist[product.id].status || "Interested";
      return `
      <article class="product-card" data-id="${product.id}">
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-details">
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          
          <label for="status-${product.id}">Collection Status:</label>
          <select id="status-${product.id}" class="status-selector status-${currentStatus.toLowerCase().replace(/\s+/g, '-')}" data-id="${product.id}">
            <option value="Interested" ${currentStatus === "Interested" ? "selected" : ""}>Interested</option>
            <option value="Owned" ${currentStatus === "Owned" ? "selected" : ""}>Owned</option>
            <option value="Not Interested" ${currentStatus === "Not Interested" ? "selected" : ""}>Not Interested</option>
          </select>

          <div class="product-actions margin-top">
            <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            <button class="btn btn-danger remove-wishlist-btn" data-id="${product.id}">Remove</button>
          </div>
        </div>
      </article>
    `;
    })
    .join("");

  // Attach status change events
  container.querySelectorAll(".status-selector").forEach((select) => {
    select.addEventListener("change", (e) => {
      const id = e.target.getAttribute("data-id");
      const newStatus = e.target.value;
      const currentWishlist = JSON.parse(localStorage.getItem("indexWishlist")) || {};

      currentWishlist[id] = { status: newStatus };
      localStorage.setItem("indexWishlist", JSON.stringify(currentWishlist));

      // Dynamically update background styling class
      e.target.className = `status-selector status-${newStatus.toLowerCase().replace(/\s+/g, '-')}`;
    });
  });

  // Attach remove buttons
  container.querySelectorAll(".remove-wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      const currentWishlist = JSON.parse(localStorage.getItem("indexWishlist")) || {};
      delete currentWishlist[id];
      localStorage.setItem("indexWishlist", JSON.stringify(currentWishlist));
      renderWishlistPage();
    });
  });

  // Attach cart add buttons
  container.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      addToCartGlobal(id);
    });
  });
}

/* --------------------------------------------------------------------------
   6. FOOTER NEWSLETTER & ACCORDION
   -------------------------------------------------------------------------- */
function initNewsletter() {
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterMsg = document.getElementById("newsletter-message");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("newsletter-email");
      const email = emailInput.value.trim();

      if (email) {
        let subscribers = JSON.parse(localStorage.getItem("indexSubscribers")) || [];
        subscribers.push({ email: email, date: new Date().toISOString() });
        localStorage.setItem("indexSubscribers", JSON.stringify(subscribers));

        if (newsletterMsg) {
          newsletterMsg.textContent = "Thank you for subscribing!";
          newsletterMsg.style.color = "#2ECC71";
        }
        emailInput.value = "";
      }
    });
  }
}

function initAccordion() {
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      const isOpen = header.classList.contains("active");

      // Close all other panels
      document.querySelectorAll(".accordion-header").forEach((h) => {
        h.classList.remove("active");
        h.setAttribute("aria-expanded", "false");
        h.nextElementSibling.style.maxHeight = null;
      });

      // Toggle clicked panel
      if (!isOpen) {
        header.classList.add("active");
        header.setAttribute("aria-expanded", "true");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

/**
 * Toy Haven - Shopping Cart Logic Handler
 */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cart-items-body")) {
    renderCartTable();
  }
});

function renderCartTable() {
  const tbody = document.getElementById("cart-items-body");
  const emptyMsg = document.getElementById("empty-cart-msg");
  const summaryCount = document.getElementById("summary-items-count");
  const summaryTotal = document.getElementById("summary-total-price");
  const clearCartBtn = document.getElementById("clear-cart-btn");

  if (!tbody) return;

  const cart = getCartFromStorage();

  if (cart.length === 0) {
    tbody.innerHTML = "";
    if (emptyMsg) emptyMsg.classList.remove("hidden");
    if (summaryCount) summaryCount.textContent = "0";
    if (summaryTotal) summaryTotal.textContent = "$0.00";
    return;
  }

  if (emptyMsg) emptyMsg.classList.add("hidden");

  let grandTotal = 0;
  let totalCount = 0;

  tbody.innerHTML = cart
    .map((item) => {
      const product = productsData.find((p) => p.id === item.id);
      if (!product) return "";

      const subtotal = product.price * item.quantity;
      grandTotal += subtotal;
      totalCount += item.quantity;

      return `
      <tr>
        <td>
          <div class="cart-item-info">
            <img src="${product.image}" alt="${product.name}" class="cart-item-img">
            <span><strong>${product.name}</strong></span>
          </div>
        </td>
        <td>$${product.price.toFixed(2)}</td>
        <td>
          <div class="quantity-controls">
            <button class="qty-btn" onclick="adjustQuantity('${item.id}', -1)" aria-label="Decrease quantity">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" onclick="adjustQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
        </td>
        <td><strong>$${subtotal.toFixed(2)}</strong></td>
        <td>
          <button class="btn btn-danger" onclick="removeFromCart('${item.id}')">Remove</button>
        </td>
      </tr>
    `;
    })
    .join("");

  if (summaryCount) summaryCount.textContent = totalCount;
  if (summaryTotal) summaryTotal.textContent = `$${grandTotal.toFixed(2)}`;

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your entire cart?")) {
        localStorage.removeItem("indexCart");
        renderCartTable();
        updateCartBadge();
      }
    });
  }
}

function adjustQuantity(productId, delta) {
  let cart = getCartFromStorage();
  const itemIndex = cart.findIndex((i) => i.id === productId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
  }

  localStorage.setItem("indexCart", JSON.stringify(cart));
  renderCartTable();
  updateCartBadge();
}

function removeFromCart(productId) {
  let cart = getCartFromStorage();
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("indexCart", JSON.stringify(cart));
  renderCartTable();
  updateCartBadge();
}
/**
 * Toy Haven - Form Validation & Checkout Script
 */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("checkout-form")) {
    initCheckoutPage();
  }

  if (document.getElementById("feedback-form")) {
    initFeedbackForm();
  }
});

/* --------------------------------------------------------------------------
   1. CHECKOUT VALIDATION & SUMMARY
   -------------------------------------------------------------------------- */
function initCheckoutPage() {
  const checkoutList = document.getElementById("checkout-items-list");
  const finalTotalEl = document.getElementById("checkout-final-total");
  const form = document.getElementById("checkout-form");

  const cart = JSON.parse(localStorage.getItem("indexCart")) || [];

  if (cart.length === 0 && checkoutList) {
    checkoutList.innerHTML = "<li>Your cart is empty. Please add products first.</li>";
    if (finalTotalEl) finalTotalEl.textContent = "$0.00";
  } else if (checkoutList) {
    let total = 0;
    checkoutList.innerHTML = cart
      .map((item) => {
        const product = productsData.find((p) => p.id === item.id);
        if (!product) return "";
        const subtotal = product.price * item.quantity;
        total += subtotal;
        return `
        <li class="checkout-item-line">
          <span>${product.name} (x${item.quantity})</span>
          <span>$${subtotal.toFixed(2)}</span>
        </li>
      `;
      })
      .join("");

    if (finalTotalEl) finalTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        alert("Cannot process an empty order. Please add products to your cart.");
        return;
      }

      if (validateCheckoutForm()) {
        processOrderSubmit();
      }
    });
  }
}

function validateCheckoutForm() {
  let isValid = true;

  const fullname = document.getElementById("fullname");
  const email = document.getElementById("email");
  const address = document.getElementById("address");

  // Validate Full Name
  if (!fullname.value.trim()) {
    showError(fullname, "fullname-error", "Full Name is required.");
    isValid = false;
  } else {
    clearError(fullname, "fullname-error");
  }

  // Validate Email
  if (!email.value.trim() || !isValidEmail(email.value)) {
    showError(email, "email-error", "Please enter a valid email address.");
    isValid = false;
  } else {
    clearError(email, "email-error");
  }

  // Validate Delivery Address
  if (!address.value.trim()) {
    showError(address, "address-error", "Delivery Address is required.");
    isValid = false;
  } else {
    clearError(address, "address-error");
  }

  return isValid;
}

function processOrderSubmit() {
  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const payment = document.querySelector('input[name="payment"]:checked').value;

  const cart = JSON.parse(localStorage.getItem("indexCart")) || [];
  const orderId = "TH-" + Math.floor(100000 + Math.random() * 900000);

  const orderData = {
    orderId: orderId,
    customer: { fullname, email, address },
    paymentMethod: payment,
    items: cart,
    date: new Date().toISOString()
  };

  // Save order history in localStorage
  let orders = JSON.parse(localStorage.getItem("indexOrders")) || [];
  orders.push(orderData);
  localStorage.setItem("indexOrders", JSON.stringify(orders));

  // Clear cart
  localStorage.removeItem("indexCart");
  updateCartBadge();

  // Show Success Modal
  const modal = document.getElementById("checkout-modal");
  const modalOrderId = document.getElementById("modal-order-id");

  if (modal && modalOrderId) {
    modalOrderId.textContent = orderId;
    modal.classList.remove("hidden");
  }
}

/* --------------------------------------------------------------------------
   2. FEEDBACK FORM VALIDATION
   -------------------------------------------------------------------------- */
function initFeedbackForm() {
  const form = document.getElementById("feedback-form");
  const statusMsg = document.getElementById("feedback-status");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("fb-name");
    const email = document.getElementById("fb-email");
    const message = document.getElementById("fb-message");

    let isValid = true;

    if (!name.value.trim()) {
      showError(name, "fb-name-error", "Name is required.");
      isValid = false;
    } else {
      clearError(name, "fb-name-error");
    }

    if (!email.value.trim() || !isValidEmail(email.value)) {
      showError(email, "fb-email-error", "Valid email is required.");
      isValid = false;
    } else {
      clearError(email, "fb-email-error");
    }

    if (!message.value.trim()) {
      showError(message, "fb-message-error", "Message cannot be empty.");
      isValid = false;
    } else {
      clearError(message, "fb-message-error");
    }

    if (isValid) {
      const feedbackData = {
        name: name.value.trim(),
        email: email.value.trim(),
        message: message.value.trim(),
        timestamp: new Date().toISOString()
      };

      let existingFeedback = JSON.parse(localStorage.getItem("indexFeedback")) || [];
      existingFeedback.push(feedbackData);
      localStorage.setItem("indexFeedback", JSON.stringify(existingFeedback));

      statusMsg.textContent = "Thank you! Your message has been sent successfully.";
      statusMsg.className = "status-message success";

      form.reset();
    }
  });
}

/* Helper Utilities */
function showError(inputEl, errorContainerId, message) {
  inputEl.classList.add("input-error");
  const errorEl = document.getElementById(errorContainerId);
  if (errorEl) errorEl.textContent = message;
}

function clearError(inputEl, errorContainerId) {
  inputEl.classList.remove("input-error");
  const errorEl = document.getElementById(errorContainerId);
  if (errorEl) errorEl.textContent = "";
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}