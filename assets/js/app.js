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

// Create a single supabase client for interacting with your database 
const supabase = createClient(
  "https://pcfigrjubeiztwprkcso.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZmlncmp1YmVpenR3cHJrY3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NzY0NjUsImV4cCI6MjA1NzU1MjQ2NX0.gJKbfjKUB8FdNG5S8YBqKZKjE5WR1FQcK5_VS0MC-Nw"
);

let alreadysent = false;

async function submit_adoption_form(e) {
  console.log("adopting plants");
  e.preventDefault();
  let data = parseTheForm();
  if (!data.adopter.email) {
    highlightMissingEmailField();
    return;
  }
  if (!alreadysent) {
    alreadysent = true;
    await sendToServer(data);
  }
}
function highlightMissingEmailField() {
    var adopter_email = document.querySelector("#email-group");
    adopter_email.classList.add("missing");
    adopter_email.scrollIntoView({behavior:"instant",block: "start", inline: "nearest"})
}
function parseTheForm() {
    var plantswanted = document.querySelectorAll(".number-wanted");
    let data = {
        adopter: {},
        plants: [],
    };
    for (const orphan of plantswanted) {
        if (orphan.value != 0) {
            data.plants.push({
              plant: orphan.dataset.plant,
              plant_id: orphan.dataset.plant_id,
              number: parseInt(orphan.value),
            });
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
    const { plants } = await fetchPlantInfo();
    console.log("Plants remaining on server:", plants);
    await createAdopter(data.adopter);
    for (const orphan of data.plants) {
        const number_remaining = plants.find(p=>p.plant_type === orphan.plant).inventory_remaining;
        await adoptPlant(orphan, data.adopter, number_remaining);
    }
    thankyou();
}
function thankyou() {
    var adoption_form = document.querySelector("#adoption-form");
    const message = document.createElement("p");
    message.textContent = "Your request has been recorded! Please contact Marian (marianhhartman@gmail.com) if you see errors on your receipt.";
    adoption_form.parentElement.append(message);
    adoption_form.remove();
}
async function createAdopter(person) {
    console.log("creating adopter", person);
    const { data: response, error } = await supabase
        .from('Adopters')
        .insert([
            { email: person.email, name: person.name, address: person.address },
        ]);
    console.log(response, error);
}
async function adoptPlant(plant, person, number_remaining) {
    console.log(person, "is adopting", plant, "from a remaining", number_remaining);
    const number_to_adopt = Math.min(number_remaining, plant.number);
    let { data: response, error } = await supabase
        .from('AdoptedPlants')
        .insert([
            { Orphaned_ID: plant.plant_id, plant_type: plant.plant, inventory_requested: number_to_adopt, requester: person.email },
        ]);
    console.log(response, error);
    return {plant: plant.plant, requested: plant.number, got: number_to_adopt}
}
async function fetchPlantInfo() {
  const adoptionsQuery = supabase
    .from("AdoptedPlants")
    .select("Orphaned_ID,inventory_requested");
  const orphansQuery = supabase
    .from("OrphanedPlants")
    .select("plant_type,inventory_available,Plant_info, id,plant_catagory")
    .order("plant_type");
  let { data: adoptions } = await adoptionsQuery;
  const adoption_totals = new Map();
  for (const instance of adoptions) {
    let oldtotal = adoption_totals.get(instance.Orphaned_ID) || 0;
    adoption_totals[instance.Orphaned_ID] =
      oldtotal + instance.inventory_requested;
  }
  let { data: plants } = await orphansQuery;
  const plant_categories = new Map();
  for (const instance of plants) {
    if (!plant_categories.has(instance.plant_catagory)) {
      plant_categories.set(instance.plant_catagory, []);
    }
    plant_categories.get(instance.plant_catagory).push(instance);
    instance.inventory_remaining =
      instance.inventory_available - (adoption_totals.get(instance.id) || 0);
  }
  return {plant_categories, plants};
}
async function prepare_adoption_form() {
    const {plant_categories} = await fetchPlantInfo();
    var placeholder = document.querySelector("#placeholder");
    var template = document.querySelector('#orphaned-plant');
    console.log(plant_categories);
    for(const [category_name,plants_in_category] of plant_categories) {
        var header = document.createElement("H2");
        header.textContent = category_name + "s";
        placeholder.appendChild(header);
        for (const orphan of plants_in_category) {
            var clone = template.content.cloneNode(true);
            var link = clone.querySelector("#plant-name");
            link.textContent = orphan.plant_type;
            link.href = orphan.Plant_info;
            var notes = clone.querySelector("#notes-placeholder")
            if (orphan.inventory_remaining === 0) {
                notes.remove();
            }
            notes.textContent = `Starting Inventory: ${orphan.inventory_available}`;

            var dropdown = clone.querySelector("#adopting-number");

            if (orphan.inventory_remaining === 0) {
                var message = document.createElement("p");
                message.textContent = "All out!";
                message.style = "padding-left: 1em;";
                dropdown.after(message);
                dropdown.remove();
            } else {
                for (var i = 1; i <= orphan.inventory_remaining; ++i) {
                    var option = document.createElement("option");
                    option.textContent = i;
                    option.value = i;
                    dropdown.appendChild(option);
                }
                dropdown.dataset.plant = orphan.plant_type;
                dropdown.dataset.plant_id = orphan.id;
            }

            placeholder.appendChild(clone);
        }
    }
    var button = document.querySelector("#adoption-form")
    button.addEventListener('submit', submit_adoption_form, false);
}

if (document.readyState === "interactive" || document.readyState === "complete" || document.readyState === "loaded")
    prepare_adoption_form();
else {
    document.addEventListener('DOMContentLoaded', prepare_adoption_form, false);
}
