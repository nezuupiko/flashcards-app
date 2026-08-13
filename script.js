// 1. Charger les cartes depuis le localStorage ou mettre les cartes par défaut
let cartes = JSON.parse(localStorage.getItem('mesFlashcards')) || [
    { question: "Quelle est la capitale de la France ?", reponse: "Paris" },
    { question: "Combien font 7 x 8 ?", reponse: "56" },
    { question: "En quelle année a eu lieu la Révolution française ?", reponse: "1789" }
];

let indexActuel = 0;

// 2. Sélection de tous les éléments HTML
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

// 3. Sauvegarder dans le navigateur
function sauvegarderCartes() {
    localStorage.setItem('mesFlashcards', JSON.stringify(cartes));
}

// 4. Fonction d'affichage de la carte actuelle
function afficherCarte() {
    if (cartes.length === 0) {
        questionEl.textContent = "Aucune carte disponible.";
        reponseEl.textContent = "";
        compteurEl.textContent = "0 / 0";
        return;
    }

    questionEl.textContent = cartes[indexActuel].question;
    reponseEl.textContent = cartes[indexActuel].reponse;
    compteurEl.textContent = `Carte ${indexActuel + 1} / ${cartes.length}`;
    
    reponseEl.style.display = 'none';
    btnReponse.textContent = 'Afficher la réponse';
}

// 5. Afficher / Masquer la réponse
btnReponse.addEventListener('click', () => {
    if (reponseEl.style.display === 'block') {
        reponseEl.style.display = 'none';
        btnReponse.textContent = 'Afficher la réponse';
    } else {
        reponseEl.style.display = 'block';
        btnReponse.textContent = 'Masquer la réponse';
    }
});

// 6. Navigation
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

// 7. Supprimer la carte courante
btnSupprimer.addEventListener('click', () => {
    if (cartes.length === 0) return;

    cartes.splice(indexActuel, 1); // Supprime la carte du tableau
    sauvegarderCartes();           // Sauvegarde le changement

    if (indexActuel >= cartes.length) {
        indexActuel = Math.max(0, cartes.length - 1);
    }

    afficherCarte();
});

// 8. Ajouter une nouvelle carte
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

// Initialisation au chargement de la page
afficherCarte();
