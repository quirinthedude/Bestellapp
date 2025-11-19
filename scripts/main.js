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

// eventListener für add und remove
document.addEventListener('click', (ev) => {
  const add = ev.target.closest('[data-add]');
  const del = ev.target.closest('[data-del]');
  if (add) {
    const id = add.dataset.add;
    CART[id] = (CART[id] || 0) + 1;
    console.log('CART jetzt:', CART);
    renderCart();
    return;  // optional
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

  // später kommt hier "del"
  // const del = ev.target.closest('[data-del]');
  // if (del) { ... }
});

renderLinkBar();
renderMenu();


// die menu rendern
function renderMenu() {
  const ITEMS = menu.items;
  let current = null;
  let html = '';

  ITEMS.forEach(it => {
    if (it.category !== current) {
      current = it.category;
      // Überschrift aus Template
      html += tplMenuCategoryHeading(current);
    }
    // Item aus Template
    html += tplMenuItem(it);
  });

  $('#content').innerHTML = html;
}

function renderLinkBar() {
  const MENULINK = menu.categories;
  let html = '';

  MENULINK.forEach(CAT => {
    const ID = CAT.id;
    const NAME = CAT.name;
    // Link aus Template
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

    // Zeile aus Template, Geld bereits formatiert
    rows += tplCartRow(it, id, qty, CHF.format(line));
  }

  if (!rows) {
    rows = T_CART_EMPTY;
  }

  host.innerHTML = rows;
  TOTAL.innerText = CHF.format(total);
}

//
window.CART = CART;
window.renderCart = renderCart;
