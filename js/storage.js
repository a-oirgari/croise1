// storage.js
const STORAGE_KEY = "staff_manager_employees_v1";

const storage = {
    
    saveEmployees(employees) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
        } catch (e) {
            console.error("Erreur sauvegarde localStorage :", e);
        }
    },

    loadEmployees() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Erreur chargement localStorage :", e);
            return [];
        }
    },

    clear() {
        localStorage.removeItem(STORAGE_KEY);
    }
};

window.storage = storage;
