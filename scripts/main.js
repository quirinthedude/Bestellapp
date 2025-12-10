// --- Imports ---------------------------------------------------------------

import { $ } from "./helpers.js";
import {
  tplMenuCategoryHeading,
  tplMenuItem,
  tplMenuLink,
  tplCartRow,
  tplCardButtonSpace,
  tplCartContentBeginn,
  tplCartContentEnd,
  T_CART_EMPTY
} from "./templates.js";


// --- Load Region & Restaurant Data -----------------------------------------

const REGION = 'basel-stadt';
const REGION_URL = `./scripts/data/ch/${REGION}.json`;

// Load region → contains list of restaurants
const regionRes = await fetch(REGION_URL);
const region = await regionRes.json(); // e.g. { restaurants: ["mama-mia.basel"] }

// Pick the first restaurant (in reality: user selection)
const restaurantId = region.restaurants[0];
const RESTAURANT_URL = `./scripts/data/restaurants/${restaurantId}.json`;

// Load restaurant metadata (logo, hero image, ETA etc.)
const restaurantRes = await fetch(RESTAURANT_URL);
const restaurant = await restaurantRes.json();

// Load menu assigned to the restaurant
const MENU_URL = `./scripts/data/menues/${restaurantId}.menue.json`;

console.log('at:', location.href);
console.log('REGION_URL abs:', new URL(REGION_URL, location.href).href);

const menuRes = await fetch(MENU_URL);
const menu = await menuRes.json(); // { categories: [...], items: [...] }

// Currency formatter
const CHF = new Intl.NumberFormat('de-CH', {
  style: 'currency',
  currency: 'CHF'
});


// --- Application State ------------------------------------------------------

// CART keeps quantities: { productId : qty }
const CART = Object.create(null);

// BY_ID allows quick lookup of menu items by their ID
const BY_ID = Object.fromEntries(menu.items.map(it => [it.id, it]));


// --- Event Delegation: Add / Remove Items ----------------------------------
// One single click listener handles all + / - buttons using dataset attributes

document.addEventListener('click', (ev) => {
  const add = ev.target.closest('[data-add]');
  const del = ev.target.closest('[data-del]');

  // ADD item
  if (add) {
    const id = add.dataset.add;
    CART[id] = (CART[id] || 0) + 1;

    renderCart();
    updateProductBadge(id);

    // Visual pulse on the menu item
    const article = add.closest('.menu-item');
    if (article) {
      article.classList.add('pulse');
      setTimeout(() => article.classList.remove('pulse'), 150);
    }
    return;
  }

  // REMOVE item
  if (del) {
    const id = del.dataset.del;
    if (CART[id] <= 1) {
      delete CART[id];
    } else {
      CART[id]--;
    }
    renderCart();
    updateProductBadge(id);
    return;
  }
});


// --- Initial Rendering ------------------------------------------------------

renderLinkBar();
renderMenu();
updateAllProductBadges();


// --- Render Menu ------------------------------------------------------------

function renderMenu() {
  const ITEMS = menu.items;
  let currentId = null;
  let html = '';

  ITEMS.forEach(it => {
    // Find category based on ID or name (fallback)
    const cat = menu.categories.find(c =>
      c.id === it.category || c.name === it.category
    );

    const catId = cat ? cat.id : it.category;
    const label = cat ? cat.name : it.category;

    // Insert category heading when category changes
    if (catId !== currentId) {
      currentId = catId;
      html += tplMenuCategoryHeading(catId, label);
    }

    // Render single menu item
    html += tplMenuItem(it);
  });

  html += tplCardButtonSpace();
  $('#content').innerHTML = html;
}


// --- Render Navigation Bar (Category Links) --------------------------------

function renderLinkBar() {
  let html = '';
  menu.categories.forEach(CAT => {
    html += tplMenuLink(CAT.id, CAT.name);
  });
  $('#menu-bar').innerHTML = html;
}


// --- Render Cart ------------------------------------------------------------

function renderCart() {
  const host = $('#cart-list');
  const TOTAL = $('#total');

  let total = 0;
  let rows = '';
  let content = tplCartContentBeginn();

  for (const [id, qty] of Object.entries(CART)) {
    const it = BY_ID[id];
    if (!it) continue;

    const line = (it.priceCents * qty) / 100;
    total += line;

    // Add cart row via template
    rows += tplCartRow(it, id, qty, CHF.format(line));
  }

  if (!rows) rows = T_CART_EMPTY;

  content += rows + tplCartContentEnd();

  host.innerHTML = content;
  TOTAL.innerText = CHF.format(total);
}


// --- Pay Button -------------------------------------------------------------

function payForOrder() {
  const orderMessager = $('#order-message');
  if (!orderMessager) return;

  if (Object.keys(CART).length === 0) {
    orderMessager.innerText = 'Der Warenkorb ist leer. Bitte zuerst Bestellen!';
    return;
  }

  // Clear cart
  for (const id in CART) {
    delete CART[id];
  }

  renderCart();
  orderMessager.innerText = 'Danke. Die Bestellung ist eingegangen';
}


// --- Mobile Cart Overlay ----------------------------------------------------

function openCart() {
  if (!cartPanel || !cartButton) return;

  document.body.style.overflow = "hidden";
  document.body.classList.add('cart-open');

  cartPanel.classList.remove('cart-is-closed');
  cartButton.classList.add('cart-button-hidden');
}

function closeCart() {
  if (!cartPanel || !cartButton) return;

  document.body.style.overflow = "";
  document.body.classList.remove('cart-open');

  cartPanel.classList.add('cart-is-closed');
  cartButton.classList.remove('cart-button-hidden');
}


// --- Product Badge Update ---------------------------------------------------

function updateProductBadge(id) {
  // Find the menu item matching the data-add attribute
  const article = $(`.menu-item[data-add="${id}"]`);
  if (!article) return;

  // Badge inside the item
  const badge = $('.product-badge', article);
  if (!badge) return;

  const qty = CART[id] || 0;

  // Hide badge if qty = 0
  if (!qty) {
    badge.hidden = true;
    return;
  }

  // Show qty (cap at "9+")
  badge.hidden = false;
  badge.textContent = qty > 9 ? '9+' : qty;
}

function updateAllProductBadges() {
  for (const id in CART) updateProductBadge(id);
}


// --- Setup: Cart Elements & Buttons ----------------------------------------

const cartPanel = $('#cart-panel');
const cartButton = $('#cart-button');
const closeCartButton = $('#close-cart');
const payButton = $('#pay');

// Ensure cart is initially closed
if (cartPanel && !cartPanel.classList.contains('cart-is-closed')) {
  cartPanel.classList.add('cart-is-closed');
}

// Bind UI interactions
if (cartButton) cartButton.addEventListener('click', openCart);
if (closeCartButton) closeCartButton.addEventListener('click', closeCart);
if (payButton) payButton.addEventListener('click', payForOrder);


// Expose for debugging during development
window.CART = CART;
window.renderCart = renderCart;
window.openCart = openCart;
window.closeCart = closeCart;
