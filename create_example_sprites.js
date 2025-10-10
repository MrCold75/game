// Script pour créer des sprites d'exemple
function createExampleSprites() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 64;
    canvas.height = 64;
    
    const characters = {
        ninja: { primary: '#2c3e50', secondary: '#34495e' },
        warrior: { primary: '#e74c3c', secondary: '#c0392b' },
        mage: { primary: '#9b59b6', secondary: '#8e44ad' },
        robot: { primary: '#34495e', secondary: '#2c3e50' }
    };
    
    const animations = ['idle', 'walk', 'jump', 'attack', 'hurt'];
    
    Object.entries(characters).forEach(([type, colors]) => {
        animations.forEach(animation => {
            // Nettoyer le canvas
            ctx.clearRect(0, 0, 64, 64);
            
            // Dessiner le personnage
            ctx.fillStyle = colors.primary;
            ctx.fillRect(16, 8, 32, 48);
            
            // Variations selon l'animation
            switch(animation) {
                case 'walk':
                    ctx.fillStyle = colors.secondary;
                    ctx.fillRect(20, 50, 8, 10); // Jambe gauche
                    ctx.fillRect(36, 50, 8, 10); // Jambe droite
                    break;
                case 'jump':
                    ctx.fillStyle = colors.secondary;
                    ctx.fillRect(18, 50, 6, 8); // Jambes pliées
                    ctx.fillRect(40, 50, 6, 8);
                    break;
                case 'attack':
                    ctx.fillStyle = '#ff6b6b';
                    ctx.fillRect(50, 20, 12, 4); // Épée/arme
                    break;
                case 'hurt':
                    ctx.fillStyle = '#ff6b6b';
                    ctx.fillRect(12, 4, 40, 4); // Effet de douleur
                    break;
            }
            
            // Télécharger l'image
            const link = document.createElement('a');
            link.download = `${type}_${animation}.png`;
            link.href = canvas.toDataURL();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });
}

// Pour créer les sprites d'exemple, décommentez cette ligne dans la console :
// createExampleSprites();