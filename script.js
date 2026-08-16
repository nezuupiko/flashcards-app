// 1. Données des cartes
let toutesLesCartes = JSON.parse(localStorage.getItem('mesFlashcards')) || [
    { matiere: "Géographie", question: "Quelle est la capitale de la France ?", reponse: "Paris" },
    { matiere: "Maths", question: "Combien font 7 x 8 ?", reponse: "56" },
    { matiere: "Histoire", question: "En quelle année a eu lieu la Révolution française ?", reponse: "1789" },
    { matiere: "Sciences", question: "Quel est le symbole chimique de l'eau ?", reponse: "H2O" },
    { matiere: "Art", question: "Qui a peint la Joconde ?", reponse: "Léonard de Vinci" }
];

let cartesFiltrees = [...toutesLesCartes];
let indexActuel = 0;

// 2. Éléments HTML
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

// 3. Sauvegarde LocalStorage
function sauvegarderCartes() {
    localStorage.setItem('mesFlashcards', JSON.stringify(toutesLesCartes));
}

// 4. Gestion des matières
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

// 5. Affichage et animations
function reinitialiserFlip() {
    carteEl.classList.remove('retournee');
}

function afficherCarte() {
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

// Changement fluide sans aperçu de la réponse suivante
function changerDeCarte(nouvelIndex) {
    if (cartesFiltrees.length === 0) return;

    if (carteEl.classList.contains('retournee')) {
        // 1. On lance le retournement de la carte
        reinitialiserFlip();

        // 2. Pile au moment où la carte est sur la tranche (à mi-chemin)
        // On change le contenu discretement : la question ET la réponse changent dans le noir !
        setTimeout(() => {
            indexActuel = nouvelIndex;
            afficherCarte();
        }, 150); // 👈 Ajuste ce chiffre selon la vitesse de ton animation CSS
        
    } else {
        // Si elle était déjà du côté question, changement instantané
        indexActuel = nouvelIndex;
        afficherCarte();
    }
}


function basculerCarte() {
    if (cartesFiltrees.length === 0) return;
    carteEl.classList.toggle('retournee');
}

// 6. Événements
carteEl.addEventListener('click', basculerCarte);

btnReponse.addEventListener('click', (e) => {
    e.stopPropagation();
    basculerCarte();
});

btnSuivant.addEventListener('click', () => {
    if (cartesFiltrees.length === 0) return;
    const prochainIndex = (indexActuel + 1) % cartesFiltrees.length;
    changerDeCarte(prochainIndex);
});

btnPrecedent.addEventListener('click', () => {
    if (cartesFiltrees.length === 0) return;
    const precedentIndex = (indexActuel - 1 + cartesFiltrees.length) % cartesFiltrees.length;
    changerDeCarte(precedentIndex);
});

btnMelanger.addEventListener('click', () => {
    if (cartesFiltrees.length === 0) return;
    for (let i = cartesFiltrees.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartesFiltrees[i], cartesFiltrees[j]] = [cartesFiltrees[j], cartesFiltrees[i]];
    }
    changerDeCarte(0);
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
        alert('Merci de remplir la question et la réponse !');
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

// 7. Background animé aléatoire
const degrades = [
    'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
    'linear-gradient(-45deg, #f5f7fa, #c3cfe2, #e0c3fc, #8ec5fc)',
    'linear-gradient(-45deg, #ff9a9e, #fecfef, #a1c4fd, #c2e9fb)',
    'linear-gradient(-45deg, #84ffc9, #aab2ff, #eca0ff, #f99f9f)'
];
document.body.style.background = degrades[Math.floor(Math.random() * degrades.length)];
document.body.style.backgroundSize = '300% 300%';

// Initialisation au chargement
mettreAJourMenuMatieres();
filtrerCartes();
