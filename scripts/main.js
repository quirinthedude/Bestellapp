//  imports
import { $, $$, within } from "./helpers.js";





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
// eventListener für add und remove
document.addEventListener('click', (ev) => {
  const add = ev.target.closest('[data-add]');
  if (add) {
    const id = add.dataset.add;
    CART[id] = (CART[id] || 0) + 1;
    console.log('CART jetzt:', CART);
    renderCart();
    return;  // optional
  }

  // später kommt hier "del"
  // const del = ev.target.closest('[data-del]');
  // if (del) { ... }
});

renderLinkBar();
renderMenu();


//die menu rendern
function renderMenu() {
  const ITEMS = menu.items;
  let current = null;
  let html = '';
  ITEMS.forEach(it => {
    if (it.category !== current) {
      current = it.category;
      html += `<h2 id="${current}" class="-dist16px">${current}</h2>`;
    }
    html += `<article class="flex-around -dist8px">
        <div>
        <h3>${it.name}</h3>
        <p>${it.desc}</p>
        <p>${it.portion || ''}</p>
        <p> <b>CHF ${(it.priceCents / 100).toFixed(2)}</b></p>
        </div>
        <div class="menu-img-container">
        <img class="menu-img" src="${it.img}" alt="${it.name}">
        <button class="add-button" data-add="${it.id}"><img src="./assets/icons/add.svg" alt="add"></button>

        </div>
      </article>`;
  })
  $('#content').innerHTML = html;
}

function renderLinkBar() {
  const MENULINK = menu.categories;
  let html = '';
  MENULINK.forEach(CAT => {
    const ID = CAT.id;
    const NAME = CAT.name;
    html += `<a href="${ID}" class="btn">${NAME}</a>`;
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

    rows += `
      <div class="row">
        <span class="qty">${qty}×</span>
        <span class="name">${it.name}</span>
        <span class="line">${CHF.format(line)}</span>
        <button data-del="${id}" aria-label="Entfernen">–</button>
      </div>`;
  }
  if (!rows) {
  rows = '<p class="empty">Warenkorb ist leer</p>';
}

  host.innerHTML = rows;
  TOTAL.innerText = CHF.format(total);

}

//
window.CART = CART;
window.renderCart = renderCart;
