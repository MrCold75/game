# 🎨 Guide des Sprites - Jump Ultimate Stars (Spritesheets)

## 📁 Structure Simplifiée

Avec les spritesheets, vous n'avez besoin que de **6 fichiers par personnage** :

```
assets/
└── characters/
    ├── ninja_spritesheet.png    (5 animations en 1 fichier)
    ├── ninja_icon.png          (icône de sélection)
    ├── warrior_spritesheet.png
    ├── warrior_icon.png
    ├── mage_spritesheet.png
    ├── mage_icon.png
    ├── robot_spritesheet.png
    └── robot_icon.png
```

## 🖼️ Format des Spritesheets

### Structure d'une Spritesheet
```
[idle] [walk] [jump] [attack] [hurt]
```
Une seule image horizontale contenant les 5 animations côte à côte.

### Spécifications
- **Largeur totale** : 320 pixels (64px × 5 animations)
- **Hauteur** : 64 pixels  
- **Format** : PNG avec transparence
- **Ordre obligatoire** : idle, walk, jump, attack, hurt

### Exemple de Dimensions
```
ninja_spritesheet.png : 320×64px
├─ Frame 1 (0-63px)   : idle
├─ Frame 2 (64-127px) : walk  
├─ Frame 3 (128-191px): jump
├─ Frame 4 (192-255px): attack
└─ Frame 5 (256-319px): hurt
```

## 🎮 Fichiers Nécessaires

Pour chaque personnage, créez :

1. **`[nom]_spritesheet.png`** - Toutes les animations
2. **`[nom]_icon.png`** - Icône pour la sélection (80×80px)

### Liste complète :
- `ninja_spritesheet.png` + `ninja_icon.png`
- `warrior_spritesheet.png` + `warrior_icon.png`  
- `mage_spritesheet.png` + `mage_icon.png`
- `robot_spritesheet.png` + `robot_icon.png`

## ✅ Avantages des Spritesheets

- ✅ **Moins de fichiers** (6 au lieu de 24)
- ✅ **Chargement plus rapide**
- ✅ **Plus facile à organiser**
- ✅ **Standard de l'industrie**

## 🛠️ Outils pour Créer des Spritesheets

### Automatiques
- **TexturePacker** : Assemble automatiquement
- **Shoebox** : Gratuit, simple
- **Aseprite** : Export direct en spritesheet

### Manuel
- **Photoshop/GIMP** : Créer une image 320×64px et coller les frames
- **Paint.NET** : Plus simple pour débuter

## 💡 Conseil pour Commencer

**Version simple pour tester :**
1. Créez d'abord juste les **icônes** (80×80px)
2. Pour les spritesheets, utilisez **la même image répétée 5 fois** 
3. Le jeu fonctionnera et vous pourrez améliorer progressivement

**Exemple rapide :**
```
[ninja][ninja][ninja][ninja][ninja] = ninja_spritesheet.png
```
Même image 5 fois = test fonctionnel immédiat !

Prenez votre temps pour préparer vos sprites. Le code est prêt ! 🚀

## 🎮 Comment Ajouter Vos Sprites

### Étape 1 : Préparer vos images
1. Créez ou obtenez vos sprites aux bonnes dimensions
2. Nommez-les selon la convention : `[type]_[animation].png`
3. Assurez-vous qu'elles ont un fond transparent

### Étape 2 : Placer les fichiers
1. Copiez vos images dans les dossiers appropriés :
   - `assets/characters/` pour les personnages
   - `assets/effects/` pour les effets

### Étape 3 : Tester
1. Relancez le jeu
2. Les sprites seront automatiquement chargés
3. Si une image n'est pas trouvée, un placeholder coloré sera affiché

## 🔧 Personnalisation Avancée

### Ajouter un Nouveau Personnage

1. **Créer les sprites** pour le nouveau personnage
2. **Modifier `characters.js`** :
   ```javascript
   // Dans applyTypeStats()
   case 'mon_personnage':
       this.speed = 250;
       this.jumpPower = 400;
       this.attackDamage = 18;
       // etc...
       break;
   ```

3. **Ajouter dans l'HTML** :
   ```html
   <div class="character-card" data-character="mon_personnage">
       <div class="character-preview mon_personnage"></div>
       <h3>Mon Personnage</h3>
       <p>Description</p>
   </div>
   ```

4. **Ajouter le CSS** :
   ```css
   .character-preview.mon_personnage {
       background: linear-gradient(45deg, #couleur1, #couleur2);
   }
   ```

### Modifier les Animations

Pour changer la vitesse d'animation, modifiez dans `assets.js` :

```javascript
// Dans SpriteRenderer constructor
this.frameRate = 0.15; // Plus lent
this.frameRate = 0.05; // Plus rapide
```

### Utiliser des Spritesheets

Si vous avez des spritesheets (plusieurs frames dans une image), modifiez la méthode `draw()` dans `SpriteRenderer` :

```javascript
// Exemple pour une spritesheet 4x1
const frameWidth = image.width / 4;
const frameHeight = image.height;
const sourceX = this.frameIndex * frameWidth;

ctx.drawImage(image, 
    sourceX, 0, frameWidth, frameHeight,  // Source
    x, y, width, height                    // Destination
);
```

## 🎨 Outils Recommandés

### Création de Sprites
- **Aseprite** : Parfait pour le pixel art
- **Piskel** : Éditeur en ligne gratuit
- **GIMP** : Gratuit et puissant
- **Photoshop** : Pour les sprites plus complexes

### Ressources Gratuites
- **OpenGameArt.org** : Sprites libres
- **itch.io** : Assets gratuits et payants
- **Kenney.nl** : Pack d'assets gratuits

## 🐛 Dépannage

### Les sprites ne s'affichent pas
1. Vérifiez les noms de fichiers (respectez la casse)
2. Vérifiez que les images sont dans les bons dossiers
3. Ouvrez la console (F12) pour voir les erreurs de chargement

### Les animations sont trop rapides/lentes
Modifiez `frameRate` dans `SpriteRenderer`

### Les sprites sont flous
Assurez-vous que `imageSmoothingEnabled` est sur `false` dans le code

## 💡 Exemples de Sprites

Vous pouvez commencer avec des sprites simples :
- Cercles colorés pour tester
- Sprites de 32x32 ou 64x64 pixels
- Animations à 2-4 frames maximum

Le jeu fonctionnera avec des placeholders colorés si les images ne sont pas trouvées, vous pouvez donc tester progressivement !