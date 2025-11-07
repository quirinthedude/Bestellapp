export let menuHeader = `<h2 id="${current}" class="-dist16px>${current}</h2>`;
export let menuItemFlexContainer = `<article class="flex-around -dist8px">`;
export let menuItemFlexContainerClose =`</article>`;
export let menuDescription = `
      <article class="meneu-item">
        <h4>${it.name}</h4>
        <p>${it.desc}</p>
        <div class="meta">
          <span class="portion">${it.portion || ''}</span>
          <span class="price">CHF ${(it.priceCents / 100).toFixed(2)}</span>
        </div>
      </article>`; 