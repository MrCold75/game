// Gestionnaire d'assets (images, sons, etc.)

class AssetManager {
    constructor() {
        this.images = new Map();
        this.sounds = new Map();
        this.loaded = 0;
        this.total = 0;
        this.onProgress = null;
        this.onComplete = null;
    }
    
    // Charger une image
    loadImage(id, src) {
        return new Promise((resolve, reject) => {
            this.total++;
            
            const img = new Image();
            img.onload = () => {
                this.images.set(id, img);
                this.loaded++;
                
                if (this.onProgress) {
                    this.onProgress(this.loaded, this.total);
                }
                
                if (this.loaded === this.total && this.onComplete) {
                    this.onComplete();
                }
                
                resolve(img);
            };
            
            img.onerror = () => {
                console.warn(`Impossible de charger l'image: ${src}`);
                // Créer une image de remplacement
                const placeholder = this.createPlaceholder(id);
                this.images.set(id, placeholder);
                this.loaded++;
                
                if (this.onProgress) {
                    this.onProgress(this.loaded, this.total);
                }
                
                if (this.loaded === this.total && this.onComplete) {
                    this.onComplete();
                }
                
                resolve(placeholder);
            };
            
            img.src = src;
        });
    }
    
    // Créer une image placeholder si le fichier n'existe pas
    createPlaceholder(id) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Si c'est un effet, utiliser createEffectPlaceholder
        if (id.startsWith('effect_')) {
            const effectName = id.replace('effect_', '');
            return this.createEffectPlaceholder(effectName);
        }
        
        // Couleurs selon le type de personnage
        const colors = {
            'ninja_idle': '#2c3e50',
            'warrior_idle': '#e74c3c',
            'mage_idle': '#9b59b6',
            'robot_idle': '#34495e'
        };
        
        const color = colors[id] || '#95a5a6';
        
        // Dessiner un rectangle coloré avec une bordure
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 64, 64);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, 64, 64);
        
        // Ajouter un symbole simple
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('?', 32, 38);
        
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }
    
    // Créer une image placeholder pour les effets
    createEffectPlaceholder(effect) {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Couleurs selon le type d'effet
        const colors = {
            'hit': '#e74c3c',
            'explosion': '#f39c12',
            'magic': '#9b59b6',
            'dash': '#3498db'
        };
        
        const color = colors[effect] || '#95a5a6';
        
        // Dessiner un cercle pour l'effet
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(16, 16, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Ajouter une bordure
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }
    
    // Charger tous les assets nécessaires
    async loadAllAssets() {
        const characterTypes = ['ninja', 'warrior', 'mage', 'robot'];
        const animations = ['idle', 'walk', 'jump', 'attack', 'hurt'];
        
        const loadPromises = [];
        
        // Charger les sprites des personnages (images séparées)
        for (const type of characterTypes) {
            for (const anim of animations) {
                const id = `${type}_${anim}`;
                const src = `./assets/characters/${type}_${anim}.png`;
                loadPromises.push(this.loadImage(id, src));
            }
            
            // Charger l'icône pour la sélection
            const iconId = `${type}_icon`;
            const iconSrc = `./assets/characters/${type}_icon.png`;
            loadPromises.push(this.loadImage(iconId, iconSrc));
        }
        
        // Charger les effets (optionnel - utilise des formes géométriques si non disponible)
        const effects = ['hit', 'explosion', 'magic', 'dash'];
        for (const effect of effects) {
            const id = `effect_${effect}`;
            const src = `./assets/effects/${effect}.png`;
            loadPromises.push(this.loadImage(id, src));
        }
        
        await Promise.all(loadPromises);
        console.log('Tous les assets chargés!');
    }
    
    // Obtenir une image
    getImage(id) {
        return this.images.get(id);
    }
    
    // Vérifier si une image existe
    hasImage(id) {
        return this.images.has(id);
    }
    
    // Obtenir le pourcentage de chargement
    getProgress() {
        return this.total > 0 ? (this.loaded / this.total) * 100 : 0;
    }
}

// Gestionnaire de sprites avec animations
class SpriteRenderer {
    constructor(character, assetManager) {
        this.character = character;
        this.assetManager = assetManager;
        this.currentAnimation = 'idle';
        this.frameIndex = 0;
        this.frameTime = 0;
        this.frameRate = 0.1; // 100ms par frame
        this.flipX = false;
    }
    
    update(deltaTime) {
        this.frameTime += deltaTime;
        
        if (this.frameTime >= this.frameRate) {
            this.frameIndex = (this.frameIndex + 1) % this.getFrameCount();
            this.frameTime = 0;
        }
        
        // Déterminer l'animation selon l'état du personnage
        this.updateAnimation();
    }
    
    updateAnimation() {
        let newAnimation = 'idle';
        
        if (!this.character.isAlive) {
            newAnimation = 'hurt';
        } else if (this.character.isAttacking) {
            newAnimation = 'attack';
        } else if (!this.character.isGrounded) {
            newAnimation = 'jump';
        } else if (Math.abs(this.character.velocity.x) > 10) {
            newAnimation = 'walk';
        }
        
        if (newAnimation !== this.currentAnimation) {
            this.currentAnimation = newAnimation;
            this.frameIndex = 0;
            this.frameTime = 0;
        }
        
        // Mise à jour de la direction
        this.flipX = !this.character.facingRight;
    }
    
    getFrameCount() {
        // Nombre de frames par animation (peut être configuré par type)
        const frameCounts = {
            'idle': 4,
            'walk': 6,
            'jump': 2,
            'attack': 4,
            'hurt': 2
        };
        
        return frameCounts[this.currentAnimation] || 1;
    }
    
    draw(ctx) {
        const spriteId = `${this.character.type}_${this.currentAnimation}`;
        const image = this.assetManager.getImage(spriteId);
        
        if (!image) {
            // Fallback vers le rendu par défaut
            this.character.draw(ctx);
            return;
        }
        
        ctx.save();
        
        // Position et taille
        const x = this.character.position.x;
        const y = this.character.position.y;
        const width = this.character.size.x;
        const height = this.character.size.y;
        
        // Flip horizontal si nécessaire
        if (this.flipX) {
            ctx.scale(-1, 1);
            ctx.translate(-x - width, 0);
        }
        
        // Effet de clignotement si invulnérable
        if (this.character.invulnerable && Math.floor(this.character.invulnerabilityTimer * 10) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        // Dessiner l'image du sprite
        ctx.drawImage(image, x, y, width, height);
        
        // Dessiner les effets spéciaux
        this.drawEffects(ctx);
        
        ctx.restore();
    }
    
    drawEffects(ctx) {
        // Effet d'attaque
        if (this.character.isAttacking) {
            const effectImage = this.assetManager.getImage('effect_hit');
            if (effectImage) {
                const effectX = this.character.facingRight ? 
                    this.character.position.x + this.character.size.x : 
                    this.character.position.x - 32;
                const effectY = this.character.position.y + this.character.size.y / 2 - 16;
                
                ctx.globalAlpha = 0.7;
                ctx.drawImage(effectImage, effectX, effectY, 32, 32);
                ctx.globalAlpha = 1.0;
            }
        }
        
        // Effet de défense
        if (this.character.isDefending) {
            ctx.strokeStyle = '#4ecdc4';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(
                this.character.position.x - 5, 
                this.character.position.y - 5, 
                this.character.size.x + 10, 
                this.character.size.y + 10
            );
            ctx.setLineDash([]);
        }
    }
}