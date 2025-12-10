// helpers.js
// Kleiner DOM-Helper für dieses Projekt:
// $(selector, root?) → root.querySelector(selector)

export const $ = (selector, root = document) => root.querySelector(selector);


// erzeugt url- und id-taugliche Strings: "Pizza Margherita" -> "pizza-margherita"
export const slug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Leerzeichen -> Bindestrich
    .replace(/[^a-z0-9\-]/g, ''); // Sonderzeichen entfernen



/*
  Lernpfad-Notiz:
  Während des Projekts habe ich eine erweiterte Version dieser Helper-Funktion
  ausprobiert, mit eigenen Fallbacks für IDs, Klassen und Fehlerbehandlung.
  Für das finale Projekt nutze ich bewusst die schlanke Variante oben,
  weil querySelector hier völlig ausreicht und der Code so klarer bleibt.

  Die Lernversion lasse ich nur kommentiert stehen, um meinen Weg
  nachvollziehbar zu machen – sie wird im Projekt nicht ausgeführt.

  Beispiel der erweiterten Lernvariante:

  export const $ = (sel, root = document) => {
    // 
    if (typeof sel !== "string" || !sel) return null;

    const c = sel[0];              // erstes Zeichen: "#", ".", etc.

    if (c === "#") {
      // ID-Selektor → getElementById (ohne "#")
      return root.getElementById(sel.slice(1));
    }

    if (c === ".") {
      // Klassen-Selektor → getElementsByClassName, erstes Element
      const list = root.getElementsByClassName(sel.slice(1));
      return list.length ? list[0] : null;
    }

    try {
      // allgemeiner CSS-Selektor
      return root.querySelector(sel);
    } catch (err) {
      if (err && err.name === "SyntaxError") {
        // Ungültiger Selektor → kein Element
        return null;
      }
      // andere Fehler weiterwerfen
      throw err;
    }
  };
*/
