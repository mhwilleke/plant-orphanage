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

async function submit_adoption_form(e) {
    console.log("adopting plants");
    e.preventDefault();
    let data = parseTheForm();
    await sendToServer(data);
}
function parseTheForm() {
    return "";
}
async function sendToServer(data) {
    
}

async function prepare_adoption_form() {
    let { data: plants, error } = await supabase
    .from('OrphanedPlants')
    .select('plant_type,inventory_remaining,Plant_info');
    console.log(plants);
    var placeholder = document.querySelector("#placeholder");
    var template = document.querySelector('#orphaned-plant');
    for (const orphan of plants) {
        var clone = template.content.cloneNode(true);
        var link = clone.querySelector("#plant-name");
        link.textContent = orphan.plant_type;
        link.href = orphan.Plant_info;
        var dropdown = clone.querySelector("#adopting-number");

        if(orphan.inventory_remaining === 0) {
            var message = document.createElement("p");
            message.textContent = "All out!";
            message.style = "padding-left: 1em;";
            dropdown.after(message);
            dropdown.remove();
        } else {
            for(var i = 1; i <= orphan.inventory_remaining; ++i) {
                var option = document.createElement("option"); 
                option.textContent = i; 
                option.value = i;
                dropdown.appendChild(option);
            }
        }
        
        placeholder.appendChild(clone);
    }
    var button = document.querySelector("#adoption-form")
    button.addEventListener('submit', submit_adoption_form, false);
}

if(document.readyState === "interactive" || document.readyState === "complete" || document.readyState === "loaded")
    prepare_adoption_form();
else {
    document.addEventListener('DOMContentLoaded', prepare_adoption_form, false);
}
