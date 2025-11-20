// storage.js

function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(window.employees || []));
}

function loadEmployees() {
    const data = localStorage.getItem('employees');
    if (data) {
        return JSON.parse(data);
    }

    return [];

}


window.saveEmployees = saveEmployees;
window.loadEmployees = loadEmployees;
