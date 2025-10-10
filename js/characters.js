// Système de personnages et leurs capacités

class Character {
    constructor(x, y, type, playerNumber, assetManager = null) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.size = new Vector2(40, 60);
        this.type = type;
        this.playerNumber = playerNumber;
        
        // Gestionnaire de sprites
        this.assetManager = assetManager;
        this.spriteRenderer = assetManager ? new SpriteRenderer(this, assetManager) : null;
        this.useSprites = assetManager !== null;
        
        // Stats de base
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 200;
        this.jumpPower = 400;
        this.attackDamage = 15;
        this.defense = 1;
        
        // États
        this.isGrounded = false;
        this.isAttacking = false;
        this.isDefending = false;
        this.isJumping = false;
        this.facingRight = true;
        this.isAlive = true;
        this.invulnerable = false;
        this.canDoubleJump = true;
        this.hasDoubleJumped = false;
        
        // Animations et timers
        this.attackTimer = 0;
        this.invulnerabilityTimer = 0;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.actionCooldown = 0;
        
        // Hitbox pour les attaques
        this.attackBox = new Rectangle(0, 0, 0, 0);
        
        // Appliquer les stats spécifiques au type
        this.applyTypeStats();
        
        // Couleurs pour le rendu
        this.setColors();
    }
    
    applyTypeStats() {
        switch (this.type) {
            case 'ninja':
                this.speed = 280;
                this.jumpPower = 450;
                this.attackDamage = 12;
                this.defense = 0.8;
                this.size.x = 35;
                break;
            case 'warrior':
                this.speed = 160;
                this.jumpPower = 350;
                this.attackDamage = 25;
                this.defense = 1.5;
                this.maxHealth = 120;
                this.health = 120;
                this.size.x = 50;
                break;
            case 'mage':
                this.speed = 200;
                this.jumpPower = 380;
                this.attackDamage = 20;
                this.defense = 0.7;
                this.maxHealth = 80;
                this.health = 80;
                break;
            case 'robot':
                this.speed = 220;
                this.jumpPower = 380;
                this.attackDamage = 18;
                this.defense = 1.2;
                this.maxHealth = 110;
                this.health = 110;
                break;
        }
    }
    
    setColors() {
        const colorSchemes = {
            ninja: { primary: '#2c3e50', secondary: '#34495e', accent: '#e74c3c' },
            warrior: { primary: '#e74c3c', secondary: '#c0392b', accent: '#f39c12' },
            mage: { primary: '#9b59b6', secondary: '#8e44ad', accent: '#3498db' },
            robot: { primary: '#34495e', secondary: '#2c3e50', accent: '#1abc9c' }
        };
        
        this.colors = colorSchemes[this.type] || colorSchemes.robot;
    }
    
    update(deltaTime, platforms) {
        // Mettre à jour les timers
        this.updateTimers(deltaTime);
        
        // Appliquer la physique
        this.applyPhysics(deltaTime, platforms);
        
        // Mettre à jour l'animation
        this.updateAnimation(deltaTime);
        
        // Mettre à jour le renderer de sprites
        if (this.spriteRenderer) {
            this.spriteRenderer.update(deltaTime);
        }
        
        // Mettre à jour la hitbox d'attaque
        this.updateAttackBox();
        
        // Vérifier les limites de l'écran
        this.checkScreenBounds();
    }
    
    updateTimers(deltaTime) {
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
            }
        }
        
        if (this.invulnerabilityTimer > 0) {
            this.invulnerabilityTimer -= deltaTime;
            if (this.invulnerabilityTimer <= 0) {
                this.invulnerable = false;
            }
        }
        
        if (this.actionCooldown > 0) {
            this.actionCooldown -= deltaTime;
        }
        
        this.animationTimer += deltaTime;
    }
    
    applyPhysics(deltaTime, platforms) {
        // Sauvegarder la position précédente
        const previousY = this.position.y;
        
        // Appliquer la gravité
        if (!this.isGrounded) {
            this.velocity.y += 800 * deltaTime; // Gravité
        }
        
        // Appliquer la friction horizontale
        this.velocity.x *= 0.85;
        
        // Mettre à jour la position
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        
        // Collision avec les plateformes
        this.isGrounded = false;
        this.checkPlatformCollisions(platforms);
        
        // Réinitialiser le double saut si on touche le sol
        if (this.isGrounded && this.velocity.y >= 0) {
            this.hasDoubleJumped = false;
            this.isJumping = false;
        }
    }
    
    checkPlatformCollisions(platforms) {
        const characterRect = new Rectangle(
            this.position.x, 
            this.position.y, 
            this.size.x, 
            this.size.y
        );
        
        platforms.forEach(platform => {
            if (characterRect.intersects(platform)) {
                // Collision par le dessus (atterrissage)
                if (this.velocity.y > 0 && 
                    this.position.y < platform.y && 
                    this.position.y + this.size.y > platform.y) {
                    this.position.y = platform.y - this.size.y;
                    this.velocity.y = 0;
                    this.isGrounded = true;
                }
                // Collision par le dessous (plafond)
                else if (this.velocity.y < 0 && 
                         this.position.y > platform.y + platform.height) {
                    this.position.y = platform.y + platform.height;
                    this.velocity.y = 0;
                }
                // Collisions latérales
                else if (this.velocity.x > 0 && 
                         this.position.x < platform.x) {
                    this.position.x = platform.x - this.size.x;
                    this.velocity.x = 0;
                }
                else if (this.velocity.x < 0 && 
                         this.position.x > platform.x + platform.width) {
                    this.position.x = platform.x + platform.width;
                    this.velocity.x = 0;
                }
            }
        });
    }
    
    updateAnimation(deltaTime) {
        // Logique d'animation simple basée sur l'état
        if (this.animationTimer > 0.1) { // Changement d'animation toutes les 100ms
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTimer = 0;
        }
    }
    
    updateAttackBox() {
        if (this.isAttacking) {
            const attackRange = 60;
            const attackWidth = 40;
            const attackHeight = 30;
            
            if (this.facingRight) {
                this.attackBox = new Rectangle(
                    this.position.x + this.size.x,
                    this.position.y + 15,
                    attackRange,
                    attackHeight
                );
            } else {
                this.attackBox = new Rectangle(
                    this.position.x - attackRange,
                    this.position.y + 15,
                    attackRange,
                    attackHeight
                );
            }
        } else {
            this.attackBox = new Rectangle(0, 0, 0, 0);
        }
    }
    
    checkScreenBounds() {
        // Limites horizontales avec wrap-around
        if (this.position.x < -this.size.x) {
            this.position.x = canvas.width;
        } else if (this.position.x > canvas.width) {
            this.position.x = -this.size.x;
        }
        
        // Limite verticale (fond de l'écran)
        if (this.position.y > canvas.height) {
            this.takeDamage(20); // Dégâts de chute
            this.position.y = 100; // Respawn en haut
            this.velocity.y = 0;
        }
    }
    
    // Actions du personnage
    move(direction) {
        if (this.actionCooldown > 0) return;
        
        this.velocity.x = direction * this.speed;
        this.facingRight = direction > 0;
    }
    
    jump() {
        if (this.isGrounded) {
            this.velocity.y = -this.jumpPower;
            this.isGrounded = false;
            this.isJumping = true;
        } else if (this.canDoubleJump && !this.hasDoubleJumped) {
            this.velocity.y = -this.jumpPower * 0.8; // Double saut moins puissant
            this.hasDoubleJumped = true;
        }
    }
    
    attack() {
        if (this.actionCooldown > 0 || this.isAttacking) return;
        
        this.isAttacking = true;
        this.attackTimer = 0.3; // Durée de l'attaque
        this.actionCooldown = 0.5; // Cooldown entre les attaques
        
        // Effet spécial selon le type
        this.executeSpecialAttack();
    }
    
    executeSpecialAttack() {
        switch (this.type) {
            case 'ninja':
                // Attaque rapide avec petite téléportation
                const teleportDistance = 20;
                if (this.facingRight) {
                    this.position.x += teleportDistance;
                } else {
                    this.position.x -= teleportDistance;
                }
                break;
            case 'warrior':
                // Attaque puissante avec recul
                this.attackDamage = 25;
                break;
            case 'mage':
                // Projectile magique (sera géré par le système de jeu)
                break;
            case 'robot':
                // Attaque avec effet électrique
                break;
        }
    }
    
    defend() {
        this.isDefending = true;
    }
    
    stopDefending() {
        this.isDefending = false;
    }
    
    takeDamage(damage) {
        if (this.invulnerable || !this.isAlive) return false;
        
        const actualDamage = this.isDefending ? 
            Math.max(1, damage / this.defense / 2) : 
            Math.max(1, damage / this.defense);
        
        this.health -= actualDamage;
        this.invulnerable = true;
        this.invulnerabilityTimer = 1.0; // 1 seconde d'invulnérabilité
        
        // Effet de recul
        const knockbackForce = 100;
        this.velocity.x += this.facingRight ? -knockbackForce : knockbackForce;
        
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
        }
        
        return true;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    reset(x, y) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.health = this.maxHealth;
        this.isAlive = true;
        this.invulnerable = false;
        this.isAttacking = false;
        this.isDefending = false;
        this.isJumping = false;
        this.hasDoubleJumped = false;
        this.attackTimer = 0;
        this.invulnerabilityTimer = 0;
        this.actionCooldown = 0;
        this.facingRight = this.playerNumber === 1;
    }
    
    draw(ctx) {
        // Utiliser le sprite renderer si disponible
        if (this.useSprites && this.spriteRenderer) {
            this.spriteRenderer.draw(ctx);
            
            // Dessiner la hitbox d'attaque pour debug
            if (this.isAttacking && game && game.debug) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                ctx.fillRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
            }
            
            return;
        }
        
        // Rendu par défaut (formes géométriques)
        ctx.save();
        
        // Effet de clignotement si invulnérable
        if (this.invulnerable && Math.floor(this.invulnerabilityTimer * 10) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        // Dessiner le corps du personnage
        ctx.fillStyle = this.colors.primary;
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        
        // Dessiner les détails selon le type
        this.drawCharacterDetails(ctx);
        
        // Dessiner l'état de défense
        if (this.isDefending) {
            ctx.strokeStyle = this.colors.accent;
            ctx.lineWidth = 3;
            ctx.strokeRect(this.position.x - 5, this.position.y - 5, this.size.x + 10, this.size.y + 10);
        }
        
        // Dessiner la hitbox d'attaque (pour debug)
        if (this.isAttacking && game && game.debug) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.fillRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height);
        }
        
        ctx.restore();
    }
    
    drawCharacterDetails(ctx) {
        const centerX = this.position.x + this.size.x / 2;
        const centerY = this.position.y + this.size.y / 2;
        
        switch (this.type) {
            case 'ninja':
                // Masque ninja
                ctx.fillStyle = this.colors.secondary;
                ctx.fillRect(this.position.x + 5, this.position.y + 5, this.size.x - 10, 15);
                // Yeux
                ctx.fillStyle = this.colors.accent;
                ctx.fillRect(this.position.x + 10, this.position.y + 8, 6, 3);
                ctx.fillRect(this.position.x + 20, this.position.y + 8, 6, 3);
                break;
                
            case 'warrior':
                // Casque
                ctx.fillStyle = this.colors.accent;
                ctx.fillRect(this.position.x, this.position.y, this.size.x, 20);
                // Plume
                ctx.fillStyle = this.colors.secondary;
                ctx.fillRect(centerX - 2, this.position.y - 10, 4, 10);
                break;
                
            case 'mage':
                // Chapeau pointu
                ctx.fillStyle = this.colors.secondary;
                ctx.beginPath();
                ctx.moveTo(centerX, this.position.y - 15);
                ctx.lineTo(this.position.x + 5, this.position.y + 10);
                ctx.lineTo(this.position.x + this.size.x - 5, this.position.y + 10);
                ctx.closePath();
                ctx.fill();
                // Étoiles magiques
                if (this.isAttacking) {
                    ctx.fillStyle = this.colors.accent;
                    this.drawStar(ctx, centerX + 30, centerY, 5);
                }
                break;
                
            case 'robot':
                // Antennes
                ctx.strokeStyle = this.colors.accent;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(this.position.x + 10, this.position.y);
                ctx.lineTo(this.position.x + 8, this.position.y - 8);
                ctx.moveTo(this.position.x + this.size.x - 10, this.position.y);
                ctx.lineTo(this.position.x + this.size.x - 8, this.position.y - 8);
                ctx.stroke();
                // Yeux LED
                ctx.fillStyle = this.colors.accent;
                ctx.fillRect(this.position.x + 8, this.position.y + 10, 8, 4);
                ctx.fillRect(this.position.x + 20, this.position.y + 10, 8, 4);
                break;
        }
    }
    
    drawStar(ctx, x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const x1 = x + Math.cos(angle) * size;
            const y1 = y + Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(x1, y1);
            else ctx.lineTo(x1, y1);
            
            const innerAngle = angle + Math.PI / 5;
            const x2 = x + Math.cos(innerAngle) * size / 2;
            const y2 = y + Math.sin(innerAngle) * size / 2;
            ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    getHitbox() {
        return new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);
    }
    
    getHealthPercentage() {
        return this.health / this.maxHealth;
    }
}