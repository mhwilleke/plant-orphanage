---
title: "Garden Party"
description: "Join us for our Spring Garden Party"
lead: "You're Invited!"
date: 2025-04-01T12:00:00+00:00
lastmod: 2025-04-01T12:00:00+00:00
draft: false
images: []
---

<div style="background: linear-gradient(135deg, #e8f5e9 0%, #fff8e1 100%); border-radius: 12px; padding: 2rem; margin-bottom: 1rem; text-align: center;">
  <h2 style="margin: 0 0 1rem 0; color: #2e7d32;">Spring Garden Party</h2>
  <p style="font-size: 1.5rem; font-weight: 600; margin: 0; color: #33691e;">Saturday, May 2</p>
  <p style="font-size: 1.25rem; margin: 0.5rem 0; color: #558b2f;">3pm - 5pm</p>
  <p style="margin: 0.5rem 0 0 0; color: #558b2f; font-style: italic;">At My Garden</p>
</div>

<div style="background: linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%); border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem;">
  <div style="text-align: center;">
    <p style="font-size: 2.5rem; margin: 0;">🥂</p>
    <h3 style="margin: 0.5rem 0; color: #7b1fa2; font-size: 1.4rem;">Elderflower Rose Lemonade</h3>
    <p style="margin: 0; color: #666; font-size: 1.1rem;">Refreshing and floral &mdash; with or without champagne!</p>
    <p style="margin: 0.5rem 0 0 0; color: #666; font-size: 1.1rem;">Cheese and crackers available &mdash; vegan included!</p>
  </div>
</div>

<div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem;">
  <div style="text-align: center;">
    <p style="font-size: 2.5rem; margin: 0;">📦</p>
    <h3 style="margin: 0.5rem 0; color: #2e7d32; font-size: 1.4rem;">Reserved Plants Ready</h3>
    <p style="margin: 0; color: #666; font-size: 1.1rem;">Reserved plants will be pre-boxed and waiting for you!</p>
  </div>
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 0.5rem 0;">

<div style="background: #fff3e0; border-radius: 8px; padding: 1.25rem; text-align: center;">
  <p style="font-size: 2rem; margin: 0;">🥚</p>
  <h3 style="margin: 0.5rem 0; color: #e65100;">Fresh Eggs</h3>
  <p style="margin: 0; color: #666;">Free 6-packs from our backyard chickens</p>
</div>

<div style="background: #fce4ec; border-radius: 8px; padding: 1.25rem; text-align: center;">
  <p style="font-size: 2rem; margin: 0;">🕯️</p>
  <h3 style="margin: 0.5rem 0; color: #c2185b;">Spring Candles</h3>
  <p style="margin: 0; color: #666;">Handmade candles to bring spring into your home</p>
</div>

<div style="background: #e3f2fd; border-radius: 8px; padding: 1.25rem; text-align: center;">
  <p style="font-size: 2rem; margin: 0;">🔄</p>
  <h3 style="margin: 0.5rem 0; color: #1565c0;">Plant Swap</h3>
  <p style="margin: 0; color: #666;">Bring your splits or starts to share on the swap table</p>
</div>

</div>

<div style="background: #f5f5f5; border-radius: 12px; padding: 1.5rem; margin-top: 1rem;">
  <h3 style="margin: 0 0 1rem 0; text-align: center; color: #333;">RSVP</h3>
  <form id="rsvp-form" style="max-width: 400px; margin: 0 auto;">
    <div style="margin-bottom: 1rem;">
      <label for="name" style="display: block; margin-bottom: 0.25rem; color: #555;">Name</label>
      <input type="text" id="name" name="name" required style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
    </div>
    <div style="margin-bottom: 1rem;">
      <label for="email" style="display: block; margin-bottom: 0.25rem; color: #555;">Preferred Contact Email</label>
      <input type="email" id="email" name="email" required style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
    </div>
    <div style="margin-bottom: 1rem;">
      <label for="party-size" style="display: block; margin-bottom: 0.25rem; color: #555;">Number of People</label>
      <input type="number" id="party-size" name="party-size" min="1" max="10" value="1" required style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
    </div>
    <button type="submit" id="submit-btn" style="width: 100%; padding: 0.75rem; background: #2e7d32; color: white; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer;">Submit RSVP</button>
  </form>
  <div id="rsvp-success" style="display: none; text-align: center; padding: 1rem; color: #2e7d32;">
    Thanks for your RSVP! We look forward to seeing you.
  </div>
  <div id="rsvp-error" style="display: none; text-align: center; padding: 1rem; color: #dc3545;">
  </div>
</div>

<script type="module">
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  "https://pcfigrjubeiztwprkcso.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZmlncmp1YmVpenR3cHJrY3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NzY0NjUsImV4cCI6MjA1NzU1MjQ2NX0.gJKbfjKUB8FdNG5S8YBqKZKjE5WR1FQcK5_VS0MC-Nw"
);

document.getElementById('rsvp-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const partySize = parseInt(document.getElementById('party-size').value);

  try {
    const { error } = await supabase
      .from('garden_party_rsvp')
      .insert({ name, email, party_size: partySize });

    if (error) throw error;

    document.getElementById('rsvp-form').style.display = 'none';
    document.getElementById('rsvp-success').style.display = 'block';
  } catch (error) {
    console.error('RSVP error:', error);
    document.getElementById('rsvp-error').textContent = 'Error submitting RSVP. Please try again.';
    document.getElementById('rsvp-error').style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Submit RSVP';
  }
});
</script>
