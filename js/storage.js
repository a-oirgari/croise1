
function saveEmployees(list) {
    localStorage.setItem('employees', JSON.stringify(list || []));
    window.employees = list; // on synchronise aussi la variable globale
}


function loadEmployees() {
    const data = localStorage.getItem('employees');


    window.employees = data ? JSON.parse(data) : []

}


window.saveEmployees = saveEmployees;
window.loadEmployees = loadEmployees;
