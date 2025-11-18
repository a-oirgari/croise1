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
  return Array.from(document.querySelectorAll('#experiences input')).map(i => i.value).filter(Boolean);
}


addForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (editMode) {
    // MODE ÉDITION
    const emp = employees.find(e => e.id === editMode);

    emp.name = document.getElementById('name').value.trim();
    emp.role = document.getElementById('role').value.trim();
    emp.photo = document.getElementById('photo').value.trim();
    emp.email = document.getElementById('email').value.trim();
    emp.phone = document.getElementById('phone').value.trim();
    emp.experiences = collectExperiences();

    editMode = null; // reset mode

  } else {
    // MODE AJOUT
    const emp = {
      id: generateId(),
      name: document.getElementById('name').value.trim(),
      role: document.getElementById('role').value.trim(),
      photo: document.getElementById('photo').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      experiences: collectExperiences(),
      zone: null,
    };

    employees.push(emp);
  }

  // FERMETURE PROPRE ET DÉFINITIVE
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

  // Affectation à la zone
  emp.zone = zoneKey;

  // Retirer l'employé de la liste (aside)
  const cardToRemove = document.querySelector(`[data-id="${emp.id}"]`);
  if (cardToRemove) {
    cardToRemove.remove(); 
  }

  // Créer une carte réduite dans la zone
  const card = document.createElement('div');
  card.className = 'bg-white p-2 rounded shadow flex items-center justify-between small-card';  // petite carte
  card.dataset.id = emp.id;

  card.innerHTML = `
    <div class="flex items-center gap-2 cursor-pointer openProfileBtn">
      <img src="${emp.photo}" class="w-8 h-8 rounded object-cover">  <!-- Image plus petite -->
      <div>
        <div class="font-semibold text-sm">${emp.name}</div>
        <div class="text-xs text-gray-600">${emp.role}</div>
      </div>
    </div>

    <div class="flex gap-2">
      <button class="editBtn text-blue-600 text-sm">✏️Edit</button>
      <button class="deleteBtn text-red-600 text-sm">🗑️Delete</button>
      <button class="removeBtn text-red-600">X</button>
    </div>
  `;

  occ.appendChild(card);

  // Ajout des listeners pour les boutons
  card.querySelector('.openProfileBtn').addEventListener('click', () => openProfile(emp.id));
  card.querySelector('.editBtn').addEventListener('click', () => editEmployee(emp.id));
  card.querySelector('.deleteBtn').addEventListener('click', () => deleteEmployee(emp.id));
  card.querySelector('.removeBtn').addEventListener('click', () => removeFromZone(emp.id, zoneKey));

  // Fermer le modal après l'assignation
  assignModal.classList.add('hidden');

  // Rafraîchir les indicateurs de zone
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
      <ul class="list-disc ml-5 mt-1">
        ${emp.experiences.map(e => `<li>${e}</li>`).join('')}
      </ul>
    </div>
  `;

  profileModal.classList.remove('hidden');
}

closeProfile.addEventListener('click', () => profileModal.classList.add('hidden'));


function editEmployee(empId) {
  const emp = employees.find(e => e.id === empId);

  // On active le mode édition
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
    node.querySelectorAll('input')[0].value = exp;
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
    assignEmployeeToZone(emp.id, emp.zone);
  });

  window.refreshZoneIndicators();
}

window.employees = employees;
window.assignEmployeeToZone = assignEmployeeToZone;
window.removeFromZone = removeFromZone;
