const cart = [];
let selectedGateway = "mpesa";

const toastEl = document.getElementById("toast");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");
const paymentAmountEl = document.getElementById("payment-amount");
const backdropEl = document.getElementById("modal-backdrop");

function formatKES(value) {
  return `KES ${value.toLocaleString("en-KE")}`;
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toastEl.classList.remove("show"), 1900);
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

function renderCart() {
  cartItemsEl.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name}<br /><small>${formatKES(item.price)}</small></span>
      <button class="btn btn-soft btn-sm" data-remove="${index}">Remove</button>
    `;
    cartItemsEl.appendChild(li);
  });

  cartTotalEl.textContent = formatKES(getCartTotal());
  cartCountEl.textContent = `${cart.length} ${cart.length === 1 ? "item" : "items"}`;
  paymentAmountEl.value = formatKES(getCartTotal());

  document.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.remove);
      const [removed] = cart.splice(idx, 1);
      renderCart();
      showToast(`${removed.name} removed`);
    });
  });
}

function addToCart(card) {
  cart.push({
    id: Number(card.dataset.id),
    name: card.dataset.product,
    price: Number(card.dataset.price)
  });
  renderCart();
  showToast(`${card.dataset.product} added to cart`);
}

function openModal(id) {
  document.querySelectorAll(".modal").forEach((m) => m.classList.remove("show"));
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("show");
  backdropEl.classList.add("show");
}

function closeModals() {
  document.querySelectorAll(".modal").forEach((m) => m.classList.remove("show"));
  backdropEl.classList.remove("show");
}

function setupModals() {
  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.openModal));
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeModals);
  });

  backdropEl.addEventListener("click", closeModals);
}

function setupNavigation() {
  document.querySelectorAll(".nav-item[data-target]").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById(button.dataset.target).scrollIntoView({ behavior: "smooth" });
      document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
      button.classList.add("active");
    });
  });

  document.getElementById("scroll-cart").addEventListener("click", () => {
    document.getElementById("cart-panel").scrollIntoView({ behavior: "smooth" });
  });

  document.querySelector('[data-action="shop"]').addEventListener("click", () => {
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });
}

function setupProducts() {
  document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const card = event.target.closest(".product");
      addToCart(card);
    });
  });

  document.querySelectorAll(".preview-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const card = event.target.closest(".product");
      const html = `
        <img src="${card.querySelector("img").src}" alt="${card.dataset.product}" class="modal-preview-img" />
        <h4>${card.dataset.product}</h4>
        <p>${card.querySelector("p").textContent}</p>
        <p><strong>${formatKES(Number(card.dataset.price))}</strong></p>
        <button class="btn btn-primary" id="preview-add">Add to Cart</button>
      `;
      document.getElementById("product-modal-content").innerHTML = html;
      openModal("product-modal");
      document.getElementById("preview-add").addEventListener("click", () => {
        addToCart(card);
        closeModals();
      });
    });
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.dataset.filter;
      document.querySelectorAll(".product").forEach((product) => {
        const visible = filter === "all" || product.dataset.category === filter;
        product.style.display = visible ? "block" : "none";
      });
      showToast(`Showing: ${filter}`);
    });
  });
}

function setupAccountTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active"));
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");
    });
  });

  document.getElementById("save-profile").addEventListener("click", () => showToast("Profile saved"));
  document.getElementById("save-address").addEventListener("click", () => showToast("Address updated"));
}

function setupPaymentDemo() {
  document.getElementById("pay-now-btn").addEventListener("click", () => {
    if (!cart.length) {
      showToast("Cart is empty");
      return;
    }

    paymentAmountEl.value = formatKES(getCartTotal());
    openModal("payment-modal");
  });

  document.querySelectorAll(".pay-option").forEach((option) => {
    option.addEventListener("click", () => {
      document.querySelectorAll(".pay-option").forEach((o) => o.classList.remove("active"));
      option.classList.add("active");
      selectedGateway = option.dataset.gateway;
    });
  });

  document.getElementById("simulate-payment").addEventListener("click", () => {
    const contact = document.getElementById("payment-contact").value.trim();
    if (!contact) {
      showToast("Enter phone/card holder details");
      return;
    }

    showToast(`Payment successful via ${selectedGateway.toUpperCase()} ✅`);
    cart.splice(0, cart.length);
    renderCart();
    closeModals();
  });
}

function setupConfirmations() {
  document.getElementById("confirm-clear").addEventListener("click", () => {
    cart.splice(0, cart.length);
    renderCart();
    closeModals();
    showToast("Cart cleared");
  });

  document.getElementById("newsletter-submit").addEventListener("click", () => {
    const email = document.getElementById("newsletter-email").value.trim();
    if (!email.includes("@")) {
      showToast("Please enter a valid email");
      return;
    }

    closeModals();
    showToast("Subscribed successfully 💖");
  });
}

function setup3DTilt() {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -10;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale(1)";
    });
  });
}

setupModals();
setupNavigation();
setupProducts();
setupAccountTabs();
setupPaymentDemo();
setupConfirmations();
setup3DTilt();
renderCart();
