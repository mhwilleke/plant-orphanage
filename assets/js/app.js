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
import { createClient } from '@supabase/supabase-js'
import { data } from 'autoprefixer';

// Create a single supabase client for interacting with your database 
const supabase = createClient('https://lbnctgyadxhjbualvhbi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxibmN0Z3lhZHhoamJ1YWx2aGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDgzOTQyMjQsImV4cCI6MTk2Mzk3MDIyNH0.EXrx5wjh0w8_vBGUPfNR-PWpKU_MxjIqzR9Y2Miozsk')

async function prepare_adoption_form() {
    let { data: plants, error } = await supabase
    .from('OrphanedPlants')
    .select('plant_type,inventory_remaining,Plant_info');
    console.log(plants);
    var placeholder = document.querySelector("#placeholder");
    var template = document.querySelector('#orphaned-plant');
    for (const orphan of plants) {
        var clone = template.content.cloneNode(true);
        placeholder.appendChild(clone);
    }
}

if(document.readyState === "interactive" || document.readyState === "complete" || document.readyState === "loaded")
    prepare_adoption_form();
else {
    document.addEventListener('DOMContentLoaded', prepare_adoption_form, false);
}
