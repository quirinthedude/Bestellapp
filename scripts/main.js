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

// check if there TO BE DELETED
// console.table(menu);
// console.table(menu.categories);
// console.log('Items:', menu.items.length, 'Restaurant:', restaurant.name);

//die menu rendern

