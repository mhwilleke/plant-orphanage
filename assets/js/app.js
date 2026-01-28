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
    var placeholder = document.querySelector("#placeholder");
    const season = placeholder ? placeholder.dataset.season : null;
    const { plants } = await fetchPlantInfo(season);
    console.log("Plants remaining on server:", plants);
    const receipt = [];
    await createAdopter(data.adopter);
    for (const orphan of data.plants) {
        const number_remaining = plants.find(p=>p.plant_type === orphan.plant).inventory_remaining;
        receipt.push(await adoptPlant(orphan, data.adopter, number_remaining));
    }
    thankyou(receipt);
}
function thankyou(receipt) {
    console.log("adoption completed. Receipt:", receipt);
    var adoption_form = document.querySelector("#adoption-form");
    const receipt_table = document.createElement("table");
    receipt_table.classList.add("receipt");
    const header_row = document.createElement("tr");
    addTh("Plant", header_row);
    addTh("Number Requested", header_row);
    addTh("Number Reserved", header_row);
    receipt_table.append(header_row);
    for (const adoption of receipt) {
        const result_line = document.createElement("tr");
    addTd(adoption.plant, result_line);
    addTd(adoption.requested, result_line);
    addTd(adoption.got, result_line);
    if(adoption.requested !== adoption.got) {
        result_line.classList.add("missing-plants")
    }
    receipt_table.append(result_line);
    }
    adoption_form.parentElement.append(receipt_table);
    if(receipt.findIndex(i => i.got !== i.requested) >= 0) {
    const message = document.createElement("p");
    message.textContent =
      "One or more of the plants you ordered were adopted while you were shopping. I gave you what is remaining and I apologize for the inconvenience.";
    adoption_form.parentElement.append(message);
    }
    const message = document.createElement("p");
    message.textContent =
      "Your request has been recorded! Please contact Marian (marianhhartman@gmail.com) if you see errors on your receipt. If you want a record of this receipt, please take a picture with your phone or a screenshot.";
    adoption_form.parentElement.append(message);
    adoption_form.remove();

    function addTh(content, row) {
      const elt = document.createElement("th");
      elt.textContent = content;
      row.append(elt);
    }

    function addTd(content, row) {
      const elt = document.createElement("td");
      elt.textContent = content;
      row.append(elt);
    }
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
async function fetchPlantInfo(season) {
  const adoptionsQuery = supabase
    .from("AdoptedPlants")
    .select("Orphaned_ID,inventory_requested");
  let orphansQuery = supabase
    .from("OrphanedPlants")
    .select("plant_type,inventory_available,Plant_info, id,plant_catagory,season")
    .order("plant_type");

  // Filter by season if provided
  if (season) {
    orphansQuery = orphansQuery.eq("season", season);
  }

  let { data: adoptions } = await adoptionsQuery;
  const adoption_totals = new Map();
  for (const instance of adoptions) {
    let oldtotal = adoption_totals.get(instance.Orphaned_ID) || 0;
    adoption_totals.set(instance.Orphaned_ID,
      oldtotal + instance.inventory_requested);
  }
  let { data: plants } = await orphansQuery;
  const plant_categories = new Map();
  for (const instance of plants) {
    if (!plant_categories.has(instance.plant_catagory)) {
      plant_categories.set(instance.plant_catagory, []);
    }
    plant_categories.get(instance.plant_catagory).push(instance);
    instance.inventory_remaining =
      Math.max(0, instance.inventory_available - (adoption_totals.get(instance.id) || 0));
  }
  return {plant_categories, plants};
}
async function prepare_adoption_form() {
    var placeholder = document.querySelector("#placeholder");
    // Only run on pages with the adoption form
    if (!placeholder) {
        return;
    }
    var template = document.querySelector('#orphaned-plant');
    // Get season from data attribute (spring or fall)
    const season = placeholder.dataset.season;
    console.log("Loading plants for season:", season);
    const {plant_categories} = await fetchPlantInfo(season);
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

// Color code the planting schedule table by month
function colorCodePlantingTable() {
    // Only run on pages with article content (like kitchen garden)
    const article = document.querySelector('article');
    if (!article) return;

    // Get only the first table (seeding/sowing calendar)
    const firstTable = article.querySelector('table');
    if (!firstTable) return;

    // Soft pastel colors for each month
    const monthColors = {
        'jan': 'rgba(200, 220, 240, 0.4)',  // soft blue (winter)
        'feb': 'rgba(210, 200, 230, 0.4)',  // soft lavender
        'mar': 'rgba(200, 230, 210, 0.4)',  // soft mint (early spring)
        'apr': 'rgba(210, 240, 210, 0.4)',  // soft green (spring)
        'may': 'rgba(240, 245, 200, 0.4)',  // soft yellow-green
        'jun': 'rgba(255, 245, 200, 0.4)',  // soft yellow (summer)
        'jul': 'rgba(255, 235, 200, 0.4)',  // soft peach
        'aug': 'rgba(255, 225, 200, 0.4)',  // soft orange
        'sep': 'rgba(245, 220, 200, 0.4)',  // soft tan (fall)
        'oct': 'rgba(240, 210, 190, 0.4)',  // soft brown
        'nov': 'rgba(220, 210, 200, 0.4)',  // soft gray-brown
        'dec': 'rgba(210, 220, 230, 0.4)',  // soft gray-blue (winter)
    };

    const rows = firstTable.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const firstCell = row.querySelector('td');
        if (!firstCell) return;

        const cellText = firstCell.textContent.toLowerCase();

        // Find which month this row belongs to
        for (const [month, color] of Object.entries(monthColors)) {
            if (cellText.includes(month)) {
                row.style.backgroundColor = color;
                break;
            }
        }
    });
}

if (document.readyState === "interactive" || document.readyState === "complete" || document.readyState === "loaded") {
    prepare_adoption_form();
    colorCodePlantingTable();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        prepare_adoption_form();
        colorCodePlantingTable();
    }, false);
}
