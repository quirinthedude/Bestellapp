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

renderLinkBar();
renderMenu();

// check if there TO BE DELETED
// console.table(menu);
// console.table(menu.categories);
// console.log('Items:', menu.items.length, 'Restaurant:', restaurant.name);

//die menu rendern
function renderMenu() {
    const ITEMS = menu.items;
    let current = null;
    let html = '';
    ITEMS.forEach(it => {
        if (it.category !== current) {
            current = it.category;
            html += `<h2 id="${current}" class="-dist16px>${current}</h2><div>`;
        }
        html += `
      <article class="meneu-item">
        <h4>${it.name}</h4>
        <p>${it.desc}</p>
        <div class="meta">
          <span class="portion">${it.portion || ''}</span>
          <span class="price">CHF ${(it.priceCents / 100).toFixed(2)}</span>
        </div>
      </article>`;
    })
    html+= `</div>`;
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
//
