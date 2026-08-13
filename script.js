// 1. Charger les cartes sauvegardées ou utiliser les cartes par défaut
let cartes = JSON.parse(localStorage.getItem('mesFlashcards')) || [
    { question: "Quelle est la capitale de la France ?", reponse: "Paris" },
    { question: "Combien font 7 x 8 ?", reponse: "56" },
    { question: "En quelle année a eu lieu la Révolution française ?", reponse: "1789" },
    { question: "Quel est le symbole chimique de l'eau ?", reponse: "H2O" },
    { question: "Qui a peint la Joconde ?", reponse: "Léonard de Vinci" }
];

let indexActuel = 0;

// 2. Sélection des éléments HTML
const questionEl = document.querySelector('.question');
const reponseEl = document.querySelector('.reponse');
const compteurEl = document.getElementById('compteur');
const btnReponse = document.getElementById('btn-reponse');
const btnSuivant = document.getElementById('btn-suivant');
const btnPrecedent = document.getElementById('btn-precedents');
const btnMelanger = document.getElementById('btn-melanger');

const inputQuestion = document.getElementById('nouvelle-question');
const inputReponse = document.getElementById('nouvelle-reponse');
const btnAjouter = document.getElementById('btn-ajouter');

// Sélection du bouton de suppression
const btnSupprimer = document.getElementById('btn-supprimer');

// Événement de suppression
btnSupprimer.addEventListener('click', () => {
    // Si le paquet est déjà vide, on ne fait rien
    if (cartes.length === 0) return;

    // 1. Retire la carte courante du tableau
    cartes.splice(indexActuel, 1);

    // 2. Sauvegarde la nouvelle liste
    sauvegarderCartes();

    // 3. Ajuste l'index si on a supprimé la dernière carte
    if (indexActuel >= cartes.length) {
        indexActuel = Math.max(0, cartes.length - 1);
    }

    // 4. Réaffiche la page avec la carte restante
    afficherCarte();
});


// 3. Fonction de sauvegarde
function sauvegarderCartes() {
    localStorage.setItem('mesFlashcards', JSON.stringify(cartes));
}

// 4. Fonction d'affichage
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

// 5. Événements
btnReponse.addEventListener('click', () => {
    if (reponseEl.style.display === 'block') {
        reponseEl.style.display = 'none';
        btnReponse.textContent = 'Afficher la réponse';
    } else {
        reponseEl.style.display = 'block';
        btnReponse.textContent = 'Masquer la réponse';
    }
});

btnSuivant.addEventListener('click', () => {
    indexActuel = (indexActuel + 1) % cartes.length;
    afficherCarte();
});

btnPrecedent.addEventListener('click', () => {
    indexActuel = (indexActuel - 1 + cartes.length) % cartes.length;
    afficherCarte();
});

btnMelanger.addEventListener('click', () => {
    for (let i = cartes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartes[i], cartes[j]] = [cartes[j], cartes[i]];
    }
    indexActuel = 0;
    afficherCarte();
});

// 6. Ajout d'une carte + Sauvegarde
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

    sauvegarderCartes(); // Enregistrement dans le navigateur

    inputQuestion.value = '';
    inputReponse.value = '';

    indexActuel = cartes.length - 1;
    afficherCarte();
});

// Initialisation
afficherCarte();
