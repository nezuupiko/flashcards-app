// 1. Données
let cartes = JSON.parse(localStorage.getItem('mesFlashcards')) || [
    { question: "Quelle est la capitale de la France ?", reponse: "Paris" },
    { question: "Combien font 7 x 8 ?", reponse: "56" },
    { question: "En quelle année a eu lieu la Révolution française ?", reponse: "1789" },
    { question: "Quel est le symbole chimique de l'eau ?", reponse: "H2O" },
    { question: "Qui a peint la Joconde ?", reponse: "Léonard de Vinci" }
];

let indexActuel = 0;

// 2. Éléments HTML
const carteEl = document.getElementById('carte');
const questionEl = document.querySelector('.question');
const reponseEl = document.querySelector('.reponse');
const compteurEl = document.getElementById('compteur');

const btnReponse = document.getElementById('btn-reponse');
const btnSupprimer = document.getElementById('btn-supprimer');
const btnSuivant = document.getElementById('btn-suivant');
const btnPrecedent = document.getElementById('btn-precedents');
const btnMelanger = document.getElementById('btn-melanger');

const inputQuestion = document.getElementById('nouvelle-question');
const inputReponse = document.getElementById('nouvelle-reponse');
const btnAjouter = document.getElementById('btn-ajouter');

// Sauvegarde LocalStorage
function sauvegarderCartes() {
    localStorage.setItem('mesFlashcards', JSON.stringify(cartes));
}

// Remet la carte sur la face question (désactive le flip 3D)
function reinitialiserFlip() {
    carteEl.classList.remove('retournee');
}

// Affichage
function afficherCarte() {
    reinitialiserFlip();

    if (cartes.length === 0) {
        questionEl.textContent = "Aucune carte disponible.";
        reponseEl.textContent = "";
        compteurEl.textContent = "0 / 0";
        return;
    }

    questionEl.textContent = cartes[indexActuel].question;
    reponseEl.textContent = cartes[indexActuel].reponse;
    compteurEl.textContent = `Carte ${indexActuel + 1} / ${cartes.length}`;
}

// Basculer la carte (Flip 3D)
function basculerCarte() {
    if (cartes.length === 0) return;
    carteEl.classList.toggle('retournee');
}

// Clic sur la carte elle-même
carteEl.addEventListener('click', basculerCarte);

// Clic sur le bouton Retourner
btnReponse.addEventListener('click', (e) => {
    e.stopPropagation(); // Évite un double clic avec l'événement carteEl
    basculerCarte();
});

// Navigation
btnSuivant.addEventListener('click', () => {
    if (cartes.length === 0) return;
    indexActuel = (indexActuel + 1) % cartes.length;
    afficherCarte();
});

btnPrecedent.addEventListener('click', () => {
    if (cartes.length === 0) return;
    indexActuel = (indexActuel - 1 + cartes.length) % cartes.length;
    afficherCarte();
});

btnMelanger.addEventListener('click', () => {
    if (cartes.length === 0) return;
    for (let i = cartes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartes[i], cartes[j]] = [cartes[j], cartes[i]];
    }
    indexActuel = 0;
    afficherCarte();
});

// Supprimer
btnSupprimer.addEventListener('click', () => {
    if (cartes.length === 0) return;

    cartes.splice(indexActuel, 1);
    sauvegarderCartes();

    if (indexActuel >= cartes.length) {
        indexActuel = Math.max(0, cartes.length - 1);
    }

    afficherCarte();
});

// Ajouter
btnAjouter.addEventListener('click', () => {
    const questionTexte = inputQuestion.value.trim();
    const reponseTexte = inputReponse.value.trim();

    if (questionTexte === '' || reponseTexte === '') {
        alert('Merci de remplir la question et la réponse !');
        return;
    }

    cartes.push({
        question: questionTexte,
        reponse: reponseTexte
    });

    sauvegarderCartes();

    inputQuestion.value = '';
    inputReponse.value = '';

    indexActuel = cartes.length - 1;
    afficherCarte();
});

// --- DÉGRADÉS ALÉATOIRES ANIMÉS ---
const degrades = [
    'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)', // Vibrant Sunset
    'linear-gradient(-45deg, #f5f7fa, #c3cfe2, #e0c3fc, #8ec5fc)', // Soft Pastel
    'linear-gradient(-45deg, #ff9a9e, #fecfef, #a1c4fd, #c2e9fb)', // Bubblegum
    'linear-gradient(-45deg, #84ffc9, #aab2ff, #eca0ff, #f99f9f)', // Neon Dream
    'linear-gradient(-45deg, #fbc2eb, #a6c1ee, #84fab0, #8fd3f4)', // Aurora
    'linear-gradient(-45deg, #2af598, #009efd, #00c6ff, #0072ff)'  // Ocean Blue
];

// Sélectionne un dégradé au hasard dans la liste
const degradeAleatoire = degrades[Math.floor(Math.random() * degrades.length)];

// Applique le dégradé au background du body
document.body.style.background = degradeAleatoire;
document.body.style.backgroundSize = '300% 300%';

// Initialisation
afficherCarte();
