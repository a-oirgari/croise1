// zones.js — règles métier et assign modal

const zonesMeta = {
  conference: { id: 'zone-conference', name: 'Salle de conférence', capacity: 10 },
  reception: { id: 'zone-reception', name: 'Réception', capacity: 1 },
  serveurs: { id: 'zone-serveurs', name: 'Salle des serveurs', capacity: 2 },
  securite: { id: 'zone-securite', name: 'Salle de sécurité', capacity: 2 },
  personnel: { id: 'zone-personnel', name: 'Salle du personnel', capacity: 6 },
  archives: { id: 'zone-archives', name: "Salle d'archives", capacity: 1 },
};

const zoneRules = {
  reception: ['Receptionniste', 'Manager'],
  serveurs: ['Technicien IT', 'Manager'],
  securite: ['Agent de sécurité', 'Manager'],
  archives: ['Manager'],
};

function isEligibleForZone(employee, zoneKey) {
  const role = (employee.role || '').trim();
  if (!role) return false;

  if (role.toLowerCase() === 'manager') return true;

  if (role.toLowerCase() === 'nettoyage' || role.toLowerCase() === 'menage') {
    return zoneKey !== 'archives';
  }

  if (zoneRules[zoneKey]) {
    return zoneRules[zoneKey].some(r => r.toLowerCase() === role.toLowerCase());
  }

  return true;
}

const assignModal = document.getElementById('assignModal');
const eligibleList = document.getElementById('eligibleList');
const closeAssign = document.getElementById('closeAssign');
let currentAssignZone = null;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.zone-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const zoneKey = btn.getAttribute('data-zone');
      openAssignModal(zoneKey);
    });
  });
});

closeAssign.addEventListener('click', () => assignModal.classList.add('hidden'));

function openAssignModal(zoneKey) {
  currentAssignZone = zoneKey;
  eligibleList.innerHTML = '';

  const candidates = (window.employees || [])
    .filter(emp => (!emp.zone || emp.zone === null) && isEligibleForZone(emp, zoneKey));

  if (candidates.length === 0) {
    eligibleList.innerHTML = '<div class="p-2 text-sm text-gray-600">Aucun employé éligible disponible.</div>';
  } else {
    candidates.forEach(emp => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between p-2 border rounded';
      row.innerHTML = `
        <div class="flex items-center gap-2">
          <img src="${emp.photo || 'https://via.placeholder.com/48'}" class="w-10 h-10 rounded object-cover" />
          <div>
            <div class="font-semibold">${emp.name}</div>
            <div class="text-xs text-gray-600">${emp.role}</div>
          </div>
        </div>
        <div>
          <button class="assignBtn px-2 py-1 rounded bg-green-500 text-white">Affecter</button>
        </div>
      `;

      row.querySelector('.assignBtn').addEventListener('click', () => {
        window.assignEmployeeToZone(emp.id, zoneKey);
        assignModal.classList.add('hidden');
        window.refreshZoneIndicators && window.refreshZoneIndicators();
      });

      eligibleList.appendChild(row);
    });
  }

  assignModal.classList.remove('hidden');
}


function refreshZoneIndicators() {
  Object.keys(zonesMeta).forEach(key => {
    const meta = zonesMeta[key];
    const zoneLogical = document.getElementById(meta.id);
    const occupants = zoneLogical ? zoneLogical.querySelector('.zone-occupants').children.length : 0;

    if (meta.required && occupants === 0 && key !== 'conference' && key !== 'personnel') {
      zoneLogical && zoneLogical.classList.add('required-empty');
    } else {
      zoneLogical && zoneLogical.classList.remove('required-empty');
    }
  });
}

window.zonesMeta = zonesMeta;
window.isEligibleForZone = isEligibleForZone;
window.refreshZoneIndicators = refreshZoneIndicators;
