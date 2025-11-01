// w3schools:

// To share code with other files, you use the export keyword.

// A module can have multiple named exports and, optionally, one default export.

// core : smart selector

// 

export const $ = (sel, root = document) => {    // variable sel should be directed 
    //                                             with its root, otherwise document
    if (typeof sel !== "string" || !sel) return null;
    //                                              if no string or empty ("") null
    const c = sel[0];                           // the first letter of sel
    if (c === "#") return root.getElementById(sel.slice(1));
    //                                          // the way how to get the # of sel
    if (c === ".") return root.getElementsByClassName(sel.slice(1));
    //                                          // the same .class
    return root.querySelector(sel);
    try {
        return root.querySelector(sel);     // kann SyntaxError werfen
    } catch (err) {
        if (err && err.name === "SyntaxError") return null; // still zurückgeben
        throw err; // andere Fehler (z. B. root=null) nicht verschlucken
    }
};

export const $$ = (sel, root = document) => root.querySelectorAll(sel);
export const within = (root) => (sel) => $(sel, root);

