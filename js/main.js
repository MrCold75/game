// Point d'entrée principal du jeu

let game;
let canvas;
let ctx;

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', function() {
    console.log('Jump Ultimate Stars - Initialisation...');
    
    // Obtenir le canvas
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    if (!canvas || !ctx) {
        console.error('Impossible de créer le contexte Canvas!');
        return;
    }
    
    // Désactiver le menu contextuel sur le canvas
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    
    // Créer et démarrer le jeu
    game = new Game();
    
    console.log('Jeu initialisé avec succès!');
});

// Fonctions globales pour l'interface
function startGame() {
    if (game) {
        game.startGame();
    }
}

function showCharacterSelect() {
    if (game) {
        console.log('Affichage de la sélection de personnages');
        game.showCharacterSelect();
        
        // Attendre que l'écran soit affiché avant d'initialiser
        setTimeout(() => {
            setupCharacterSelection();
        }, 100);
    } else {
        console.error('Game not initialized');
    }
}

function showControls() {
    if (game) {
        game.showControls();
    }
}

function backToMenu() {
    if (game) {
        game.backToMenu();
    }
}

// Variables globales pour la sélection
let characterSelectionInitialized = false;
let selectedCharacters = [];

// Configuration de la sélection des personnages
function setupCharacterSelection() {
    console.log('Initialisation de la sélection de personnages');
    
    // Éviter la double initialisation
    if (characterSelectionInitialized) {
        console.log('Réinitialisation de la sélection');
        resetCharacterSelection();
        return;
    }
    
    const characterCards = document.querySelectorAll('.character-card');
    console.log('Cartes de personnages trouvées:', characterCards.length);
    
    if (characterCards.length === 0) {
        console.error('Aucune carte de personnage trouvée!');
        return;
    }
    
    characterCards.forEach((card, index) => {
        console.log(`Ajout d'événement sur carte ${index}:`, card.dataset.character);
        card.addEventListener('click', handleCharacterCardClick);
    });
    
    characterSelectionInitialized = true;
    resetCharacterSelection();
}

function handleCharacterCardClick() {
    const character = this.dataset.character;
    console.log('Clic sur personnage:', character);
    
    if (this.classList.contains('selected')) {
        // Désélectionner
        console.log('Désélection de:', character);
        this.classList.remove('selected');
        selectedCharacters = selectedCharacters.filter(sel => sel !== character);
    } else if (selectedCharacters.length < 2) {
        // Sélectionner
        console.log('Sélection de:', character);
        this.classList.add('selected');
        selectedCharacters.push(character);
    } else {
        console.log('Maximum de 2 personnages déjà sélectionnés');
    }
    
    console.log('Personnages sélectionnés:', selectedCharacters);
    
    // Mettre à jour l'interface
    updateCharacterSelectionUI();
}

function resetCharacterSelection() {
    // Nettoyer les sélections précédentes
    const characterCards = document.querySelectorAll('.character-card');
    characterCards.forEach(card => card.classList.remove('selected'));
    
    // Sélection par défaut
    selectedCharacters = ['ninja', 'warrior'];
    selectedCharacters.forEach(character => {
        const card = document.querySelector(`[data-character="${character}"]`);
        if (card) {
            card.classList.add('selected');
        }
    });
    
    updateCharacterSelectionUI();
}

function updateCharacterSelectionUI() {
    console.log('Mise à jour UI avec:', selectedCharacters);
    
    // Mettre à jour le jeu avec les sélections
    if (game && selectedCharacters.length === 2) {
        game.selectedCharacters = [...selectedCharacters]; // Copie du tableau
        console.log('Personnages assignés au jeu:', game.selectedCharacters);
        
        // Ajouter un bouton de confirmation
        let confirmButton = document.getElementById('confirmSelection');
        if (!confirmButton) {
            confirmButton = document.createElement('button');
            confirmButton.id = 'confirmSelection';
            confirmButton.textContent = 'Confirmer et Jouer';
            confirmButton.onclick = () => {
                console.log('Confirmation du jeu avec:', game.selectedCharacters);
                game.createPlayers();
                startGame();
            };
            
            const characterSelect = document.getElementById('characterSelect');
            characterSelect.appendChild(confirmButton);
        }
        
        confirmButton.style.display = 'block';
    } else {
        const confirmButton = document.getElementById('confirmSelection');
        if (confirmButton) {
            confirmButton.style.display = 'none';
        }
    }
    
    // Mettre à jour l'affichage du nombre de personnages sélectionnés
    let selectionInfo = document.getElementById('selectionInfo');
    if (!selectionInfo) {
        selectionInfo = document.createElement('div');
        selectionInfo.id = 'selectionInfo';
        selectionInfo.style.cssText = `
            color: #4ecdc4;
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
        `;
        const characterSelect = document.getElementById('characterSelect');
        const grid = characterSelect.querySelector('.character-grid');
        characterSelect.insertBefore(selectionInfo, grid.nextSibling);
    }
    
    selectionInfo.textContent = `Personnages sélectionnés: ${selectedCharacters.length}/2`;
    
    // Afficher les noms des personnages sélectionnés
    if (selectedCharacters.length > 0) {
        const names = selectedCharacters.map(char => {
            switch(char) {
                case 'ninja': return 'Ninja';
                case 'warrior': return 'Guerrier';
                case 'mage': return 'Mage';
                case 'robot': return 'Robot';
                default: return char;
            }
        }).join(' vs ');
        
        selectionInfo.innerHTML = `
            Personnages sélectionnés: ${selectedCharacters.length}/2<br>
            <span style="color: white; font-size: 16px;">${names}</span>
        `;
    }
}

// Gestionnaire d'erreurs global
window.addEventListener('error', function(e) {
    console.error('Erreur du jeu:', e.error);
    
    // Afficher un message d'erreur à l'utilisateur
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #e74c3c;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 9999;
        font-family: Arial, sans-serif;
    `;
    errorDiv.textContent = 'Une erreur est survenue. Veuillez recharger la page.';
    
    document.body.appendChild(errorDiv);
    
    // Supprimer le message après 5 secondes
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
});

// Fonctions de débogage
function toggleDebug() {
    if (game) {
        game.debug = !game.debug;
        console.log('Mode debug:', game.debug ? 'activé' : 'désactivé');
    }
}

function getGameInfo() {
    if (game) {
        return {
            state: game.gameState,
            players: game.players.map(p => ({
                type: p.type,
                health: p.health,
                position: p.position,
                alive: p.isAlive
            })),
            scores: game.scores,
            timer: game.gameTimer
        };
    }
    return null;
}

// Exposer certaines fonctions pour le débogage
window.gameDebug = {
    toggleDebug,
    getGameInfo,
    game: () => game
};

// Configuration de performance
function optimizePerformance() {
    // Désactiver le lissage pour de meilleures performances sur les pixels art
    if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
    }
}

// Vérification des capacités du navigateur
function checkBrowserSupport() {
    const features = {
        canvas: !!document.createElement('canvas').getContext,
        gamepad: 'getGamepads' in navigator,
        fullscreen: 'requestFullscreen' in document.documentElement,
        localStorage: 'localStorage' in window
    };
    
    console.log('Support navigateur:', features);
    
    if (!features.canvas) {
        alert('Votre navigateur ne supporte pas Canvas. Veuillez utiliser un navigateur plus récent.');
        return false;
    }
    
    return true;
}

// Initialisation après le chargement
document.addEventListener('DOMContentLoaded', function() {
    if (checkBrowserSupport()) {
        optimizePerformance();
    }
});

// Prévention des gestes tactiles sur mobile
document.addEventListener('touchstart', function(e) {
    if (e.target.tagName === 'CANVAS') {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchend', function(e) {
    if (e.target.tagName === 'CANVAS') {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    if (e.target.tagName === 'CANVAS') {
        e.preventDefault();
    }
}, { passive: false });

// Sauvegarde et chargement des paramètres
function saveSettings() {
    if ('localStorage' in window && game) {
        const settings = {
            selectedCharacters: game.selectedCharacters,
            soundEnabled: game.soundManager.enabled,
            // Ajouter d'autres paramètres ici
        };
        
        try {
            localStorage.setItem('jumpUltimateStarsSettings', JSON.stringify(settings));
        } catch (e) {
            console.warn('Impossible de sauvegarder les paramètres:', e);
        }
    }
}

function loadSettings() {
    if ('localStorage' in window) {
        try {
            const saved = localStorage.getItem('jumpUltimateStarsSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                
                if (game) {
                    if (settings.selectedCharacters) {
                        game.selectedCharacters = settings.selectedCharacters;
                    }
                    if (typeof settings.soundEnabled === 'boolean') {
                        game.soundManager.enabled = settings.soundEnabled;
                    }
                }
                
                return settings;
            }
        } catch (e) {
            console.warn('Impossible de charger les paramètres:', e);
        }
    }
    
    return null;
}

// Sauvegarder automatiquement quand on quitte
window.addEventListener('beforeunload', saveSettings);

// Messages d'aide
const helpMessages = {
    fr: {
        welcome: 'Bienvenue dans Jump Ultimate Stars!',
        controls: 'Utilisez WASD pour le joueur 1, les flèches pour le joueur 2',
        objective: 'Premier à 3 rounds gagne la partie!',
        tips: [
            'Chaque personnage a des capacités uniques',
            'Utilisez la défense pour réduire les dégâts',
            'Le double saut peut vous sauver la vie',
            'Maîtrisez les plateformes pour dominer'
        ]
    }
};

function showRandomTip() {
    const tips = helpMessages.fr.tips;
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    console.log('💡 Astuce:', randomTip);
}

// Afficher une astuce aléatoire toutes les 30 secondes
setInterval(showRandomTip, 30000);

console.log('%c🎮 Jump Ultimate Stars 🎮', 'font-size: 20px; color: #4ecdc4; font-weight: bold;');
console.log('Tapez gameDebug.getGameInfo() pour voir l\'état du jeu');
console.log('Tapez gameDebug.toggleDebug() pour activer/désactiver le mode debug');