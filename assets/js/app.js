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
    var plantswanted = document.querySelectorAll(".number-wanted");
    let data = {
        adopter:{},
        plants:[]
    };
    for (const orphan of plantswanted) {
        if (orphan.value != 0) {
            data.plants.push({plant:orphan.dataset.plant, number:parseInt(orphan.value)});
        }
    }
    var adopter = document.querySelector("#adopter");
    data.adopter.name = adopter.value;
    var adopter_email = document.querySelector("#adopter-email");
    data.adopter.email = adopter_email.value;
    var address = document.querySelector("#address");
    data.adopter.address = address.value;
    return data;
}
async function sendToServer(data) {
    console.log("sending adoption request", data);
    await createAdopter(data.adopter);
    for (const orphan of data.plants){
        await adoptPlant(orphan, data.adopter);
    }
    thankyou(data.plants);
}
function thankyou(plants){
    var adoption_form = document.querySelector("#adoption-form");
    const message = document.createElement("p");
    message.textContent = "Your request has been recorded! Marian (marianhhartman@gmail.com) will be in contact with you soon."; 
    adoption_form.parentElement.append(message);
    adoption_form.remove();
}
async function createAdopter(person) {
    console.log("creating adopter", person);
    const { data:response, error } = await supabase
        .from('Adopters')
        .insert([
            { email: person.email, name: person.name, address: person.address },
        ]);
    console.log(response, error);
}
async function adoptPlant(plant, person) {
    console.log(person, "is adopting", plant);
    let { data:response, error } = await supabase
        .from('AdoptedPlants')
        .insert([
            { plant_type: plant.plant, inventory_requested: plant.number, requester: person.email },
        ]);
    console.log(response, error);
    ({ data:response, error } = await supabase
        .rpc('reduce-inventory', {
            number_adopted:plant.number, 
            plant:plant.plant
          }));
    console.log(response, error);
}
async function prepare_adoption_form() {
    let { data: plants, error } = await supabase
    .from('OrphanedPlants')
    .select('plant_type,inventory_remaining,Plant_info,availability').order("plant_type");
    var placeholder = document.querySelector("#placeholder");
    var template = document.querySelector('#orphaned-plant');
    for (const orphan of plants) {
        var clone = template.content.cloneNode(true);
        var link = clone.querySelector("#plant-name");
        link.textContent = orphan.plant_type;
        link.href = orphan.Plant_info;
        var availability = clone.querySelector("#availability-placeholder")
        if(orphan.inventory_remaining === 0){
            availability.remove();
        }
        availability.textContent = "| available " + orphan.availability

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
            dropdown.dataset.plant = orphan.plant_type;
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
