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
const badgeMatiere = document.getElementById('badge-matiere');
const filtreMatiere = document.getElementById('filtre-matiere');

const btnReponse = document.getElementById('btn-reponse');
const btnSupprimer = document.getElementById('btn-supprimer');
const btnSuivant = document.getElementById('btn-suivant');
const btnPrecedent = document.getElementById('btn-precedents');
const btnMelanger = document.getElementById('btn-melanger');

const formMatiere = document.getElementById('form-matiere');
const inputNomMatiere = document.getElementById('nom-nouvelle-matiere');

const formCarte = document.getElementById('form-carte');
const selectMatiereCarte = document.getElementById('select-matiere-carte');
const inputQuestionCarte = document.getElementById('question-carte');
const inputReponseCarte = document.getElementById('reponse-carte');

// 3. Sauvegarde LocalStorage
function sauvegarderCartes() {
    localStorage.setItem('mesFlashcards', JSON.stringify(toutesLesCartes));
}

// 4. Gestion des matières
function mettreAJourMenuMatieres() {
    const matieres = ["Toutes", ...new Set(toutesLesCartes.map(c => c.matiere || "Général"))];
    const valeurFiltreActuel = filtreMatiere.value;

    // Mise à jour du filtre principal
    filtreMatiere.innerHTML = "";
    matieres.forEach(m => {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = m === "Toutes" ? "📚 Toutes les matières" : m;
        filtreMatiere.appendChild(option);
    });

    if (matieres.includes(valeurFiltreActuel)) {
        filtreMatiere.value = valeurFiltreActuel;
    }

    // Mise à jour du selecteur dans le formulaire de carte
    selectMatiereCarte.innerHTML = '<option value="">-- Choisir une matière --</option>';
    matieres.filter(m => m !== "Toutes").forEach(m => {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = m;
        selectMatiereCarte.appendChild(option);
    });
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

// 5. Affichage et progression
function reinitialiserFlip() {
    carteEl.classList.remove('retournee');
}

function afficherCarte() {
    if (cartesFiltrees.length === 0) {
        badgeMatiere.textContent = "Vide";
        questionEl.textContent = "Aucune carte dans cette matière.";
        reponseEl.textContent = "";
        mettreAJourProgression();
        return;
    }

    const carte = cartesFiltrees[indexActuel];
    badgeMatiere.textContent = carte.matiere || "Général";
    questionEl.textContent = carte.question;
    reponseEl.textContent = carte.reponse;
    mettreAJourProgression();
}

function mettreAJourProgression() {
    const total = cartesFiltrees.length;
    const compteurEl = document.getElementById('compteur-cartes');
    const barreEl = document.getElementById('barre-progression');

    if (total === 0) {
        if (compteurEl) compteurEl.textContent = "0 / 0";
        if (barreEl) barreEl.style.width = "0%";
        return;
    }

    const actuel = indexActuel + 1;
    const pourcentage = (actuel / total) * 100;

    if (compteurEl) compteurEl.textContent = `${actuel} / ${total}`;
    if (barreEl) barreEl.style.width = `${pourcentage}%`;
}

function changerDeCarte(nouvelIndex) {
    if (cartesFiltrees.length === 0) return;

    if (carteEl.classList.contains('retournee')) {
        reinitialiserFlip();
        setTimeout(() => {
            indexActuel = nouvelIndex;
            afficherCarte();
        }, 175);
    } else {
        indexActuel = nouvelIndex;
        afficherCarte();
    }
}

function basculerCarte() {
    if (cartesFiltrees.length === 0) return;
    carteEl.classList.toggle('retournee');
}

// 6. Événements des boutons
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

filtreMatiere.addEventListener('change', filtrerCartes);

// 7. Formulaires d'ajout

// Formulaire 1 : Matière
formMatiere.addEventListener('submit', (e) => {
    e.preventDefault();
    const nouvelleMatiere = inputNomMatiere.value.trim();

    if (nouvelleMatiere) {
        // Ajouter une option temporaire dans le select
        const option = document.createElement('option');
        option.value = nouvelleMatiere;
        option.textContent = nouvelleMatiere;
        selectMatiereCarte.appendChild(option);
        selectMatiereCarte.value = nouvelleMatiere;

        inputNomMatiere.value = '';
    }
});

// Formulaire 2 : Carte
formCarte.addEventListener('submit', (e) => {
    e.preventDefault();

    const matiere = selectMatiereCarte.value;
    const question = inputQuestionCarte.value.trim();
    const reponse = inputReponseCarte.value.trim();

    if (!matiere) {
        alert("Merci de sélectionner une matière !");
        return;
    }

    toutesLesCartes.push({ matiere, question, reponse });

    sauvegarderCartes();
    mettreAJourMenuMatieres();
    filtreMatiere.value = matiere;
    filtrerCartes();

    inputQuestionCarte.value = '';
    inputReponseCarte.value = '';

    indexActuel = cartesFiltrees.length - 1;
    afficherCarte();
});

// 8. Background animé aléatoire
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

// 9. Contrôles au clavier (Correction du double saut)
document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

    if (e.code === 'Space') {
        e.preventDefault();
        basculerCarte();
    } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (btnSuivant) btnSuivant.click();
    } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (btnPrecedent) btnPrecedent.click();
    }
});

// 10. Gestes SWIPE mobile
let touchStartX = 0;
let touchEndX = 0;

carteEl.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carteEl.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const seuil = 50;
    const difference = touchStartX - touchEndX;

    if (difference > seuil) {
        if (btnSuivant) btnSuivant.click();
    } else if (difference < -seuil) {
        if (btnPrecedent) btnPrecedent.click();
    }
}, { passive: true });
