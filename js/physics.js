// Système de physique du jeu

class PhysicsWorld {
    constructor() {
        this.gravity = 800;
        this.friction = 0.85;
        this.airResistance = 0.98;
        this.platforms = [];
        this.boundaries = {
            left: 0,
            right: 1200,
            top: 0,
            bottom: 800
        };
    }
    
    addPlatform(x, y, width, height) {
        this.platforms.push(new Rectangle(x, y, width, height));
    }
    
    initializePlatforms() {
        // Nettoyer les plateformes existantes
        this.platforms = [];
        
        // Sol principal
        this.addPlatform(0, 750, 1200, 50);
        
        // Plateformes flottantes
        this.addPlatform(200, 600, 200, 20);
        this.addPlatform(800, 600, 200, 20);
        this.addPlatform(100, 450, 150, 20);
        this.addPlatform(950, 450, 150, 20);
        this.addPlatform(400, 500, 400, 20);
        this.addPlatform(500, 350, 200, 20);
        
        // Plateformes latérales
        this.addPlatform(50, 300, 100, 20);
        this.addPlatform(1050, 300, 100, 20);
        
        // Plateforme centrale haute
        this.addPlatform(450, 200, 300, 20);
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    resolveCollision(character, platform) {
        const charRect = character.getHitbox();
        
        if (!this.checkCollision(charRect, platform)) return false;
        
        // Calculer les distances de chevauchement
        const overlapLeft = charRect.x + charRect.width - platform.x;
        const overlapRight = platform.x + platform.width - charRect.x;
        const overlapTop = charRect.y + charRect.height - platform.y;
        const overlapBottom = platform.y + platform.height - charRect.y;
        
        // Trouver la plus petite distance de séparation
        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);
        
        // Résoudre la collision selon l'axe de moindre chevauchement
        if (minOverlapX < minOverlapY) {
            // Collision horizontale
            if (overlapLeft < overlapRight) {
                // Collision à gauche
                character.position.x = platform.x - character.size.x;
                if (character.velocity.x > 0) character.velocity.x = 0;
            } else {
                // Collision à droite
                character.position.x = platform.x + platform.width;
                if (character.velocity.x < 0) character.velocity.x = 0;
            }
        } else {
            // Collision verticale
            if (overlapTop < overlapBottom) {
                // Collision par le haut (atterrissage)
                character.position.y = platform.y - character.size.y;
                if (character.velocity.y > 0) {
                    character.velocity.y = 0;
                    character.isGrounded = true;
                }
            } else {
                // Collision par le bas (plafond)
                character.position.y = platform.y + platform.height;
                if (character.velocity.y < 0) character.velocity.y = 0;
            }
        }
        
        return true;
    }
    
    applyPhysics(character, deltaTime) {
        // Sauvegarder l'état précédent
        const wasGrounded = character.isGrounded;
        character.isGrounded = false;
        
        // Appliquer la gravité
        if (!wasGrounded) {
            character.velocity.y += this.gravity * deltaTime;
        }
        
        // Appliquer la résistance de l'air
        character.velocity.x *= this.airResistance;
        
        // Limiter la vitesse de chute
        character.velocity.y = Math.min(character.velocity.y, 600);
        
        // Mettre à jour la position
        character.position.x += character.velocity.x * deltaTime;
        character.position.y += character.velocity.y * deltaTime;
        
        // Vérifier les collisions avec les plateformes
        this.platforms.forEach(platform => {
            this.resolveCollision(character, platform);
        });
        
        // Appliquer la friction si au sol
        if (character.isGrounded) {
            character.velocity.x *= this.friction;
            character.hasDoubleJumped = false;
        }
        
        // Vérifier les limites du monde
        this.checkWorldBounds(character);
    }
    
    checkWorldBounds(character) {
        // Wrap horizontal
        if (character.position.x < this.boundaries.left - character.size.x) {
            character.position.x = this.boundaries.right;
        } else if (character.position.x > this.boundaries.right) {
            character.position.x = this.boundaries.left - character.size.x;
        }
        
        // Limite verticale supérieure
        if (character.position.y < this.boundaries.top) {
            character.position.y = this.boundaries.top;
            character.velocity.y = Math.max(0, character.velocity.y);
        }
        
        // Chute mortelle
        if (character.position.y > this.boundaries.bottom) {
            character.takeDamage(15);
            // Respawn au centre
            character.position.x = this.boundaries.right / 2 - character.size.x / 2;
            character.position.y = 100;
            character.velocity = new Vector2(0, 0);
        }
    }
    
    checkCharacterCollision(char1, char2) {
        const rect1 = char1.getHitbox();
        const rect2 = char2.getHitbox();
        
        if (this.checkCollision(rect1, rect2)) {
            // Calcul de la force de séparation
            const centerX1 = rect1.x + rect1.width / 2;
            const centerX2 = rect2.x + rect2.width / 2;
            const direction = centerX1 < centerX2 ? -1 : 1;
            
            // Séparer les personnages
            const separationForce = 50;
            char1.velocity.x += direction * separationForce;
            char2.velocity.x -= direction * separationForce;
            
            // Ajuster les positions pour éviter le chevauchement
            const overlap = (rect1.width + rect2.width) / 2 - Math.abs(centerX1 - centerX2);
            if (overlap > 0) {
                char1.position.x -= direction * overlap / 2;
                char2.position.x += direction * overlap / 2;
            }
        }
    }
    
    checkAttackHit(attacker, target) {
        if (!attacker.isAttacking || !target.isAlive || attacker === target) {
            return false;
        }
        
        const attackBox = attacker.attackBox;
        const targetBox = target.getHitbox();
        
        if (this.checkCollision(attackBox, targetBox)) {
            return target.takeDamage(attacker.attackDamage);
        }
        
        return false;
    }
    
    drawPlatforms(ctx) {
        ctx.fillStyle = '#8B4513'; // Couleur bois
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        
        this.platforms.forEach(platform => {
            // Dessiner la plateforme principale
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
            
            // Ajouter une texture simple
            ctx.fillStyle = '#A0522D';
            for (let x = platform.x; x < platform.x + platform.width; x += 20) {
                ctx.fillRect(x, platform.y + 2, 2, platform.height - 4);
            }
            ctx.fillStyle = '#8B4513';
        });
    }
    
    drawBackground(ctx) {
        // Dégradé de ciel
        const gradient = ctx.createLinearGradient(0, 0, 0, 800);
        gradient.addColorStop(0, '#87CEEB'); // Bleu ciel
        gradient.addColorStop(0.7, '#98FB98'); // Vert clair
        gradient.addColorStop(1, '#228B22'); // Vert foncé
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 800);
        
        // Nuages simples
        this.drawClouds(ctx);
        
        // Sol avec herbe
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, 750, 1200, 50);
        
        // Texture d'herbe
        ctx.fillStyle = '#32CD32';
        for (let x = 0; x < 1200; x += 5) {
            const height = Math.random() * 8 + 2;
            ctx.fillRect(x, 750 - height, 2, height);
        }
    }
    
    drawClouds(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Nuages statiques pour la démo
        const clouds = [
            { x: 100, y: 100, size: 40 },
            { x: 300, y: 80, size: 60 },
            { x: 600, y: 120, size: 50 },
            { x: 900, y: 90, size: 45 },
            { x: 1100, y: 110, size: 35 }
        ];
        
        clouds.forEach(cloud => {
            this.drawCloud(ctx, cloud.x, cloud.y, cloud.size);
        });
    }
    
    drawCloud(ctx, x, y, size) {
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.arc(x + size * 0.4, y, size * 0.7, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y, size * 0.5, 0, Math.PI * 2);
        ctx.arc(x + size * 0.2, y - size * 0.2, size * 0.4, 0, Math.PI * 2);
        ctx.arc(x + size * 0.6, y - size * 0.2, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Utilitaires pour les effets spéciaux
    createPlatformBreakEffect(x, y, width, height, particleSystem) {
        const particleCount = Math.floor(width / 10);
        for (let i = 0; i < particleCount; i++) {
            const particleX = x + Math.random() * width;
            const particleY = y + Math.random() * height;
            const velocity = new Vector2(
                (Math.random() - 0.5) * 200,
                Math.random() * -100 - 50
            );
            particleSystem.addParticle(particleX, particleY, velocity, '#8B4513', 1.0);
        }
    }
    
    isPositionOnPlatform(x, y) {
        const testRect = new Rectangle(x, y, 1, 1);
        return this.platforms.some(platform => 
            this.checkCollision(testRect, platform)
        );
    }
    
    findNearestPlatform(x, y) {
        let nearest = null;
        let minDistance = Infinity;
        
        this.platforms.forEach(platform => {
            const centerX = platform.x + platform.width / 2;
            const centerY = platform.y + platform.height / 2;
            const distance = Math.sqrt(
                Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                nearest = platform;
            }
        });
        
        return nearest;
    }
}