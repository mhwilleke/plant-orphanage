// app.js for concatenation of smaller libraryies
// to reduce http requests of small files
'use strict';

// Prefetch in-viewport links during idle time
import { listen } from 'quicklink/dist/quicklink.mjs';
listen();

// lazy sizes for image loading
import 'lazysizes';

// global alert
import './assets/js/alert';

function prepare_adoption_form() {
    console.log("Getting the form ready");
}

if(document.readyState === "interactive" || document.readyState === "complete" || document.readyState === "loaded")
    prepare_adoption_form();
else {
    document.addEventListener('DOMContentLoaded', prepare_adoption_form, false);
}
