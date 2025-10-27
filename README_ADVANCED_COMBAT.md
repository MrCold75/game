# 🥊 SYSTÈME DE COMBAT AVANCÉ - Fighting Game

## 🎯 NOUVELLES FONCTIONNALITÉS

### ⚔️ MÉCANIQUES DE COMBAT PROFESSIONNELLES

#### 🛡️ **PERFECT PARRY**
- **Activation** : Appuyer sur la touche de garde **au moment précis** d'une attaque ennemie
- **Timing** : Fenêtre de 150ms après le début de la garde
- **Effet** : 
  - ❌ Aucun dégât subi
  - ⚡ L'attaquant est stunné (30 frames)
  - 💥 Ouvre une fenêtre pour **contre-attaque**
  - ✨ Particules d'étincelles spectaculaires

#### 💥 **CONTRE-ATTAQUES**
- **Activation** : Attaquer immédiatement après un Perfect Parry réussi
- **Timing** : 60 frames (1 seconde) après le parry
- **Bonus** : 
  - 🚀 **+50% de dégâts**
  - 🎯 **+30% de knockback**
  - ⚡ Animation plus rapide
  - 🔥 Effet visuel "COUNTER!"

#### 🚫 **GARDE CASSÉE (Guard Break)**
- **Déclenchement** : Bloquer trop d'attaques consécutives (seuil : 5 attaques)
- **Effet** :
  - 😵 Joueur vulnérable pendant 1 seconde
  - 💔 Impossible de bloquer temporairement
  - 💥 Animation spéciale "Guard Break"
  - 🎯 L'attaquant peut enchaîner librement

#### ✈️ **ATTAQUES AÉRIENNES**
- **Activation** : Touche d'attaque pendant un saut/double saut
- **Spécificités** :
  - 🎯 **+20% de dégâts** par rapport aux attaques terrestres
  - 📏 **Portée étendue** (70 pixels vs 50)
  - 🔽 **Spike Effect** : Envoie l'adversaire vers le sol
  - 🔢 **Compteur de combo aérien**
  - 🚀 Permet des combos air-to-air

#### 💨 **PERFECT DODGE**
- **Activation** : Dash au moment précis d'une attaque (distance < 80 pixels)
- **Effet** :
  - 👻 **Invincibilité totale** pendant le dash
  - ❌ Aucun dégât subi
  - 💨 Particules de poussière
  - 🎯 Peut traverser l'adversaire

#### 🏃 **REBONDS SUR MURS (Wall Bounce)**
- **Déclenchement** : Knockback important près des bords de l'écran
- **Effet** :
  - 🏀 Rebond automatique vers le centre
  - 🔄 Inverse la vitesse horizontale avec réduction
  - 🎲 Ajoute une variation verticale aléatoire
  - 🎮 Permet des combos étendus

### 🎨 **SYSTÈME DE PARTICULES DYNAMIQUES**

#### 💫 **Types de Particules**
1. **Poussière (Dust)** : 
   - 🌪️ Mouvements au sol, dash, atterrissages
   - Couleur : Marron/Beige
   - Durée : 0.5-1 seconde

2. **Étincelles (Spark)** :
   - ⚡ Perfect parries, clash d'armes
   - Couleur : Jaune/Blanc brillant  
   - Durée : 0.3-0.5 seconde

3. **Impact** :
   - 💥 Coups qui touchent, garde cassée
   - Couleur : Rouge/Orange
   - Durée : 0.4-0.8 seconde

#### 🎭 **Génération Automatique**
- 🏃 **Dash** : Traînée de particules bleues
- 🛡️ **Perfect Parry** : Explosion d'étincelles
- 👊 **Coups réussis** : Particules d'impact colorées
- 🏃 **Perfect Dodge** : Nuage de poussière
- 📍 **Mouvements** : Poussière au sol

---

## 🎮 **CONTRÔLES**

### 👤 **JOUEUR 1**
| Touche | Action | Timing Spécial |
|--------|--------|---------------|
| **S** | Garde | Perfect Parry : 150ms après début garde |
| **Q/E** | Dash | Perfect Dodge : Si adversaire attaque à <80px |
| **I/J/K/Z** | Attaque | Contre : Après Perfect Parry (60 frames) |
| **I/J/K/Z** (Air) | Attaque Aérienne | Seulement en l'air |
| **,** (Virgule) | Saut/Double Saut | Coûte de l'endurance |

### 👤 **JOUEUR 2** 
| Touche | Action | Timing Spécial |
|--------|--------|---------------|
| **↓** | Garde | Perfect Parry : 150ms après début garde |
| **0/Entrée** | Dash | Perfect Dodge : Si adversaire attaque à <80px |
| **L/Numpad1/2** | Attaque | Contre : Après Perfect Parry (60 frames) |
| **L/Numpad1/2** (Air) | Attaque Aérienne | Seulement en l'air |
| **↑** | Saut/Double Saut | Coûte de l'endurance |

---

## 📊 **STATISTIQUES AVANCÉES**

### ⚡ **Système d'Endurance**
- **Max** : 100 points
- **Régénération** : 25 pts/sec (après 1 sec d'inactivité)
- **Coûts** :
  - Double saut : 30 pts
  - Gatling Attack : 8 pts/cycle
  - Perfect Dodge : Gratuit (récompense le skill)

### 🎯 **Bonus de Dégâts**
- **Counter Attack** : +50%
- **Air Attack** : +20% 
- **Guard Break Hit** : Dégâts normaux mais adversaire stunné

### ⏱️ **Timings Critiques**
- **Perfect Parry Window** : 150ms
- **Counter Opportunity** : 1000ms (60 frames)
- **Guard Break Stun** : 1000ms
- **Perfect Dodge Invincibility** : Durée du dash
- **Air Attack Cooldown** : Reset au sol

---

## 🏆 **STRATÉGIES AVANCÉES**

### 🛡️ **Défense**
1. **Timing de Parry** : Anticiper les attaques pour Perfect Parry
2. **Gestion de Garde** : Éviter de bloquer trop (Guard Break)
3. **Perfect Dodge** : Esquiver au lieu de bloquer pour conserver la garde

### ⚔️ **Attaque**
1. **Combo Air** : Saut → Attaque aérienne → Atterrissage → Combo au sol
2. **Counter Punish** : Perfect Parry → Contre-attaque immédiate
3. **Guard Pressure** : Attaquer continuellement pour casser la garde
4. **Wall Bounce** : Utiliser les bords pour prolonger les combos

### 🎮 **Avancé**
1. **Frame Trap** : Laisser des gaps dans les combos pour counter les parries
2. **Mix-up** : Alterner attaques hautes/basses/aériennes
3. **Spacing** : Utiliser la portée des attaques aériennes
4. **Resource Management** : Gérer l'endurance pour double sauts

---

## 🎨 **EFFETS VISUELS**

### 💥 **Feedback Visuel**
- **Perfect Parry** : ✨ Étincelles dorées + texte "PERFECT PARRY!"
- **Counter Attack** : 🔥 Aura rouge + texte "COUNTER!"  
- **Guard Break** : 💔 Explosion rouge + texte "GUARD BREAK!"
- **Air Attack** : ✈️ Traînée bleue + texte "AIR ATTACK!"
- **Perfect Dodge** : 💨 Nuage de poussière + invincibilité

### 🎬 **Screen Shake**
- **Perfect Parry** : Léger (intensité 4)
- **Counter Hit** : Moyen (intensité 6-8)  
- **Guard Break** : Fort (intensité 10)
- **Air Spike** : Variable selon hauteur

---

## 🔧 **TECHNIQUE**

Le système utilise des **timers en temps réel** pour une précision maximale :
- Perfect Parry : `perfectBlockTimer` (150ms)
- Counter Window : `counterOpportunity` (1000ms)  
- Guard Break : `guardBreakTimer` (1000ms)
- Air Attack : `airAttackTimer` (500ms)
- Invincibility : `perfectDodgeInvincible` (durée dash)

Les **particules** sont gérées par joueur avec mise à jour automatique de position, vitesse et durée de vie.

---

🎉 **Votre jeu de combat dispose maintenant d'un système professionnel digne des meilleurs fighting games !**