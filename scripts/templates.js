// imports for easyfying strings
import { slug } from "./helpers.js"

// headline of category
export function tplMenuCategoryHeading(id, label) {
  return `<h2 id="${slug(id)}" class="-dist16px">${label}</h2>`;
}

// one seperate menu-item
export function tplMenuItem(it) {
  return `<article class="flex-around -dist8px">
    <div>
      <h3>${it.name}</h3>
      <p>${it.desc}</p>
      <p>${it.portion || ''}</p>
      <p><b>CHF ${(it.priceCents / 100).toFixed(2)}</b></p>
    </div>
    <div class="menu-img-container">
      <img class="menu-img" src="${it.img}" alt="${it.name}">
      <button class="add-button" data-add="${it.id}">
        <img src="./assets/icons/add.svg" alt="add">
      </button>
    </div>
  </article>`;
}

// Link
export function tplMenuLink(id, name) {
  // # before id, for making Link jump to <h2 id="..."> 
  return `<a href="#${slug(id)}" class="btn">${name}</a>`;
}

// 1 row in cart
export function tplCartRow(it, id, qty, lineFormatted) {
  return `
    <div class="row">
      <p class="name -dist8px"><b>${it.name}</b></p>
      <p>
        <button class="btn" data-add="${id}" aria-label="Hinzufügen">+</button>
        <span class="qty">Anzahl: ${qty}</span>
        <button class="btn" data-del="${id}" aria-label="Entfernen">-</button>
      </p>
      <p class="line">${lineFormatted}</p>
    </div>`;
}

// Fallback if cart is empty
export const T_CART_EMPTY = '<p class="empty">Warenkorb ist leer</p>';
