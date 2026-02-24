const cart = [];

const toastEl = document.getElementById("toast");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");

function formatKES(value) {
  return `KES ${value.toLocaleString("en-KE")}`;
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toastEl.classList.remove("show"), 1800);
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  cart.forEach((item, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name}</span>
      <button class="btn btn-soft" data-remove="${idx}">Remove</button>
    `;
    cartItemsEl.appendChild(li);
  });

  cartTotalEl.textContent = formatKES(total);
  cartCountEl.textContent = `${cart.length} ${cart.length === 1 ? "item" : "items"}`;

  document.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.remove);
      const [removed] = cart.splice(index, 1);
      renderCart();
      showToast(`${removed.name} removed`);
    });
  });
}

function addToCart(card) {
  cart.push({
    name: card.dataset.product,
    price: Number(card.dataset.price)
  });
  renderCart();
  showToast(`${card.dataset.product} added to cart`);
}

function setupButtons() {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
      addToCart(event.target.closest(".product"));
    });
  });

  document.querySelector('[data-action="shop-now"]').addEventListener("click", () => {
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });

  document.querySelector('[data-action="book-stylist"]').addEventListener("click", () => {
    window.open("mailto:stylist@luxeher.co.ke?subject=Style%20Consultation", "_blank");
    showToast("Stylist channel opened");
  });

  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (!cart.length) {
      showToast("Cart is empty");
      return;
    }

    showToast(`Checkout initiated: ${cart.length} item(s)`);
  });

  document.getElementById("open-cart").addEventListener("click", () => {
    document.getElementById("cart-panel").scrollIntoView({ behavior: "smooth" });
  });
}

function setupBottomNav() {
  document.querySelectorAll(".nav-item[data-target]").forEach((item) => {
    item.addEventListener("click", () => {
      document.getElementById(item.dataset.target).scrollIntoView({ behavior: "smooth" });
      document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

function setupProductFilter() {
  const chips = document.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".product");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const filter = chip.dataset.filter;
      cards.forEach((card) => {
        const visible = filter === "all" || card.dataset.category === filter;
        card.style.display = visible ? "block" : "none";
      });

      showToast(`Filter: ${filter}`);
    });
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

setupButtons();
setupBottomNav();
setupProductFilter();
setup3DTilt();
renderCart();
