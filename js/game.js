// Moteur principal du jeu Jump Ultimate Stars

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.running = false;
        this.paused = false;
        this.debug = false;
        
        // Gestionnaire d'assets
        this.assetManager = new AssetManager();
        this.assetsLoaded = false;
        
        // Systèmes du jeu
        this.inputManager = new InputManager();
        this.physicsWorld = new PhysicsWorld();
        this.animationManager = new AnimationManager();
        this.particleSystem = new ParticleSystem();
        this.soundManager = new SoundManager();
        
        // États du jeu
        this.gameState = 'menu'; // menu, characterSelect, playing, paused, gameOver
        this.players = [];
        this.selectedCharacters = ['ninja', 'warrior'];
        
        // Interface utilisateur
        this.ui = new UIManager();
        
        // Timer et score
        this.gameTimer = 99;
        this.roundTimer = 0;
        this.maxRoundTime = 99;
        this.scores = [0, 0];
        this.roundsToWin = 3;
        
        // Combat
        this.roundInProgress = false;
        this.roundWinner = null;
        
        // Événements
        this.setupEventListeners();
        
        // Initialisation
        this.init();
    }
    
    init() {
        // Initialiser le monde physique
        this.physicsWorld.initializePlatforms();
        
        // Charger les assets
        this.loadAssets();
        
        // Démarrer la boucle de jeu
        this.lastTime = 0;
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }
    
    async loadAssets() {
        console.log('Chargement des assets...');
        
        // Configuration des callbacks de progression
        this.assetManager.onProgress = (loaded, total) => {
            const percentage = Math.round((loaded / total) * 100);
            console.log(`Chargement assets: ${percentage}% (${loaded}/${total})`);
            this.showLoadingProgress(percentage);
        };
        
        this.assetManager.onComplete = () => {
            console.log('Tous les assets sont chargés!');
            this.assetsLoaded = true;
            this.hideLoadingScreen();
            
            // Créer les joueurs avec les sprites
            this.createPlayers();
        };
        
        try {
            await this.assetManager.loadAllAssets();
        } catch (error) {
            console.warn('Erreur lors du chargement des assets:', error);
            // Continuer sans sprites
            this.assetsLoaded = true;
            this.createPlayers();
        }
    }
    
    showLoadingProgress(percentage) {
        // Créer un écran de chargement simple
        const loadingScreen = document.getElementById('loadingScreen') || this.createLoadingScreen();
        const progressBar = loadingScreen.querySelector('.progress-fill');
        const progressText = loadingScreen.querySelector('.progress-text');
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        if (progressText) {
            progressText.textContent = `Chargement... ${percentage}%`;
        }
        
        loadingScreen.style.display = 'flex';
    }
    
    createLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loadingScreen';
        loadingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            color: white;
            font-family: Arial, sans-serif;
        `;
        
        loadingScreen.innerHTML = `
            <h2>Jump Ultimate Stars</h2>
            <div style="width: 300px; height: 20px; background: #333; border-radius: 10px; margin: 20px 0; overflow: hidden;">
                <div class="progress-fill" style="width: 0%; height: 100%; background: linear-gradient(90deg, #4ecdc4, #44a08d); transition: width 0.3s ease;"></div>
            </div>
            <div class="progress-text">Chargement... 0%</div>
        `;
        
        document.body.appendChild(loadingScreen);
        return loadingScreen;
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
    
    createPlayers() {
        // S'assurer que nous avons des personnages sélectionnés
        if (!this.selectedCharacters || this.selectedCharacters.length < 2) {
            this.selectedCharacters = ['ninja', 'warrior']; // Valeurs par défaut
        }
        
        // Utiliser les sprites si disponibles
        const assetManager = this.assetsLoaded ? this.assetManager : null;
        
        this.players = [
            new Character(200, 300, this.selectedCharacters[0], 1, assetManager),
            new Character(800, 300, this.selectedCharacters[1], 2, assetManager)
        ];
        
        // Configurer les combos pour chaque joueur
        this.players.forEach(player => {
            if (player.comboSystem) {
                // Nettoyer l'ancien système de combos s'il existe
                player.comboSystem = new ComboSystem();
            } else {
                player.comboSystem = new ComboSystem();
            }
            setupDefaultCombos(player.comboSystem, player);
        });
        
        console.log('Joueurs créés:', this.players.map(p => `${p.type} (Joueur ${p.playerNumber}) - Sprites: ${p.useSprites}`));
    }
    
    setupEventListeners() {
        // Gestionnaire de redimensionnement
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Gestionnaire de visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            }
        });
    }
    
    gameLoop(currentTime) {
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.016); // Cap à 60 FPS
        this.lastTime = currentTime;
        
        if (!this.paused) {
            this.update(deltaTime);
        }
        
        this.render();
        
        requestAnimationFrame(this.gameLoop);
    }
    
    update(deltaTime) {
        // Mettre à jour le gestionnaire d'entrées
        this.inputManager.update();
        
        // Traiter les entrées générales
        this.handleGeneralInput();
        
        // Mettre à jour selon l'état du jeu
        switch (this.gameState) {
            case 'menu':
                this.updateMenu(deltaTime);
                break;
            case 'characterSelect':
                this.updateCharacterSelect(deltaTime);
                break;
            case 'playing':
                this.updateGameplay(deltaTime);
                break;
            case 'paused':
                // Pas de mise à jour en pause
                break;
            case 'gameOver':
                this.updateGameOver(deltaTime);
                break;
        }
        
        // Mettre à jour les systèmes globaux
        this.animationManager.update(deltaTime);
        this.particleSystem.update(deltaTime);
    }
    
    handleGeneralInput() {
        const input = this.inputManager.getGeneralInput();
        
        if (input.pause && this.gameState === 'playing') {
            this.togglePause();
        }
        
        if (input.restart && this.gameState === 'playing') {
            this.restartRound();
        }
        
        if (input.fullscreen) {
            this.toggleFullscreen();
        }
    }
    
    updateMenu(deltaTime) {
        // Animation du menu (effet de particules en arrière-plan)
        if (Math.random() < 0.1) {
            const x = Math.random() * this.canvas.width;
            const y = this.canvas.height;
            const velocity = new Vector2(
                (Math.random() - 0.5) * 50,
                -Math.random() * 100 - 50
            );
            this.particleSystem.addParticle(x, y, velocity, '#4ecdc4', 2);
        }
    }
    
    updateCharacterSelect(deltaTime) {
        // Logique de sélection des personnages (gérée par l'UI)
    }
    
    updateGameplay(deltaTime) {
        if (!this.roundInProgress) return;
        
        // Mettre à jour le timer
        this.updateTimer(deltaTime);
        
        // Traiter les entrées des joueurs
        this.handlePlayerInputs();
        
        // Mettre à jour les personnages
        this.updateCharacters(deltaTime);
        
        // Vérifier les collisions de combat
        this.checkCombat();
        
        // Vérifier les conditions de fin de round
        this.checkRoundEnd();
        
        // Mettre à jour l'interface
        this.ui.update(deltaTime);
    }
    
    updateTimer(deltaTime) {
        this.roundTimer += deltaTime;
        this.gameTimer = Math.max(0, this.maxRoundTime - this.roundTimer);
        
        if (this.gameTimer <= 0) {
            this.endRound('timeout');
        }
    }
    
    handlePlayerInputs() {
        const player1Input = this.inputManager.getPlayer1Input();
        const player2Input = this.inputManager.getPlayer2Input();
        
        this.processPlayerInput(this.players[0], player1Input);
        this.processPlayerInput(this.players[1], player2Input);
    }
    
    processPlayerInput(player, input) {
        if (!player.isAlive) return;
        
        // Mouvement
        let moveDirection = 0;
        if (input.moveLeft) moveDirection -= 1;
        if (input.moveRight) moveDirection += 1;
        
        if (moveDirection !== 0) {
            player.move(moveDirection);
        }
        
        // Saut
        if (input.jump) {
            player.jump();
        }
        
        // Attaque
        if (input.attack) {
            player.attack();
            
            // Enregistrer l'input pour les combos
            player.comboSystem.recordInput('attack', Date.now());
        }
        
        // Défense
        if (input.defend) {
            player.defend();
        } else {
            player.stopDefending();
        }
        
        // Mouvement spécial
        if (input.special) {
            this.executeSpecialMove(player);
        }
    }
    
    updateCharacters(deltaTime) {
        this.players.forEach(player => {
            if (player.isAlive) {
                // Appliquer la physique
                this.physicsWorld.applyPhysics(player, deltaTime);
                
                // Mettre à jour le personnage
                player.update(deltaTime, this.physicsWorld.platforms);
                
                // Mettre à jour le système de combos
                player.comboSystem.update(deltaTime);
            }
        });
        
        // Vérifier les collisions entre personnages
        if (this.players.length >= 2) {
            this.physicsWorld.checkCharacterCollision(this.players[0], this.players[1]);
        }
    }
    
    checkCombat() {
        // Vérifier les attaques entre tous les joueurs
        for (let i = 0; i < this.players.length; i++) {
            for (let j = 0; j < this.players.length; j++) {
                if (i !== j) {
                    const attacker = this.players[i];
                    const target = this.players[j];
                    
                    if (this.physicsWorld.checkAttackHit(attacker, target)) {
                        this.onHit(attacker, target);
                    }
                }
            }
        }
    }
    
    onHit(attacker, target) {
        // Effets visuels
        const hitPosition = target.position.add(new Vector2(target.size.x / 2, target.size.y / 2));
        this.particleSystem.createExplosion(hitPosition.x, hitPosition.y, 15, '#ff6b6b');
        
        // Vibration manette
        this.inputManager.gamepadManager.vibrate(attacker.playerNumber - 1, 100);
        
        // Son d'impact
        this.soundManager.playSound('hit');
        
        // Camera shake
        this.addCameraShake(5);
    }
    
    checkRoundEnd() {
        const alivePlayers = this.players.filter(p => p.isAlive);
        
        if (alivePlayers.length <= 1) {
            if (alivePlayers.length === 1) {
                this.endRound('knockout', alivePlayers[0]);
            } else {
                this.endRound('draw');
            }
        }
    }
    
    endRound(reason, winner = null) {
        this.roundInProgress = false;
        this.roundWinner = winner;
        
        if (winner) {
            this.scores[winner.playerNumber - 1]++;
            
            // Effets de victoire
            const winPosition = winner.position.add(new Vector2(winner.size.x / 2, 0));
            this.particleSystem.createExplosion(winPosition.x, winPosition.y, 30, '#4ecdc4');
        }
        
        // Vérifier la fin de partie
        if (this.scores[0] >= this.roundsToWin || this.scores[1] >= this.roundsToWin) {
            this.endGame();
        } else {
            // Préparer le prochain round
            setTimeout(() => {
                this.startNewRound();
            }, 3000);
        }
    }
    
    startNewRound() {
        // Réinitialiser les personnages
        this.players[0].reset(200, 300);
        this.players[1].reset(800, 300);
        
        // Réinitialiser le timer
        this.roundTimer = 0;
        this.gameTimer = this.maxRoundTime;
        
        // Nettoyer les particules
        this.particleSystem.clear();
        
        // Démarrer le round
        this.roundInProgress = true;
        this.roundWinner = null;
    }
    
    endGame() {
        this.gameState = 'gameOver';
        this.roundInProgress = false;
        
        // Déterminer le gagnant final
        const gameWinner = this.scores[0] > this.scores[1] ? this.players[0] : this.players[1];
        
        // Effets de fin de partie
        setTimeout(() => {
            this.showGameOverScreen(gameWinner);
        }, 2000);
    }
    
    executeSpecialMove(player) {
        switch (player.type) {
            case 'ninja':
                this.ninjaSpecial(player);
                break;
            case 'warrior':
                this.warriorSpecial(player);
                break;
            case 'mage':
                this.mageSpecial(player);
                break;
            case 'robot':
                this.robotSpecial(player);
                break;
        }
    }
    
    ninjaSpecial(player) {
        // Dash rapide avec invulnérabilité temporaire
        const dashDistance = 150;
        const direction = player.facingRight ? 1 : -1;
        
        player.position.x += direction * dashDistance;
        player.invulnerable = true;
        player.invulnerabilityTimer = 0.5;
        
        // Effet visuel
        for (let i = 0; i < 10; i++) {
            const x = player.position.x + Math.random() * player.size.x;
            const y = player.position.y + Math.random() * player.size.y;
            const velocity = new Vector2(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );
            this.particleSystem.addParticle(x, y, velocity, '#2c3e50', 0.5);
        }
    }
    
    warriorSpecial(player) {
        // Charge puissante
        const chargeForce = 300;
        const direction = player.facingRight ? 1 : -1;
        
        player.velocity.x = direction * chargeForce;
        player.attackDamage *= 2;
        player.attack();
        
        // Réinitialiser les dégâts après l'attaque
        setTimeout(() => {
            player.applyTypeStats();
        }, 500);
    }
    
    mageSpecial(player) {
        // Projectile magique
        const projectile = new MagicProjectile(
            player.position.x + (player.facingRight ? player.size.x : 0),
            player.position.y + player.size.y / 2,
            player.facingRight,
            player.playerNumber
        );
        
        // Ajouter le projectile au jeu (nécessiterait un système de projectiles)
        // this.projectiles.push(projectile);
    }
    
    robotSpecial(player) {
        // Bouclier électrique
        player.defense *= 3;
        player.invulnerable = true;
        player.invulnerabilityTimer = 2.0;
        
        // Effet électrique
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const distance = 50;
            const x = player.position.x + player.size.x / 2 + Math.cos(angle) * distance;
            const y = player.position.y + player.size.y / 2 + Math.sin(angle) * distance;
            const velocity = new Vector2(Math.cos(angle) * 50, Math.sin(angle) * 50);
            this.particleSystem.addParticle(x, y, velocity, '#1abc9c', 1.0);
        }
        
        // Réinitialiser la défense
        setTimeout(() => {
            player.applyTypeStats();
        }, 2000);
    }
    
    // Méthodes d'état du jeu
    startGame() {
        this.gameState = 'playing';
        this.scores = [0, 0];
        this.startNewRound();
        this.ui.hideAllScreens();
    }
    
    showCharacterSelect() {
        this.gameState = 'characterSelect';
        this.ui.showCharacterSelect();
    }
    
    showControls() {
        this.ui.showControls();
    }
    
    backToMenu() {
        this.gameState = 'menu';
        this.ui.showMenu();
    }
    
    pause() {
        this.paused = true;
        this.gameState = 'paused';
    }
    
    resume() {
        this.paused = false;
        this.gameState = 'playing';
    }
    
    togglePause() {
        if (this.paused) {
            this.resume();
        } else {
            this.pause();
        }
    }
    
    restartRound() {
        this.startNewRound();
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    addCameraShake(intensity) {
        // Simple effet de secousse de caméra
        this.canvas.style.transform = `translate(${(Math.random() - 0.5) * intensity}px, ${(Math.random() - 0.5) * intensity}px)`;
        
        setTimeout(() => {
            this.canvas.style.transform = 'translate(0, 0)';
        }, 100);
    }
    
    handleResize() {
        // Ajuster la taille du canvas si nécessaire
        const container = document.getElementById('gameContainer');
        const containerRect = container.getBoundingClientRect();
        
        // Maintenir le ratio d'aspect
        const targetRatio = 1200 / 800;
        let newWidth = containerRect.width;
        let newHeight = containerRect.height;
        
        if (newWidth / newHeight > targetRatio) {
            newWidth = newHeight * targetRatio;
        } else {
            newHeight = newWidth / targetRatio;
        }
        
        this.canvas.style.width = newWidth + 'px';
        this.canvas.style.height = newHeight + 'px';
    }
    
    render() {
        // Nettoyer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dessiner selon l'état du jeu
        switch (this.gameState) {
            case 'menu':
                this.renderMenu();
                break;
            case 'characterSelect':
                this.renderCharacterSelect();
                break;
            case 'playing':
            case 'paused':
                this.renderGameplay();
                break;
            case 'gameOver':
                this.renderGameOver();
                break;
        }
    }
    
    renderMenu() {
        // Arrière-plan animé
        this.physicsWorld.drawBackground(this.ctx);
        this.particleSystem.draw(this.ctx);
    }
    
    renderCharacterSelect() {
        // Arrière-plan simple
        this.physicsWorld.drawBackground(this.ctx);
    }
    
    renderGameplay() {
        // Arrière-plan et plateformes
        this.physicsWorld.drawBackground(this.ctx);
        this.physicsWorld.drawPlatforms(this.ctx);
        
        // Personnages
        this.players.forEach(player => {
            player.draw(this.ctx);
        });
        
        // Particules
        this.particleSystem.draw(this.ctx);
        
        // Interface de jeu
        this.renderGameUI();
        
        // Écran de pause
        if (this.paused) {
            this.renderPauseOverlay();
        }
    }
    
    renderGameUI() {
        // Mettre à jour les barres de vie
        this.ui.updateHealthBar(1, this.players[0].getHealthPercentage());
        this.ui.updateHealthBar(2, this.players[1].getHealthPercentage());
        
        // Mettre à jour le timer
        this.ui.updateTimer(Math.ceil(this.gameTimer));
        
        // Mettre à jour le score
        this.ui.updateScore(this.scores[0], this.scores[1]);
    }
    
    renderPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSE', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Appuyez sur Échap pour reprendre', this.canvas.width / 2, this.canvas.height / 2 + 60);
    }
    
    renderGameOver() {
        this.renderGameplay();
        
        // Overlay de fin de partie
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        
        const winner = this.scores[0] > this.scores[1] ? 'Joueur 1' : 'Joueur 2';
        this.ctx.fillText(`${winner} Gagne!`, this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Score Final: ${this.scores[0]} - ${this.scores[1]}`, this.canvas.width / 2, this.canvas.height / 2 + 60);
        this.ctx.fillText('Appuyez sur R pour recommencer', this.canvas.width / 2, this.canvas.height / 2 + 100);
    }
    
    showGameOverScreen(winner) {
        // Logique d'affichage de l'écran de fin de partie
        console.log('Fin de partie! Gagnant:', winner.type);
    }
}

// Gestionnaire d'interface utilisateur
class UIManager {
    constructor() {
        this.healthBars = {
            1: document.querySelector('#player1Health .health-fill'),
            2: document.querySelector('#player2Health .health-fill')
        };
        
        this.timerElement = document.getElementById('timer');
        this.scoreElements = {
            p1: document.getElementById('p1Score'),
            p2: document.getElementById('p2Score')
        };
        
        this.screens = {
            menu: document.getElementById('menu'),
            characterSelect: document.getElementById('characterSelect'),
            controls: document.getElementById('controls')
        };
    }
    
    update(deltaTime) {
        // Animations d'interface
    }
    
    updateHealthBar(playerNumber, percentage) {
        const healthBar = this.healthBars[playerNumber];
        if (healthBar) {
            healthBar.style.width = `${percentage * 100}%`;
            
            // Changer la couleur selon la santé
            if (percentage > 0.6) {
                healthBar.style.background = 'linear-gradient(90deg, #4ecdc4, #44a08d)';
            } else if (percentage > 0.3) {
                healthBar.style.background = 'linear-gradient(90deg, #ffd93d, #f39c12)';
            } else {
                healthBar.style.background = 'linear-gradient(90deg, #ff6b6b, #e74c3c)';
            }
        }
    }
    
    updateTimer(seconds) {
        if (this.timerElement) {
            this.timerElement.textContent = seconds;
            
            // Effet d'urgence
            if (seconds <= 10) {
                this.timerElement.style.color = '#e74c3c';
                this.timerElement.style.animation = 'pulse 1s infinite';
            } else {
                this.timerElement.style.color = 'white';
                this.timerElement.style.animation = 'none';
            }
        }
    }
    
    updateScore(p1Score, p2Score) {
        if (this.scoreElements.p1) this.scoreElements.p1.textContent = p1Score;
        if (this.scoreElements.p2) this.scoreElements.p2.textContent = p2Score;
    }
    
    showMenu() {
        this.hideAllScreens();
        this.screens.menu.classList.add('active');
    }
    
    showCharacterSelect() {
        this.hideAllScreens();
        this.screens.characterSelect.classList.add('active');
    }
    
    showControls() {
        this.hideAllScreens();
        this.screens.controls.classList.add('active');
    }
    
    hideAllScreens() {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
    }
}