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
        return root.querySelector(sel);     // can cause SyntaxError 
    } catch (err) {
        if (err && err.name === "SyntaxError") return null; // silent return
        throw err; // opther errors need to be shown
    }
};

export const $$ = (sel, root = document) => root.querySelectorAll(sel);
export const within = (root) => (sel) => $(sel, root);

export const slug = (str) => {
    return str
        .toLowerCase()
        .normalize("NFD")                     // ä -> a
        .replace(/[\u0300-\u036f]/g, '')    // remove diacritics
        .replace(/[^a-z0-9]+/g, '-')        // all different th a-z and 0-9 to be '-'
        .replace(/^-+|-+$/g, '');             // trim
};

