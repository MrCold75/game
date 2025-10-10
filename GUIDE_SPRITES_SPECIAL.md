# 🥋 Guide : Ajouter des Sprites pour Techniques Spéciales

## 📁 Organisation des Fichiers

### 1. **Dossier de destination**
```
assets/characters/
```

### 2. **Nomenclature des sprites spéciaux**
```
ninja_special1.png  // 🔥 Frame 1 : Début de charge
ninja_special2.png  // ⚡ Frame 2 : Charge intermédiaire  
ninja_special3.png  // 💫 Frame 3 : Pic de charge
ninja_special4.png  // 🚀 Frame 4 : Lancement du Hadoken
ninja_special5.png  // 🌟 Frame 5 : Récupération (optionnel)
```

## 🎨 Processus d'Ajout

### Étape 1 : Ajouter vos sprites
1. Placez vos fichiers `ninja_special1.png`, `ninja_special2.png`, etc. dans `assets/characters/`
2. **Taille recommandée** : 80x80 pixels (sera auto-ajustée)
3. **Format** : PNG avec transparence

### Étape 2 : Auto-configuration
```powershell
cd "C:\Users\Kraken\Documents\Play"
python auto_adjust_sprites.py
```

Le script va :
- ✅ Détecter automatiquement vos frames spéciales
- ✅ Les optimiser sans perte de qualité
- ✅ Mettre à jour la configuration du jeu
- ✅ Ajouter l'animation "special" au système

### Étape 3 : Intégration automatique
Le jeu détectera automatiquement :
- Nombre de frames disponibles
- Animation fluide pendant les techniques spéciales
- Synchronisation avec les effets Hadoken

## 🎮 Résultat Attendu

Une fois vos sprites ajoutés :
- **Pendant Shift+G/L** : Animation spéciale au lieu de l'animation d'attaque
- **Charge visuelle** : Vos sprites custom pendant la préparation
- **Effet Hadoken** : Synchronisé avec votre dernière frame

## 🛠️ Dépannage

### Si l'animation ne s'affiche pas :
1. Vérifiez que vos fichiers sont bien nommés `ninja_special1.png`, `ninja_special2.png`, etc.
2. Relancez `python auto_adjust_sprites.py`
3. Rechargez le jeu dans le navigateur

### Si les sprites sont déformés :
- Le script optimise automatiquement en 80x80px
- Vos proportions originales sont préservées
- Background transparent recommandé

## 💡 Conseils Créatifs

### Timing recommandé pour 4 frames :
- **Frame 1** (0.2s) : Position de départ, concentration
- **Frame 2** (0.3s) : Énergie qui s'accumule, pose intermédiaire
- **Frame 3** (0.4s) : Pic de charge, effet maximum
- **Frame 4** (0.2s) : Lancement, bras tendu vers l'avant

### Effets visuels suggérés :
- Aura qui s'intensifie frame par frame
- Particules d'énergie qui s'accumulent
- Pose de plus en plus dynamique
- Couleurs qui évoluent (bleu → cyan → blanc)

## 🎯 État Actuel

**Sans sprites spéciaux** : Utilise l'animation d'attaque normale
**Avec sprites spéciaux** : Animation dédiée synchronisée avec les effets

---
*Le système s'adapte automatiquement - ajoutez vos sprites quand vous êtes prêt !* ⚡