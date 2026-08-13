// 1. Banque de cartes
let cartes = [
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

// 3. Fonction pour afficher la carte courante + le compteur
function afficherCarte() {
    if (cartes.length === 0) {
        questionEl.textContent = "Aucune carte disponible.";
        reponseEl.textContent = "";
        compteurEl.textContent = "0 / 0";
        return;
    }

    questionEl.textContent = cartes[indexActuel].question;
    reponseEl.textContent = cartes[indexActuel].reponse;
    
    // Mise à jour du compteur (indexActuel + 1 car l'index commence à 0)
    compteurEl.textContent = `Carte ${indexActuel + 1} / ${cartes.length}`;
    
    // Cacher la réponse à chaque changement
    reponseEl.style.display = 'none';
    btnReponse.textContent = 'Afficher la réponse';
}

// 4. Afficher/Masquer la réponse
btnReponse.addEventListener('click', () => {
    if (reponseEl.style.display === 'block') {
        reponseEl.style.display = 'none';
        btnReponse.textContent = 'Afficher la réponse';
    } else {
        reponseEl.style.display = 'block';
        btnReponse.textContent = 'Masquer la réponse';
    }
});

// 5. Suivant
btnSuivant.addEventListener('click', () => {
    indexActuel = (indexActuel + 1) % cartes.length;
    afficherCarte();
});

// 6. Précédent
btnPrecedent.addEventListener('click', () => {
    indexActuel = (indexActuel - 1 + cartes.length) % cartes.length;
    afficherCarte();
});

// 7. Mélanger les cartes (Algorithme de Fisher-Yates)
btnMelanger.addEventListener('click', () => {
    for (let i = cartes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartes[i], cartes[j]] = [cartes[j], cartes[i]];
    }
    indexActuel = 0; // On revient à la première carte du nouveau paquet mélangé
    afficherCarte();
});

// Initialisation
afficherCarte();

// 8. Gestion du formulaire d'ajout
const inputQuestion = document.getElementById('nouvelle-question');
const inputReponse = document.getElementById('nouvelle-reponse');
const btnAjouter = document.getElementById('btn-ajouter');

btnAjouter.addEventListener('click', () => {
    const questionTexte = inputQuestion.value.trim();
    const reponseTexte = inputReponse.value.trim();

    // On vérifie que les deux champs sont bien remplis
    if (questionTexte === '' || reponseTexte === '') {
        alert('Merci de remplir la question et la réponse !');
        return;
    }

    // On ajoute la nouvelle carte dans le tableau
    cartes.push({
        question: questionTexte,
        reponse: reponseTexte
    });

    // On vide les champs de texte
    inputQuestion.value = '';
    inputReponse.value = '';

    // On se positionne sur la carte qu'on vient de créer et on l'affiche
    indexActuel = cartes.length - 1;
    afficherCarte();
});

