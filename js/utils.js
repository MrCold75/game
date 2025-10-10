// Fonctions utilitaires pour le jeu

class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2(0, 0);
        return new Vector2(this.x / mag, this.y / mag);
    }

    distance(vector) {
        return this.subtract(vector).magnitude();
    }
}

class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    intersects(rect) {
        return this.x < rect.x + rect.width &&
               this.x + this.width > rect.x &&
               this.y < rect.y + rect.height &&
               this.y + this.height > rect.y;
    }

    contains(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }

    center() {
        return new Vector2(this.x + this.width / 2, this.y + this.height / 2);
    }
}

// Fonctions d'animation et d'interpolation
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Gestionnaire d'animations
class AnimationManager {
    constructor() {
        this.animations = new Map();
    }

    addAnimation(id, startValue, endValue, duration, callback, easing = easeInOut) {
        this.animations.set(id, {
            startValue,
            endValue,
            duration,
            elapsed: 0,
            callback,
            easing,
            active: true
        });
    }

    update(deltaTime) {
        for (let [id, animation] of this.animations) {
            if (!animation.active) continue;

            animation.elapsed += deltaTime;
            const progress = Math.min(animation.elapsed / animation.duration, 1);
            const easedProgress = animation.easing(progress);
            const currentValue = lerp(animation.startValue, animation.endValue, easedProgress);

            animation.callback(currentValue);

            if (progress >= 1) {
                animation.active = false;
                this.animations.delete(id);
            }
        }
    }

    stopAnimation(id) {
        if (this.animations.has(id)) {
            this.animations.get(id).active = false;
            this.animations.delete(id);
        }
    }

    isAnimating(id) {
        return this.animations.has(id);
    }
}

// Gestionnaire de particules
class Particle {
    constructor(x, y, velocity, color, life) {
        this.position = new Vector2(x, y);
        this.velocity = velocity;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = Math.random() * 3 + 1;
    }

    update(deltaTime) {
        this.position = this.position.add(this.velocity.multiply(deltaTime));
        this.velocity.y += 200 * deltaTime; // Gravité
        this.life -= deltaTime;
        this.size = Math.max(0, this.size - deltaTime);
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    addParticle(x, y, velocity, color, life) {
        this.particles.push(new Particle(x, y, velocity, color, life));
    }

    createExplosion(x, y, count = 10, color = '#ff6b6b') {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 100 + 50;
            const velocity = new Vector2(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            this.addParticle(x, y, velocity, color, Math.random() * 0.5 + 0.5);
        }
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(deltaTime);
            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }

    clear() {
        this.particles = [];
    }
}

// Système de son (placeholder)
class SoundManager {
    constructor() {
        this.sounds = new Map();
        this.enabled = true;
    }

    loadSound(id, src) {
        const audio = new Audio(src);
        this.sounds.set(id, audio);
    }

    playSound(id, volume = 1) {
        if (!this.enabled) return;
        
        const sound = this.sounds.get(id);
        if (sound) {
            sound.volume = volume;
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Sound play failed:', e));
        }
    }

    toggle() {
        this.enabled = !this.enabled;
    }
}

// Utilitaires de timing
class Timer {
    constructor(duration, callback, repeat = false) {
        this.duration = duration;
        this.callback = callback;
        this.repeat = repeat;
        this.elapsed = 0;
        this.active = true;
    }

    update(deltaTime) {
        if (!this.active) return;

        this.elapsed += deltaTime;
        if (this.elapsed >= this.duration) {
            this.callback();
            if (this.repeat) {
                this.elapsed = 0;
            } else {
                this.active = false;
            }
        }
    }

    reset() {
        this.elapsed = 0;
        this.active = true;
    }

    stop() {
        this.active = false;
    }
}