//  imports
import { $, $$, within } from "./helpers.js";
import {
  tplMenuCategoryHeading,
  tplMenuItem,
  tplMenuLink,
  tplCartRow,
  T_CART_EMPTY
} from "./templates.js";


// load Menu-JSON -> ready to render

// region, a great bunch of function would obiously be needed to return in reality
const REGION = 'basel-stadt';
const REGION_URL = `./scripts/data/ch/${REGION}.json`;

const regionRes = await fetch(REGION_URL);            // fetch loads URL asyncron, awaits anyway
const region = await regionRes.json();                // { restaurants: ["mama-mia.basel"], ... }

// first restaurant (in Reality would have been choosen on site before)
const restaurantId = region.restaurants[0];           // "mama-mia.basel"
const RESTAURANT_URL = `./scripts/data/restaurants/${restaurantId}.json`;
// retstaurantId - for simulation here's just one

const restaurantRes = await fetch(RESTAURANT_URL);
const restaurant = await restaurantRes.json();        // (Hero, Logo, ETA, Fee, ...) here static

// here is the start of the code used
const MENU_URL = `./scripts/data/menues/${restaurantId}.menue.json`;
console.log('at:', location.href);
console.log('REGION_URL abs:', new URL(REGION_URL, location.href).href);

const menuRes = await fetch(MENU_URL);
const menu = await menuRes.json();                    // { categories: [...], items: [...] }

const CHF = new Intl.NumberFormat('de-CH', {
  style: 'currency',
  currency: 'CHF'
});


// objects being created to form adequate string pairs in cart

const CART = Object.create(null); // {id : qty}
// const BY_ID = Object.fromEntries(menu.items.map(it => [String(it.id), it]));
const BY_ID = Object.fromEntries(
  menu.items.map(it => [it.id, it])
);

// eventListener 
document.addEventListener('click', (ev) => {
  const add = ev.target.closest('[data-add]');
  const del = ev.target.closest('[data-del]');

  if (add) {
    const id = add.dataset.add;
    CART[id] = (CART[id] || 0) + 1;
    console.log('CART jetzt:', CART);
    renderCart();
    return;  
  }

  if (del) {
    const id = del.dataset.del;
    if (CART[id] <= 1) {
      delete CART[id];
    } else {
      CART[id]--;
    }
    renderCart();
    return;
  }
});



renderLinkBar();
renderMenu();


// menu render
function renderMenu() {
  const ITEMS = menu.items;
  let currentId = null;
  let html = '';

  ITEMS.forEach(it => {
    const cat = menu.categories.find(c =>
      c.id === it.category || c.name === it.category  //one of these fallbacks
    );                                                //here I learned about ID

    console.log('Heading-ID aus ITEMS:', it.category);
    const catId = cat ? cat.id : it.category;         //is cat? -> it.category
    const label = cat ? cat.name : it.category;       //german name for label

    if (catId !== currentId) {
      currentId = catId;
      html += tplMenuCategoryHeading(catId, label);
    }

    html += tplMenuItem(it);
  });

  $('#content').innerHTML = html;
}

function renderLinkBar() {
  const MENULINK = menu.categories;
  let html = '';

  MENULINK.forEach(CAT => {
    console.log('Link-ID aus CATEGORIES:', CAT.id);

    const ID = CAT.id;
    const NAME = CAT.name;
    // Link from Template
    html += tplMenuLink(ID, NAME);
  });

  $('#menu-bar').innerHTML = html;
}

function renderCart() {
  const host = $('#cart-list');
  const TOTAL = $('#total');

  let total = 0;
  let rows = '';

  for (const [id, qty] of Object.entries(CART)) {
    const it = BY_ID[id];
    if (!it) continue;
    const line = (it.priceCents * qty) / 100;
    total += line;

    // line from Template, CHF formated
    rows += tplCartRow(it, id, qty, CHF.format(line));
  }

  if (!rows) {
    rows = T_CART_EMPTY;
  }

  host.innerHTML = rows;
  TOTAL.innerText = CHF.format(total);
}

function openCart() {
  const cart = document.getElementById('cart-panel');
  const cartButton = document.getElementById('cart-button');
  if (!cart || !cartButton) return;

  cart.classList.remove('cart-is-closed');      // Overlay visible
  cartButton.classList.add('cart-button-hidden'); // Button at bottom away
}

function closeCart() {
  const cart = document.getElementById('cart-panel');
  const cartButton = document.getElementById('cart-button');
  if (!cart || !cartButton) return;

  cart.classList.add('cart-is-closed');          // Overlay hidden
  cartButton.classList.remove('cart-button-hidden'); // Button on again
}

// --- Cart-Setup direct execute (script at the end of <body>) ---

const cartPanel = document.getElementById('cart-panel');
const cartButton = document.getElementById('cart-button');
const closeCartButton = document.getElementById('close-cart');

// Start: Cart closed
if (cartPanel && !cartPanel.classList.contains('cart-is-closed')) {
  cartPanel.classList.add('cart-is-closed');
}

if (cartButton) {
  cartButton.addEventListener('click', openCart);
}

if (closeCartButton) {
  closeCartButton.addEventListener('click', closeCart);
}

//
window.CART = CART;
window.renderCart = renderCart;
window.openCart = openCart;
window.closeCart = closeCart;
