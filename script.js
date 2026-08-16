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
        mettreAJourProgression();
        return;
    }

    const carte = cartesFiltrees[indexActuel];
    badgeMatiere.textContent = carte.matiere || "Général";
    questionEl.textContent = carte.question;
    reponseEl.textContent = carte.reponse;
    compteurEl.textContent = `Carte ${indexActuel + 1} / ${cartesFiltrees.length}`;
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
        }, 175); // 👈 Ajuste ce chiffre selon la vitesse de ton animation CSS
        
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

// Contrôles au clavier
document.addEventListener('keydown', (e) => {
    // Si l'utilisateur tape dans une zone de texte, on n'active pas les raccourcis
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.code === 'Space') {
        e.preventDefault(); // Évite de faire défiler la page vers le bas
        carteEl.click(); // Simule un clic sur la carte pour la retourner
    } else if (e.code === 'ArrowRight') {
        if (btnSuivant) btnSuivant.click();
    } else if (e.code === 'ArrowLeft') {
        if (btnPrecedent) btnPrecedent.click();
    }
});


// Contrôles au clavier
// Contrôles au clavier corrigés
document.addEventListener('keydown', (e) => {
    // Ne rien faire si l'utilisateur écrit dans un champ texte
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

    if (e.code === 'Space') {
        e.preventDefault(); // Bloque le défilement de la page
        // Retourne la carte
        carteEl.classList.toggle('retournee');
    } else if (e.code === 'ArrowRight') {
        e.preventDefault(); // Empêche le double saut
        if (btnSuivant) btnSuivant.click();
    } else if (e.code === 'ArrowLeft') {
        e.preventDefault(); // Empêche le double saut
        if (btnPrecedent) btnPrecedent.click();
    }
});


// Gestes SWIPE mobile
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

const formMatiere = document.getElementById('form-matiere');
const inputMatiere = document.getElementById('nom-nouvelle-matiere');
const selectMatiere = document.getElementById('select-matiere-carte');

formMatiere.addEventListener('submit', (e) => {
    e.preventDefault();
    const nomMatiere = inputMatiere.value.trim();
    
    if (nomMatiere) {
        // Ajouter la nouvelle option dans le select
        const option = document.createElement('option');
        option.value = nomMatiere;
        option.textContent = nomMatiere;
        selectMatiere.appendChild(option);
        
        // Sélectionner directement la nouvelle matière créée
        selectMatiere.value = nomMatiere;
        inputMatiere.value = '';
    }
});

