# 🧪 GUIDE DE TEST - SYSTÈME DE COMBAT AVANCÉ

## ✅ **TESTS À EFFECTUER**

### 🛡️ **1. TEST PERFECT PARRY**
**Objectif** : Vérifier que le timing de parade fonctionne

**Procédure** :
1. **Joueur 1** : Se rapprocher du Joueur 2
2. **Joueur 2** : Commencer une attaque (L, Numpad1, ou Numpad2)
3. **Joueur 1** : Appuyer sur **S** au moment exact où l'attaque arrive
4. **Résultat attendu** : ✨ Particules dorées + "PERFECT PARRY!" + Joueur 2 stunné

---

### 💥 **2. TEST CONTRE-ATTAQUE**
**Objectif** : Vérifier le bonus de dégâts après Perfect Parry

**Procédure** :
1. Réussir un Perfect Parry (voir test 1)
2. **Immédiatement après** : Attaquer (I, J, K, ou Z)
3. **Résultat attendu** : "COUNTER!" + 50% de dégâts en plus

---

### 🚫 **3. TEST GUARD BREAK**
**Objectif** : Casser la garde de l'adversaire

**Procédure** :
1. **Joueur 1** : Maintenir S (garde)
2. **Joueur 2** : Attaquer 5 fois de suite contre la garde
3. **Résultat attendu** : 💔 "GUARD BREAK!" + Joueur 1 ne peut plus bloquer pendant 1 sec

---

### ✈️ **4. TEST ATTAQUE AÉRIENNE**
**Objectif** : Vérifier les attaques en l'air

**Procédure** :
1. **Joueur 1** : Sauter avec **,** (virgule)
2. **Pendant le saut** : Attaquer avec I, J, K, ou Z
3. **Résultat attendu** : "AIR ATTACK!" + adversaire projeté vers le bas + 20% dégâts bonus

---

### 💨 **5. TEST PERFECT DODGE**
**Objectif** : Esquive parfaite avec invincibilité

**Procédure** :
1. **Joueur 2** : Commencer une attaque
2. **Joueur 1** : Au bon moment, dash avec **Q** ou **E**
3. **Résultat attendu** : Passer à travers l'attaque + particules de poussière + aucun dégât

---

### 🏃 **6. TEST WALL BOUNCE**
**Objectif** : Rebond sur les bords de l'écran

**Procédure** :
1. Amener l'adversaire près du bord de l'écran
2. Faire une attaque puissante (uppercut ou double)
3. **Résultat attendu** : L'adversaire rebondit du mur vers le centre

---

## 🎨 **VÉRIFICATION DES PARTICULES**

### 💫 **Types de particules à observer** :
- 🔵 **Bleues** : Pendant les dash (traînée)
- 🟡 **Dorées** : Perfect Parry (étincelles)
- 🔴 **Rouges** : Impacts de coups (explosion)
- 🟤 **Marrons** : Poussière au sol (mouvements)

---

## 🎯 **CONTRÔLES RAPPEL**

### **JOUEUR 1** :
- **Mouvement** : A/D
- **Saut** : , (virgule)
- **Garde** : S
- **Dash** : Q/E
- **Attaques** : I/J/K/Z

### **JOUEUR 2** :
- **Mouvement** : ←/→
- **Saut** : ↑
- **Garde** : ↓
- **Dash** : 0/Entrée
- **Attaques** : L/Numpad1/Numpad2

---

## 🏆 **STATUTS À SURVEILLER**

### **Barres et Indicateurs** :
- **HP** : Diminue selon les dégâts
- **Stamina** : Se consume avec double saut/gatling
- **Messages** : Apparaissent à l'écran pour chaque action spéciale

### **États temporaires** :
- **Perfect Parry** : 150ms de fenêtre
- **Counter Window** : 1 seconde après Perfect Parry
- **Guard Break** : 1 seconde de vulnérabilité
- **Air Attack** : Reset au sol

---

## 🔧 **DÉPANNAGE**

Si une fonctionnalité ne marche pas :

1. **Perfect Parry** : Le timing est très précis (150ms)
2. **Counter** : Doit être fait IMMÉDIATEMENT après Perfect Parry
3. **Air Attack** : Fonctionne seulement quand on n'est pas au sol
4. **Perfect Dodge** : L'adversaire doit attaquer ET être proche (<80px)
5. **Guard Break** : Il faut 5 attaques consécutives bloquées

---

🎮 **Bon test ! Chaque mécanique apporte une nouvelle dimension stratégique au combat !**