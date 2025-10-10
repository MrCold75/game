// Système de gestion des entrées

class InputManager {
    constructor() {
        this.keys = {};
        this.previousKeys = {};
        this.gamepadManager = new GamepadManager();
        
        this.bindEvents();
        this.setupKeyMappings();
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            e.preventDefault();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            e.preventDefault();
        });
        
        // Éviter la perte de focus
        window.addEventListener('blur', () => {
            this.keys = {};
        });
    }
    
    setupKeyMappings() {
        // Contrôles Joueur 1 (WASD + FG)
        this.player1Controls = {
            left: 'KeyA',
            right: 'KeyD',
            up: 'KeyW',
            down: 'KeyS',
            attack: 'KeyF',
            defend: 'KeyG',
            special: 'KeyR'
        };
        
        // Contrôles Joueur 2 (Flèches + Numpad)
        this.player2Controls = {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            up: 'ArrowUp',
            down: 'ArrowDown',
            attack: 'Numpad1',
            defend: 'Numpad2',
            special: 'Numpad3'
        };
        
        // Contrôles généraux
        this.generalControls = {
            pause: 'Escape',
            restart: 'KeyR',
            fullscreen: 'F11'
        };
    }
    
    update() {
        // Copier l'état actuel vers l'état précédent
        this.previousKeys = { ...this.keys };
        
        // Mettre à jour les manettes
        this.gamepadManager.update();
    }
    
    isPressed(key) {
        return this.keys[key] || false;
    }
    
    wasJustPressed(key) {
        return this.keys[key] && !this.previousKeys[key];
    }
    
    wasJustReleased(key) {
        return !this.keys[key] && this.previousKeys[key];
    }
    
    // Méthodes pour les actions spécifiques des joueurs
    getPlayer1Input() {
        const gamepad = this.gamepadManager.getGamepad(0);
        
        return {
            moveLeft: this.isPressed(this.player1Controls.left) || 
                     (gamepad && gamepad.axes[0] < -0.3),
            moveRight: this.isPressed(this.player1Controls.right) || 
                      (gamepad && gamepad.axes[0] > 0.3),
            jump: this.wasJustPressed(this.player1Controls.up) || 
                  (gamepad && this.gamepadManager.wasButtonJustPressed(0, 0)),
            attack: this.wasJustPressed(this.player1Controls.attack) || 
                   (gamepad && this.gamepadManager.wasButtonJustPressed(0, 2)),
            defend: this.isPressed(this.player1Controls.defend) || 
                   (gamepad && gamepad.buttons[1] && gamepad.buttons[1].pressed),
            special: this.wasJustPressed(this.player1Controls.special) || 
                    (gamepad && this.gamepadManager.wasButtonJustPressed(0, 3))
        };
    }
    
    getPlayer2Input() {
        const gamepad = this.gamepadManager.getGamepad(1);
        
        return {
            moveLeft: this.isPressed(this.player2Controls.left) || 
                     (gamepad && gamepad.axes[0] < -0.3),
            moveRight: this.isPressed(this.player2Controls.right) || 
                      (gamepad && gamepad.axes[0] > 0.3),
            jump: this.wasJustPressed(this.player2Controls.up) || 
                  (gamepad && this.gamepadManager.wasButtonJustPressed(1, 0)),
            attack: this.wasJustPressed(this.player2Controls.attack) || 
                   (gamepad && this.gamepadManager.wasButtonJustPressed(1, 2)),
            defend: this.isPressed(this.player2Controls.defend) || 
                   (gamepad && gamepad.buttons[1] && gamepad.buttons[1].pressed),
            special: this.wasJustPressed(this.player2Controls.special) || 
                    (gamepad && this.gamepadManager.wasButtonJustPressed(1, 3))
        };
    }
    
    getGeneralInput() {
        return {
            pause: this.wasJustPressed(this.generalControls.pause),
            restart: this.wasJustPressed(this.generalControls.restart),
            fullscreen: this.wasJustPressed(this.generalControls.fullscreen)
        };
    }
    
    // Configuration des contrôles
    remapKey(player, action, newKey) {
        if (player === 1) {
            this.player1Controls[action] = newKey;
        } else if (player === 2) {
            this.player2Controls[action] = newKey;
        }
    }
    
    getKeyName(keyCode) {
        const keyNames = {
            'KeyA': 'A', 'KeyB': 'B', 'KeyC': 'C', 'KeyD': 'D', 'KeyE': 'E',
            'KeyF': 'F', 'KeyG': 'G', 'KeyH': 'H', 'KeyI': 'I', 'KeyJ': 'J',
            'KeyK': 'K', 'KeyL': 'L', 'KeyM': 'M', 'KeyN': 'N', 'KeyO': 'O',
            'KeyP': 'P', 'KeyQ': 'Q', 'KeyR': 'R', 'KeyS': 'S', 'KeyT': 'T',
            'KeyU': 'U', 'KeyV': 'V', 'KeyW': 'W', 'KeyX': 'X', 'KeyY': 'Y',
            'KeyZ': 'Z',
            'ArrowLeft': '←', 'ArrowRight': '→', 'ArrowUp': '↑', 'ArrowDown': '↓',
            'Space': 'Espace', 'Enter': 'Entrée', 'Escape': 'Échap',
            'Numpad0': 'Num 0', 'Numpad1': 'Num 1', 'Numpad2': 'Num 2',
            'Numpad3': 'Num 3', 'Numpad4': 'Num 4', 'Numpad5': 'Num 5',
            'Numpad6': 'Num 6', 'Numpad7': 'Num 7', 'Numpad8': 'Num 8',
            'Numpad9': 'Num 9'
        };
        
        return keyNames[keyCode] || keyCode;
    }
}

class GamepadManager {
    constructor() {
        this.gamepads = {};
        this.previousButtonStates = {};
        this.deadzone = 0.1;
        
        window.addEventListener('gamepadconnected', (e) => {
            console.log('Manette connectée:', e.gamepad);
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('Manette déconnectée:', e.gamepad);
            delete this.gamepads[e.gamepad.index];
            delete this.previousButtonStates[e.gamepad.index];
        });
    }
    
    update() {
        const gamepads = navigator.getGamepads();
        
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                // Sauvegarder l'état précédent des boutons
                if (!this.previousButtonStates[i]) {
                    this.previousButtonStates[i] = [];
                }
                
                const currentGamepad = this.gamepads[i];
                if (currentGamepad) {
                    for (let j = 0; j < currentGamepad.buttons.length; j++) {
                        this.previousButtonStates[i][j] = currentGamepad.buttons[j].pressed;
                    }
                }
                
                // Mettre à jour l'état actuel
                this.gamepads[i] = gamepads[i];
            }
        }
    }
    
    getGamepad(index) {
        return this.gamepads[index] || null;
    }
    
    isButtonPressed(gamepadIndex, buttonIndex) {
        const gamepad = this.getGamepad(gamepadIndex);
        return gamepad && gamepad.buttons[buttonIndex] && gamepad.buttons[buttonIndex].pressed;
    }
    
    wasButtonJustPressed(gamepadIndex, buttonIndex) {
        const gamepad = this.getGamepad(gamepadIndex);
        const isPressed = gamepad && gamepad.buttons[buttonIndex] && gamepad.buttons[buttonIndex].pressed;
        const wasPressed = this.previousButtonStates[gamepadIndex] && 
                          this.previousButtonStates[gamepadIndex][buttonIndex];
        
        return isPressed && !wasPressed;
    }
    
    getAxis(gamepadIndex, axisIndex) {
        const gamepad = this.getGamepad(gamepadIndex);
        if (!gamepad || !gamepad.axes[axisIndex]) return 0;
        
        const value = gamepad.axes[axisIndex];
        return Math.abs(value) > this.deadzone ? value : 0;
    }
    
    getStick(gamepadIndex, stickIndex) {
        // stickIndex: 0 = stick gauche, 1 = stick droit
        const xAxis = stickIndex * 2;
        const yAxis = stickIndex * 2 + 1;
        
        return new Vector2(
            this.getAxis(gamepadIndex, xAxis),
            this.getAxis(gamepadIndex, yAxis)
        );
    }
    
    vibrate(gamepadIndex, duration = 200, strongMagnitude = 1.0, weakMagnitude = 0.5) {
        const gamepad = this.getGamepad(gamepadIndex);
        if (gamepad && gamepad.vibrationActuator) {
            gamepad.vibrationActuator.playEffect('dual-rumble', {
                duration: duration,
                strongMagnitude: strongMagnitude,
                weakMagnitude: weakMagnitude
            });
        }
    }
}

// Système de combo et inputs avancés
class ComboSystem {
    constructor() {
        this.combos = new Map();
        this.inputBuffer = [];
        this.bufferTime = 1000; // 1 seconde de buffer
        this.comboWindow = 500; // 500ms entre chaque input du combo
    }
    
    addCombo(name, sequence, callback) {
        this.combos.set(name, {
            sequence: sequence,
            callback: callback
        });
    }
    
    recordInput(input, timestamp) {
        this.inputBuffer.push({
            input: input,
            timestamp: timestamp
        });
        
        // Nettoyer le buffer des anciens inputs
        this.cleanBuffer(timestamp);
        
        // Vérifier les combos
        this.checkCombos(timestamp);
    }
    
    cleanBuffer(currentTime) {
        this.inputBuffer = this.inputBuffer.filter(
            entry => currentTime - entry.timestamp < this.bufferTime
        );
    }
    
    checkCombos(currentTime) {
        for (let [name, combo] of this.combos) {
            if (this.matchesCombo(combo.sequence, currentTime)) {
                combo.callback();
                this.clearRecentInputs(combo.sequence.length);
                break;
            }
        }
    }
    
    matchesCombo(sequence, currentTime) {
        if (this.inputBuffer.length < sequence.length) return false;
        
        const recentInputs = this.inputBuffer.slice(-sequence.length);
        
        // Vérifier que les inputs correspondent
        for (let i = 0; i < sequence.length; i++) {
            if (recentInputs[i].input !== sequence[i]) return false;
        }
        
        // Vérifier le timing
        for (let i = 1; i < recentInputs.length; i++) {
            const timeDiff = recentInputs[i].timestamp - recentInputs[i - 1].timestamp;
            if (timeDiff > this.comboWindow) return false;
        }
        
        return true;
    }
    
    clearRecentInputs(count) {
        this.inputBuffer = this.inputBuffer.slice(0, -count);
    }
}

// Configuration des combos par défaut
function setupDefaultCombos(comboSystem, character) {
    // Combo Hadoken (bas, bas-avant, avant + attaque)
    comboSystem.addCombo('hadoken', ['down', 'down-forward', 'forward', 'attack'], () => {
        character.executeSpecialMove('projectile');
    });
    
    // Combo Shoryuken (avant, bas, bas-avant + attaque)
    comboSystem.addCombo('shoryuken', ['forward', 'down', 'down-forward', 'attack'], () => {
        character.executeSpecialMove('uppercut');
    });
    
    // Combo de téléportation (arrière, arrière + défense)
    comboSystem.addCombo('teleport', ['back', 'back', 'defend'], () => {
        character.executeSpecialMove('teleport');
    });
}