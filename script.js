// 4. Fonction d'affichage de la carte
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

// Fonction intelligente pour changer de carte sans "spoiler" la réponse
function changerDeCarte(nouvelIndex) {
    if (cartesFiltrees.length === 0) return;

    // Si la carte est retournée (côté réponse visible)
    if (carteEl.classList.contains('retournee')) {
        reinitialiserFlip(); // On commence le retournement vers le recto
        
        // On attend 250ms (quand la carte est sur la tranche) pour changer le texte en cachette !
        setTimeout(() => {
            indexActuel = nouvelIndex;
            afficherCarte();
        }, 250);
    } else {
        // Si elle était déjà côté question, changement instantané
        indexActuel = nouvelIndex;
        afficherCarte();
    }
}

// 6. Navigation mise à jour
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
