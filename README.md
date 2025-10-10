# 🥊 Jump Ultimate Stars - Fighting Game avec Animations Multi-Frames

Un jeu de combat 2D inspiré de Jump Ultimate Stars, développé en HTML5 Canvas et JavaScript, avec un système d'animations multi-frames révolutionnaire.

## 🎬 Nouveauté : Animations Multi-Frames !

### ✨ Système d'Animation Révolutionnaire
- **20 sprites ninja** avec animations fluides
- **5 types d'animations** : idle, walk, jump, attack, hurt
- **Traitement automatique** des sprites avec suppression de background
- **Transitions naturelles** entre les états d'animation

## 🎮 Aperçu du Jeu

Jump Ultimate Stars est un jeu de combat 2D en temps réel où deux joueurs s'affrontent avec des personnages entièrement animés. Chaque mouvement est maintenant fluide grâce aux animations multi-frames !

## ✨ Fonctionnalités

- **Personnages Animés** :
  - 🥷 **Ninja** : 20 sprites d'animation (idle-4, walk-6, jump-4, attack-4, hurt-2)
  - ⚔️ **Guerrier** : En cours de conversion vers multi-frames
  - 🔮 **Mage** : Attaques à distance magiques
  - 🤖 **Robot** : Équilibré avec bouclier électrique

- **Mécaniques de Combat Animées** :
  - Système de vie et de défense avec feedback visuel
  - Attaques normales et spéciales synchronisées aux animations
  - Double saut et physics réalistes avec animations fluides
  - Système d'invulnérabilité après dégâts

- **Fonctionnalités Avancées** :
  - Support manettes de jeu
  - Système de particules et effets visuels
  - Interface utilisateur réactive
  - Mode plein écran
  - Système de pause

## 🎯 Comment Jouer

### Contrôles

**Joueur 1 (Clavier)** :
- Déplacement : `W` `A` `S` `D`
- Attaque : `F`
- Défense : `G`
- Mouvement Spécial : `R`

**Joueur 2 (Clavier)** :
- Déplacement : Flèches directionnelles
- Attaque : `Numpad 1`
- Défense : `Numpad 2`
- Mouvement Spécial : `Numpad 3`

**Contrôles Généraux** :
- Pause : `Échap`
- Redémarrer le round : `R`
- Plein écran : `F11`

### Objectif

- Réduisez la santé de votre adversaire à zéro pour remporter un round
- Premier à 3 rounds gagne la partie
- Utilisez les plateformes à votre avantage
- Maîtrisez les capacités spéciales de votre personnage

## 🚀 Installation et Lancement

1. **Cloner ou télécharger** ce projet
2. **Ouvrir** le fichier `index.html` dans un navigateur web moderne
3. **Jouer** ! Aucune installation supplémentaire requise

### Navigateurs Supportés

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🛠️ Structure du Projet

```
jump-ultimate-stars/
├── index.html              # Page principale
├── css/
│   └── style.css           # Styles et animations
├── js/
│   ├── main.js             # Point d'entrée principal
│   ├── game.js             # Moteur de jeu principal
│   ├── characters.js       # Système de personnages
│   ├── physics.js          # Moteur physique
│   ├── input.js            # Gestion des entrées
│   └── utils.js            # Fonctions utilitaires
└── README.md               # Documentation
```

## 🎨 Personnages en Détail

### 🥷 Ninja
- **Vitesse** : Très élevée
- **Santé** : Faible
- **Spécial** : Dash avec invulnérabilité temporaire
- **Style** : Frappe et fuite

### ⚔️ Guerrier
- **Vitesse** : Faible
- **Santé** : Très élevée
- **Spécial** : Charge destructrice
- **Style** : Combat rapproché brutal

### 🔮 Mage
- **Vitesse** : Moyenne
- **Santé** : Faible
- **Spécial** : Projectiles magiques
- **Style** : Combat à distance

### 🤖 Robot
- **Vitesse** : Moyenne
- **Santé** : Élevée
- **Spécial** : Bouclier électrique
- **Style** : Équilibré et polyvalent

## 🔧 Développement

### Technologies Utilisées

- **HTML5 Canvas** : Rendu graphique
- **JavaScript ES6+** : Logique de jeu
- **CSS3** : Interface utilisateur
- **Gamepad API** : Support manettes

### Architecture

Le jeu utilise une architecture orientée objet avec les systèmes suivants :

- **Game** : Boucle principale et gestion des états
- **Character** : Entités joueurs avec physique
- **PhysicsWorld** : Moteur physique et collisions
- **InputManager** : Gestion clavier/manette
- **ParticleSystem** : Effets visuels
- **UIManager** : Interface utilisateur

### Ajout de Nouveaux Personnages

Pour ajouter un nouveau personnage :

1. Ajouter le type dans `characters.js` dans `applyTypeStats()`
2. Définir les couleurs dans `setColors()`
3. Implémenter le rendu dans `drawCharacterDetails()`
4. Ajouter la capacité spéciale dans `game.js`

## 🐛 Débogage

Ouvrez la console développeur et utilisez :

```javascript
// Informations sur l'état du jeu
gameDebug.getGameInfo()

// Activer/désactiver le mode debug
gameDebug.toggleDebug()

// Accès direct au jeu
gameDebug.game()
```

## 📱 Support Mobile

Le jeu est principalement conçu pour desktop avec clavier/manette. Le support tactile est limité mais le jeu s'adapte aux écrans plus petits.

## 🤝 Contribution

Les contributions sont les bienvenues ! Zones d'amélioration :

- Nouveaux personnages et capacités
- Modes de jeu supplémentaires
- Amélioration du support mobile
- Système de son
- IA pour mode solo
- Multijoueur en ligne

## 📄 Licence

Ce projet est libre d'utilisation pour des fins éducatives et de démonstration.

## 🎯 Roadmap

- [ ] Système de son et musique
- [ ] Mode histoire/campagne
- [ ] IA pour mode solo
- [ ] Personnages supplémentaires
- [ ] Arènes personnalisables
- [ ] Sauvegarde des scores
- [ ] Replay des parties
- [ ] Mode tournoi

---

**Amusez-vous bien ! 🎮**