const openAddModalBtn = document.getElementById('openAddModal');
const addModal = document.getElementById('addModal');
const cancelAdd = document.getElementById('cancelAdd');
const photoInput = document.getElementById('photo');
const previewImg = document.getElementById('preview');
const addExpBtn = document.getElementById('addExp');
const experiencesContainer = document.getElementById('experiences');
const clearExpsBtn = document.getElementById('clearExps');

openAddModalBtn.addEventListener('click', () => addModal.classList.remove('hidden'));

cancelAdd.addEventListener('click', () => {
  addModal.classList.add('hidden');
  document.getElementById('addEmployeeForm').reset();
  previewImg.src = '';
  previewImg.classList.add('hidden');
  experiencesContainer.innerHTML = '';
});

// Preview image
photoInput.addEventListener('input', (e) => {
  const url = (e.target.value || '').trim();
  if (!url) { previewImg.classList.add('hidden'); previewImg.src = ''; return; }
  previewImg.src = url;
  previewImg.classList.remove('hidden');
});

function createExperienceNode() {
  const wrapper = document.createElement('div');
  wrapper.className = 'border p-3 rounded-lg space-y-2 bg-gray-50 relative';

  const company = document.createElement('input');
  company.type = 'text';
  company.placeholder = "Company";
  company.className = 'w-full border p-2 rounded';

  const role = document.createElement('input');
  role.type = 'text';
  role.placeholder = "Role";
  role.className = 'w-full border p-2 rounded';

  const datesRow = document.createElement('div');
  datesRow.className = 'grid grid-cols-2 gap-2';

  const from = document.createElement('input');
  from.type = 'date';
  from.className = 'border p-2 rounded';

  const to = document.createElement('input');
  to.type = 'date';
  to.className = 'border p-2 rounded';

  datesRow.appendChild(from);
  datesRow.appendChild(to);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'absolute top-1 right-1 bg-red-300 text-red-800 px-2 py-0.5 rounded text-xs';
  removeBtn.textContent = 'X';
  removeBtn.addEventListener('click', () => wrapper.remove());

  wrapper.appendChild(removeBtn);
  wrapper.appendChild(company);
  wrapper.appendChild(role);
  wrapper.appendChild(datesRow);

  return wrapper;
}

addExpBtn.addEventListener('click', () => {
  experiencesContainer.appendChild(createExperienceNode());
});
clearExpsBtn.addEventListener('click', () => experiencesContainer.innerHTML = '');

window.createExperienceNode = createExperienceNode;

window.validators = {
  name: (v) => /^[a-zA-Z]{2,}(?:\s[a-zA-Z]{2,}){1,2}$/.test(v),   
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone: (v) => /^(?:0[67])[0-9]{8}$/.test(v),   
  photo: (v) => /\.(jpg|jpeg|png|gif|webp)$/i.test(v),
};
