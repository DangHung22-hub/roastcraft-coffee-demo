const MENU_ITEMS = [
  {
    id: "espresso-cortado",
    name: "Honey Cinnamon Cortado",
    category: "espresso",
    price: 4.75,
    description: "Double-shot house espresso balanced with steamed milk and raw wildflower honey."
  },
  {
    id: "espresso-oat-latte",
    name: "Iced Brown Sugar Oat Latte",
    category: "espresso",
    price: 5.5,
    description: "Velvety oat milk shaken over espresso with house-made brown sugar syrup."
  },
  {
    id: "beans-ethiopia",
    name: "Ethiopia Yirgacheffe (12 oz)",
    category: "beans",
    price: 18.0,
    description: "Light roast whole beans with bright jasmine, bergamot, and white peach notes."
  },
  {
    id: "beans-colombia",
    name: "Colombia Huila Reserve (12 oz)",
    category: "beans",
    price: 17.5,
    description: "Medium roast with milk chocolate, toasted hazelnut, and sweet caramel finish."
  },
  {
    id: "pastry-croissant",
    name: "Cultured Butter Croissant",
    category: "pastry",
    price: 4.25,
    description: "Flaky 72-hour laminated sourdough croissant baked golden every morning."
  },
  {
    id: "pastry-cardamom",
    name: "Swedish Cardamom Knot",
    category: "pastry",
    price: 4.5,
    description: "Soft brioche twisted with freshly ground green cardamom and pearl sugar."
  }
];

const state = {
  category: "all",
  search: "",
  cart: []
};

const menuGrid = document.getElementById("menuGrid");
const emptyState = document.getElementById("emptyState");
const menuSearch = document.getElementById("menuSearch");
const filterButtons = document.querySelectorAll(".pill");
const cartCount = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartNote = document.getElementById("cartNote");

function renderMenu() {
  const query = state.search.trim().toLowerCase();
  const filtered = MENU_ITEMS.filter((item) => {
    const matchCat = state.category === "all" || item.category === state.category;
    const matchQuery =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);
    return matchCat && matchQuery;
  });

  menuGrid.innerHTML = "";
  emptyState.hidden = filtered.length > 0;

  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = "menu-card";
    card.innerHTML = `
      <div>
        <div class="menu-card-top">
          <span class="cat-badge">${item.category}</span>
          <span class="item-price">$${item.price.toFixed(2)}</span>
        </div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
      <button class="add-btn" type="button" data-add="${item.id}">Add to Cart</button>
    `;
    menuGrid.appendChild(card);
  });
}

function renderCart() {
  const totalQty = state.cart.reduce((sum, entry) => sum + entry.qty, 0);
  const totalPrice = state.cart.reduce((sum, entry) => sum + entry.price * entry.qty, 0);

  cartCount.textContent = String(totalQty);
  cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;

  if (state.cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="cart-empty">Your cart is empty. Add any drink, bean bag, or pastry from the menu.</p>`;
    return;
  }

  cartItemsEl.innerHTML = state.cart
    .map(
      (item) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <small>$${item.price.toFixed(2)} each</small>
        </div>
        <div class="qty-controls">
          <button type="button" data-dec="${item.id}" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button type="button" data-inc="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
    `
    )
    .join("");
}

function addToCart(id) {
  const found = state.cart.find((item) => item.id === id);
  if (found) {
    found.qty += 1;
  } else {
    const product = MENU_ITEMS.find((item) => item.id === id);
    if (product) state.cart.push({ ...product, qty: 1 });
  }
  cartNote.textContent = "Client-side interactive demo — no real payment processed.";
  renderCart();
}

function updateQty(id, delta) {
  const found = state.cart.find((item) => item.id === id);
  if (!found) return;
  found.qty += delta;
  if (found.qty <= 0) {
    state.cart = state.cart.filter((item) => item.id !== id);
  }
  renderCart();
}

function openCart() {
  cartBackdrop.hidden = false;
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartBackdrop.hidden = true;
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

// Event Listeners
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.category = btn.dataset.category;
    renderMenu();
  });
});

menuSearch.addEventListener("input", (e) => {
  state.search = e.target.value;
  renderMenu();
});

menuGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  addToCart(btn.dataset.add);
  openCart();
});

cartItemsEl.addEventListener("click", (e) => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  if (inc) updateQty(inc.dataset.inc, 1);
  if (dec) updateQty(dec.dataset.dec, -1);
});

document.getElementById("openCartBtn").addEventListener("click", openCart);
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

document.getElementById("checkoutDemoBtn").addEventListener("click", () => {
  if (state.cart.length === 0) {
    cartNote.textContent = "Add at least one item to test the demo checkout.";
    return;
  }
  state.cart = [];
  renderCart();
  cartNote.textContent = "Demo order placed! (Front-end simulation only.)";
});

// Mobile Navigation Toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// FAQ Accordion
document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.parentElement;
    const isOpen = item.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });
});

// Contact Form Client-Side Validation
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const message = document.getElementById("messageInput").value.trim();

  if (!name || !email.includes("@") || message.length < 10) {
    formFeedback.textContent = "Please enter your name, a valid email, and a message (at least 10 characters).";
    formFeedback.classList.add("error");
    return;
  }

  formFeedback.textContent = `Thanks, ${name}! Your demo inquiry has been validated (front-end only).`;
  formFeedback.classList.remove("error");
  contactForm.reset();
});

// Initial render
renderMenu();
renderCart();
