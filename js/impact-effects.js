// Classe pour les effets visuels d'impact
class ImpactEffect {
    constructor(x, y, type, duration = 300) {
        this.x = x;
        this.y = y;
        this.type = type; // 'hit', 'critical', 'knockdown'
        this.duration = duration;
        this.timer = duration;
        this.size = 0;
        this.maxSize = type === 'knockdown' ? 80 : type === 'critical' ? 60 : 40;
        this.alpha = 1.0;
        this.particles = [];
        
        // Créer des particules pour l'effet
        const particleCount = type === 'knockdown' ? 12 : type === 'critical' ? 8 : 5;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: 0,
                y: 0,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200,
                life: 1.0,
                size: Math.random() * 6 + 2
            });
        }
    }
    
    update(deltaTime) {
        this.timer -= deltaTime * 1000;
        const progress = 1 - (this.timer / this.duration);
        
        // Animation de taille (expansion puis contraction)
        if (progress < 0.3) {
            this.size = (progress / 0.3) * this.maxSize;
        } else {
            this.size = this.maxSize * (1 - (progress - 0.3) / 0.7);
        }
        
        this.alpha = Math.max(0, 1 - progress);
        
        // Mettre à jour les particules
        this.particles.forEach(p => {
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.life -= deltaTime * 2; // Durée de vie des particules
        });
        
        return this.timer > 0;
    }
    
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        // Effet principal selon le type
        ctx.translate(this.x, this.y);
        
        if (this.type === 'knockdown') {
            // Effet rouge intense pour knockdown
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, 'rgba(255, 50, 50, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 100, 100, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 150, 150, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
            
            // Lignes d'impact
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 3;
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(angle) * this.size * 0.8, Math.sin(angle) * this.size * 0.8);
                ctx.stroke();
            }
        } else if (this.type === 'critical') {
            // Effet jaune pour coup critique
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, 'rgba(255, 255, 50, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 200, 100, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 150, 50, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
        } else {
            // Effet bleu pour coup normal
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, 'rgba(100, 150, 255, 0.6)');
            gradient.addColorStop(0.5, 'rgba(150, 200, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(200, 220, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
        }
        
        // Rendre les particules
        this.particles.forEach(p => {
            if (p.life > 0) {
                ctx.fillStyle = `rgba(255, 255, 255, ${p.life})`;
                ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
            }
        });
        
        ctx.restore();
    }
}

export { ImpactEffect };