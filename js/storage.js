// storage.js

function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(window.employees || []));
}

function loadEmployees() {
    const data = localStorage.getItem('employees');


    window.employees = data ? JSON.parse(data) : []

}


window.saveEmployees = saveEmployees;
window.loadEmployees = loadEmployees;
