// 1. Cartes par défaut (avec la propriété matiere)
let toutesLesCartes = JSON.parse(localStorage.getItem('mesFlashcards')) || [
    { matiere: "Géographie", question: "Quelle est la capitale de la France ?", reponse: "Paris" },
    { matiere: "Maths", question: "Combien font 7 x 8 ?", reponse: "56" },
    { matiere: "Histoire", question: "En quelle année a eu lieu la Révolution française ?", reponse: "1789" },
    { matiere: "Sciences", question: "Quel est le symbole chimique de l'eau ?", reponse: "H2O" },
    { matiere: "Art", question: "Qui a peint la Joconde ?", reponse: "Léonard de Vinci" }
];

let cartesFiltrees = [...toutesLesCartes];
let indexActuel = 0;

// Elements HTML
const carteEl = document.getElementById('carte');
const questionEl = document.querySelector('.question');
const reponseEl = document.querySelector('.reponse');
const compteurEl = document.getElementById('compteur');
const badgeMatiere = document.getElementById('badge-matiere');
const filtreMatiere = document.getElementById('filtre-matiere');

const btnReponse = document.getElementById('btn-reponse');
const btnSupprimer = document.getElementById('btn-supprimer');
const btnSuivant = document.getElementById('btn-suivant');
const btnPrecedent = document.getElementById('btn-precedents');
const btnMelanger = document.getElementById('btn-melanger');

const inputMatiere = document.getElementById('nouvelle-matiere');
const inputQuestion = document.getElementById('nouvelle-question');
const inputReponse = document.getElementById('nouvelle-reponse');
const btnAjouter = document.getElementById('btn-ajouter');

function sauvegarderCartes() {
    localStorage.setItem('mesFlashcards', JSON.stringify(toutesLesCartes));
}

function mettreAJourMenuMatieres() {
    const matieres = ["Toutes", ...new Set(toutesLesCartes.map(c => c.matiere || "Général"))];
    const valeurActuelle = filtreMatiere.value;
    
    filtreMatiere.innerHTML = "";
    matieres.forEach(m => {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = m === "Toutes" ? "📚 Toutes les matières" : m;
        filtreMatiere.appendChild(option);
    });

    if (matieres.includes(valeurActuelle)) {
        filtreMatiere.value = valeurActuelle;
    }
}

function filtrerCartes() {
    const matiereChoisie = filtreMatiere.value;
    if (matiereChoisie === "Toutes") {
        cartesFiltrees = [...toutesLesCartes];
    } else {
        cartesFiltrees = toutesLesCartes.filter(c => (c.matiere || "Général") === matiereChoisie);
    }
    indexActuel = 0;
    afficherCarte();
}

function reinitialiserFlip() {
    carteEl.classList.remove('retournee');
}

function afficherCarte() {
    reinitialiserFlip();

    if (cartesFiltrees.length === 0) {
        badgeMatiere.textContent = "Vide";
        questionEl.textContent = "Aucune carte dans cette matière.";
        reponseEl.textContent = "";
        compteurEl.textContent = "0 / 0";
        return;
    }

    const carte = cartesFiltrees[indexActuel];
    badgeMatiere.textContent = carte.matiere || "Général";
    questionEl.textContent = carte.question;
    reponseEl.textContent = carte.reponse;
    compteurEl.textContent = `Carte ${indexActuel + 1} / ${cartesFiltrees.length}`;
}

function basculerCarte() {
    if (cartesFiltrees.length === 0) return;
    carteEl.classList.toggle('retournee');
}

// Événements
carteEl.addEventListener('click', basculerCarte);

btnReponse.addEventListener('click', (e) => {
    e.stopPropagation();
    basculerCarte();
});

btnSuivant.addEventListener('click', () => {
    if (cartesFiltrees.length === 0) return;
    indexActuel = (indexActuel + 1) % cartesFiltrees.length;
    afficherCarte();
});

btnPrecedent.addEventListener('click', () => {
    if (cartesFiltrees.length === 0) return;
    indexActuel = (indexActuel - 1 + cartesFiltrees.length) % cartesFiltrees.length;
    afficherCarte();
});

btnMelanger.addEventListener('click', () => {
    if (cartesFiltrees.length === 0) return;
    for (let i = cartesFiltrees.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartesFiltrees[i], cartesFiltrees[j]] = [cartesFiltrees[j], cartesFiltrees[i]];
    }
    indexActuel = 0;
    afficherCarte();
});

btnSupprimer.addEventListener('click', () => {
    if (cartesFiltrees.length === 0) return;

    const carteASupprimer = cartesFiltrees[indexActuel];
    toutesLesCartes = toutesLesCartes.filter(c => c !== carteASupprimer);
    
    sauvegarderCartes();
    mettreAJourMenuMatieres();
    filtrerCartes();
});

btnAjouter.addEventListener('click', () => {
    const matiereTexte = inputMatiere.value.trim() || "Général";
    const questionTexte = inputQuestion.value.trim();
    const reponseTexte = inputReponse.value.trim();

    if (questionTexte === '' || reponseTexte === '') {
        alert('Merci de remplir au moins la question et la réponse !');
        return;
    }

    toutesLesCartes.push({
        matiere: matiereTexte,
        question: questionTexte,
        reponse: reponseTexte
    });

    sauvegarderCartes();
    mettreAJourMenuMatieres();
    filtreMatiere.value = matiereTexte;
    filtrerCartes();

    inputMatiere.value = '';
    inputQuestion.value = '';
    inputReponse.value = '';
    
    indexActuel = cartesFiltrees.length - 1;
    afficherCarte();
});

filtreMatiere.addEventListener('change', filtrerCartes);

// Dégradés animés aléatoires
const degrades = [
    'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
    'linear-gradient(-45deg, #f5f7fa, #c3cfe2, #e0c3fc, #8ec5fc)',
    'linear-gradient(-45deg, #ff9a9e, #fecfef, #a1c4fd, #c2e9fb)',
    'linear-gradient(-45deg, #84ffc9, #aab2ff, #eca0ff, #f99f9f)'
];
document.body.style.background = degrades[Math.floor(Math.random() * degrades.length)];
document.body.style.backgroundSize = '300% 300%';

// Initialisation
mettreAJourMenuMatieres();
filtrerCartes();
// Bloque le double-tap zoom iOS
let dernierTap = 0;
document.addEventListener('touchend', function (e) {
    const maintenant = new Date().getTime();
    if (maintenant - dernierTap < 300) {
        e.preventDefault();
    }
    dernierTap = maintenant;
}, { passive: false });
