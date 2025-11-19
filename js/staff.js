let employees = [];
let editMode = null;

const unassignedList = document.getElementById('unassignedList');
const addForm = document.getElementById('addEmployeeForm');
const profileModal = document.getElementById('profileModal');
const profileContent = document.getElementById('profileContent');
const closeProfile = document.getElementById('closeProfile');

function generateId() {
  return String(Date.now()) + Math.floor(Math.random() * 1000);
}

function collectExperiences() {
  const nodes = document.querySelectorAll('#experiences > div');

  return Array.from(nodes).map(node => {
    const [company, role] = node.querySelectorAll('input[type="text"]');
    const [from, to] = node.querySelectorAll('input[type="date"]');

    return {
      company: company.value.trim(),
      role: role.value.trim(),
      from: from.value,
      to: to.value
    };
  });
}


addForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // ---------------- VALIDATIONS ----------------
  const name = document.getElementById('name').value.trim();
  const role = document.getElementById('role').value.trim();
  const photo = document.getElementById('photo').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!window.validators.name(name)) return alert("Nom invalide (lettres uniquement)");
  if (email && !window.validators.email(email)) return alert("Email invalide");
  if (phone && !window.validators.phone(phone)) return alert("Téléphone invalide (8 à 15 chiffres)");
  if (photo && !window.validators.photo(photo)) return alert("URL photo invalide (jpg/png/webp)");

  // Vérification dates expériences
  const expNodes = document.querySelectorAll('#experiences > div');
  for (let node of expNodes) {
    const [from, to] = node.querySelectorAll('input[type="date"]');
    if (from.value && to.value && from.value > to.value) {
      return alert("Une expérience a une date de début supérieure à la date de fin.");
    }
  }

  if (editMode) {
    const emp = employees.find(e => e.id === editMode);

    emp.name = name;
    emp.role = role;
    emp.photo = photo;
    emp.email = email;
    emp.phone = phone;
    emp.experiences = collectExperiences();

    editMode = null;

  } else {
    const emp = {
      id: generateId(),
      name,
      role,
      photo,
      email,
      phone,
      experiences: collectExperiences(),
      zone: null,
    };

    employees.push(emp);
  }

  document.getElementById('addModal').classList.add('hidden');
  addForm.reset();
  document.getElementById('experiences').innerHTML = '';
  document.getElementById('preview').classList.add('hidden');
  document.getElementById('preview').src = '';

  renderUnassigned();
});


function createEmployeeNode(emp) {
  const li = document.createElement('li');
  li.className = 'bg-white p-2 rounded shadow flex items-center gap-3 hover:shadow-md';
  li.dataset.id = emp.id;

  li.innerHTML = `
    <img src="${emp.photo || 'https://via.placeholder.com/48'}" class="w-12 h-12 rounded object-cover" />

    <div class="flex-1 cursor-pointer openProfileBtn">
      <div class="font-semibold">${emp.name}</div>
      <div class="text-xs text-gray-600">${emp.role}</div>
    </div>

    <div class="flex gap-2">
      <button class="editBtn text-blue-600 text-sm">Edit</button>
      <button class="deleteBtn text-red-600 text-sm">Delet</button>
    </div>
  `;

  li.querySelector('.openProfileBtn').addEventListener('click', () => openProfile(emp.id));
  li.querySelector('.editBtn').addEventListener('click', () => editEmployee(emp.id));
  li.querySelector('.deleteBtn').addEventListener('click', () => deleteEmployee(emp.id));

  return li;
}

function renderUnassigned() {
  unassignedList.innerHTML = '';
  employees.filter(e => !e.zone).forEach(emp => unassignedList.appendChild(createEmployeeNode(emp)));
  refreshAllZones();
}


function createZoneCard(emp, zoneKey) {
  const meta = window.zonesMeta[zoneKey];
  const zoneEl = document.getElementById(meta.id);
  const occ = zoneEl.querySelector('.zone-occupants');

  const card = document.createElement('div');
  card.className = 'bg-white p-2 rounded shadow flex items-center justify-between small-card';
  card.dataset.id = emp.id;

  card.innerHTML = `
    <div class="flex items-center gap-2 cursor-pointer openProfileBtn">
      <img src="${emp.photo}" class="w-8 h-8 rounded object-cover">
      <div>
        <div class="font-semibold text-sm">${emp.name}</div>
        <div class="text-xs text-gray-600">${emp.role}</div>
      </div>
    </div>

    <div class="flex gap-2">
      <button class="editBtn text-blue-600 text-sm">✏️</button>
      <button class="deleteBtn text-red-600 text-sm">🗑️</button>



      <button class="removeBtn text-red-600">X</button>
    </div>
  `;

  occ.appendChild(card);

  card.querySelector('.openProfileBtn').addEventListener('click', () => openProfile(emp.id));
  card.querySelector('.editBtn').addEventListener('click', () => editEmployee(emp.id));
  card.querySelector('.deleteBtn').addEventListener('click', () => deleteEmployee(emp.id));
  card.querySelector('.removeBtn').addEventListener('click', () => removeFromZone(emp.id, zoneKey));
}


function assignEmployeeToZone(empId, zoneKey) {
  const emp = employees.find(e => e.id === empId);
  if (!emp) return;

  const meta = window.zonesMeta[zoneKey];
  const zoneEl = document.getElementById(meta.id);
  const occ = zoneEl.querySelector('.zone-occupants');

  if (occ.children.length >= meta.capacity) {
    alert('Capacité atteinte');
    return;
  }

  if (!window.isEligibleForZone(emp, zoneKey)) {
    alert("Non autorisé");
    return;
  }

  emp.zone = zoneKey;

  const cardToRemove = document.querySelector(`[data-id="${emp.id}"]`);
  if (cardToRemove) {
    cardToRemove.remove();
  }

  createZoneCard(emp, zoneKey);

  assignModal.classList.add('hidden');

  window.refreshZoneIndicators && window.refreshZoneIndicators();
}


function removeFromZone(empId, zoneKey) {
  const emp = employees.find(e => e.id === empId);
  emp.zone = null;

  const zoneEl = document.getElementById(window.zonesMeta[zoneKey].id);
  const card = zoneEl.querySelector(`[data-id='${empId}']`);
  if (card) card.remove();

  renderUnassigned();
}


function openProfile(empId) {
  const emp = employees.find(e => e.id === empId);

  profileContent.innerHTML = `
    <div class="flex gap-4">
      <img src="${emp.photo}" class="w-28 h-28 rounded object-cover" />
      <div>
        <h3 class="text-xl font-semibold">${emp.name}</h3>
        <div>${emp.role}</div>
        <div class="text-sm mt-2">📧 ${emp.email}</div>
        <div class="text-sm">📞 ${emp.phone}</div>
        <div class="mt-2 text-sm">Localisation : <strong>${emp.zone || 'Unassigned'}</strong></div>
      </div>
    </div>

    <div class="mt-3">
      <h4 class="font-semibold">Expériences :</h4>

      <div class="space-y-2 mt-2">
        ${emp.experiences.map(exp => `
          <div class="p-2 bg-gray-100 rounded border">
            <div><strong>${exp.company}</strong> — ${exp.role}</div>
            <div class="text-sm text-gray-600">${exp.from} → ${exp.to}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  profileModal.classList.remove('hidden');
}


closeProfile.addEventListener('click', () => profileModal.classList.add('hidden'));


function editEmployee(empId) {
  const emp = employees.find(e => e.id === empId);

  editMode = empId;

  document.getElementById('name').value = emp.name;
  document.getElementById('role').value = emp.role;
  document.getElementById('photo').value = emp.photo;
  document.getElementById('email').value = emp.email;
  document.getElementById('phone').value = emp.phone;

  const preview = document.getElementById('preview');
  preview.src = emp.photo;
  preview.classList.remove('hidden');

  const expContainer = document.getElementById('experiences');
  expContainer.innerHTML = '';
  emp.experiences.forEach(exp => {
  const node = window.createExperienceNode();
  const inputs = node.querySelectorAll('input');

  inputs[0].value = exp.company;
  inputs[1].value = exp.role;
  inputs[2].value = exp.from;
  inputs[3].value = exp.to;

  expContainer.appendChild(node);
});


  document.getElementById('addModal').classList.remove('hidden');
}


function deleteEmployee(empId) {
  if (!confirm("Supprimer cet employé ?")) return;

  employees = employees.filter(e => e.id !== empId);

  renderUnassigned();
  refreshAllZones();
}


function refreshAllZones() {
  Object.keys(window.zonesMeta).forEach(key => {
    const zoneEl = document.getElementById(window.zonesMeta[key].id);
    zoneEl.querySelector('.zone-occupants').innerHTML = '';
  });

  employees.filter(e => e.zone).forEach(emp => {
    createZoneCard(emp, emp.zone);
  });

  window.refreshZoneIndicators();
}

window.employees = employees;
window.assignEmployeeToZone = assignEmployeeToZone;
window.removeFromZone = removeFromZone;
