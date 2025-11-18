// Script pour ouvrir/fermer le menu hamburger
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('hamburger-menu');
  hamburgerButton.innerHTML = '☰'; // Le symbole du menu hamburger

  document.body.appendChild(hamburgerButton);

  // Lier l'événement au clic
  hamburgerButton.addEventListener('click', () => {
    hamburgerButton.classList.toggle('open'); // Ajoute/retire la classe pour ouvrir/fermer le menu
    const aside = document.querySelector('aside');
    aside.classList.toggle('open');
  });
});
