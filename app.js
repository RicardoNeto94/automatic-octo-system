const API_BASE = ''; // same-origin on Vercel
const API_KEY = '';  // Optional: X-API-Key if set in env

const ALLERGENS = [
  ["CE","Celery"], ["GL","Gluten"], ["CR","Crustaceans"], ["EG","Eggs"], ["Fl","Fish"],
  ["LU","Lupin"], ["MO","Molluscs"], ["Mi","Milk"], ["MU","Mustard"], ["NU","Nuts"],
  ["PE","Peanuts"], ["SE","Sesame"], ["SO","Soya"], ["SU","Sulfites"], ["GA","Garlic"],
  ["ON","Onion"], ["MR","Mushrooms"]
];

const els = {
  allergenGrid: document.getElementById('allergenGrid'),
  menuGrid: document.getElementById('menuGrid'),
  pickCounter: document.getElementById('pickCounter'),
  staffBtn: document.getElementById('staffBtn'),
  guestBtn: document.getElementById('guestBtn'),
  resetBtn: document.getElementById('resetBtn'),
};

let state = {
  mode: 'staff',
  allergens: new Set(),
  menu: [],
  selectedDishes: new Set(),
};

function apiHeaders() {
  const h = { 'Content-Type': 'application/json' };
  if (API_KEY) h['X-API-Key'] = API_KEY;
  return h;
}

async function fetchMenu() {
  const res = await fetch(`${API_BASE}/api/menu`, { headers: apiHeaders() });
  if (!res.ok) throw new Error('Failed to fetch menu');
  const data = await res.json();
  state.menu = Array.isArray(data.menu) ? data.menu : [];
  renderMenu();
}

async function evaluate() {
  const res = await fetch(`${API_BASE}/api/evaluate-allergens`, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify({ allergens: Array.from(state.allergens) })
  });
  if (!res.ok) throw new Error('Evaluation failed');
  const data = await res.json();
  const safeIds = new Set((data.safe || []).map(d => d.id));
  for (const card of document.querySelectorAll('[data-dish-id]')) {
    const id = card.getAttribute('data-dish-id');
    if (safeIds.has(id)) { card.classList.add('safe'); card.style.opacity = '1'; }
    else { card.classList.remove('safe'); card.style.opacity = '0.35'; }
  }
}

function renderAllergens() {
  els.allergenGrid.innerHTML = '';
  ALLERGENS.forEach(([code, label]) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.textContent = `${label} (${code})`;
    div.dataset.code = code;
    div.addEventListener('click', () => {
      if (state.allergens.has(code)) state.allergens.delete(code);
      else state.allergens.add(code);
      div.classList.toggle('selected');
      evaluate().catch(console.error);
    });
    els.allergenGrid.appendChild(div);
  });
}

function renderMenu() {
  els.menuGrid.innerHTML = '';
  state.menu.forEach(d => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.dishId = d.id;
    card.innerHTML = `<strong>${d.name}</strong><br><span class="muted">€${d.price.toFixed(2)}</span>`;

    card.addEventListener('click', () => {
      if (state.mode === 'guest') {
        if (state.selectedDishes.has(d.id)) state.selectedDishes.delete(d.id);
        else state.selectedDishes.add(d.id);
        card.classList.toggle('selected');
        updatePickCounter();
      } else {
        if (state.selectedDishes.has(d.id)) state.selectedDishes.delete(d.id);
        else state.selectedDishes.add(d.id);
        card.classList.toggle('selected');
        updatePickCounter();
        alert(`${d.name}\nAllergens: ${(d.allergens || []).join(', ') || 'None'}`);
      }
    });

    els.menuGrid.appendChild(card);
  });
}

function updatePickCounter() {
  els.pickCounter.textContent = String(state.selectedDishes.size);
}

function bindModeSwitch() {
  function syncButtons() {
    els.staffBtn.classList.toggle('active', state.mode === 'staff');
    els.guestBtn.classList.toggle('active', state.mode === 'guest');
  }
  els.staffBtn.addEventListener('click', () => { state.mode = 'staff'; syncButtons(); });
  els.guestBtn.addEventListener('click', () => { state.mode = 'guest'; syncButtons(); });
  syncButtons();
}

function bindReset() {
  els.resetBtn.addEventListener('click', () => {
    state.allergens.clear();
    state.selectedDishes.clear();
    updatePickCounter();
    document.querySelectorAll('#allergenGrid .card').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('#menuGrid .card').forEach(el => { el.classList.remove('selected'); el.style.opacity = '1'; });
    evaluate().catch(() => {});
  });
}

async function init() {
  bindModeSwitch();
  bindReset();
  renderAllergens();
  await fetchMenu();
  await evaluate();
}

init().catch(err => {
  console.error(err);
  alert('Failed to initialize the app. Check console for details.');
});