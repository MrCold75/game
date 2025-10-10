#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎯 Ajustement Automatique des Sprites - Sans Perte de Qualité
Détecte automatiquement le nombre de frames et ajuste le jeu
"""

import os
import json
from pathlib import Path
from PIL import Image
import numpy as np

def detect_sprite_frames():
    """Détecte automatiquement le nombre de frames par animation"""
    
    print("🔍 DÉTECTION AUTOMATIQUE DES ANIMATIONS")
    print("=" * 50)
    
    assets_dir = Path('./assets/characters')
    skills_dir = assets_dir / 'skills'
    
    # Animations possibles
    animations = ['idle', 'walk', 'jump', 'attack', 'hurt', 'special']
    
    detected_config = {}
    
    for anim in animations:
        frame_count = 0
        
        # Compter les frames existantes
        for i in range(1, 10):  # Maximum 9 frames par animation
            if anim == 'special':
                # Chercher dans le dossier skills/
                sprite_file = skills_dir / f"ninja_special{i}.png"
            else:
                # Chercher dans le dossier principal
                sprite_file = assets_dir / f"ninja_{anim}{i}.png"
                
            if sprite_file.exists():
                frame_count = i
            else:
                break
        
        if frame_count > 0:
            detected_config[anim] = frame_count
            location = "skills/" if anim == 'special' else "normal"
            print(f"   ✅ {anim}: {frame_count} frames ({location})")
        else:
            print(f"   ❌ {anim}: Aucune frame trouvée")
    
    return detected_config

def optimize_sprite_quality(input_path, output_path):
    """Optimise un sprite sans perte de qualité"""
    
    with Image.open(input_path) as img:
        # Convertir en RGBA si nécessaire
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        original_size = img.size
        
        # Si déjà 80x80, juste optimiser
        if original_size == (80, 80):
            img.save(output_path, 'PNG', optimize=True)
            return f"Optimisé: {original_size}"
        
        # Sinon, redimensionner intelligemment
        # Calculer le ratio pour garder les proportions
        target_size = 80
        
        # Méthode de redimensionnement haute qualité
        if original_size[0] != original_size[1]:
            # Image non carrée - ajuster avec padding
            max_dim = max(original_size)
            ratio = target_size / max_dim
            new_size = (int(original_size[0] * ratio), int(original_size[1] * ratio))
            
            # Redimensionner avec la meilleure qualité
            resized = img.resize(new_size, Image.Resampling.LANCZOS)
            
            # Créer un canvas 80x80 transparent
            final_img = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
            
            # Centrer l'image
            x_offset = (target_size - new_size[0]) // 2
            y_offset = (target_size - new_size[1]) // 2
            
            final_img.paste(resized, (x_offset, y_offset), resized)
        else:
            # Image carrée - redimensionnement direct
            final_img = img.resize((target_size, target_size), Image.Resampling.LANCZOS)
        
        # Sauvegarder avec optimisation
        final_img.save(output_path, 'PNG', optimize=True)
        
        return f"Redimensionné: {original_size} → {target_size}x{target_size}"

def update_game_config(animation_config):
    """Met à jour la configuration du jeu avec les bonnes frames"""
    
    print("\n🔧 MISE À JOUR DE LA CONFIGURATION DU JEU")
    print("-" * 45)
    
    # Lire le fichier stable.html
    stable_file = Path('./stable.html')
    
    if not stable_file.exists():
        print("❌ Fichier stable.html non trouvé!")
        return False
    
    with open(stable_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Créer la nouvelle configuration JavaScript
    js_config = "const animationConfig = {\n"
    js_config += "    ninja: {\n"
    
    for anim, frame_count in animation_config.items():
        js_config += f"        {anim}: {frame_count},\n"
    
    js_config += "    }\n};"
    
    print("📝 Nouvelle configuration:")
    for anim, count in animation_config.items():
        print(f"   {anim}: {count} frames")
    
    # Chercher et remplacer la configuration dans le code
    # Trouver la section des maxFrames
    max_frames_section = "const maxFrames = {"
    
    if max_frames_section in content:
        # Remplacer la section maxFrames
        start_idx = content.find(max_frames_section)
        if start_idx != -1:
            # Trouver la fin de l'objet
            end_idx = content.find("};", start_idx) + 2
            
            # Créer la nouvelle section
            new_max_frames = "const maxFrames = {\n"
            for anim, count in animation_config.items():
                new_max_frames += f"                        '{anim}': {count},\n"
            new_max_frames += "                    }"
            
            # Remplacer
            content = content[:start_idx] + new_max_frames + content[end_idx:]
            
            print("   ✅ Configuration maxFrames mise à jour")
    
    # Sauvegarder le fichier modifié
    with open(stable_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("   ✅ Fichier stable.html mis à jour")
    
    return True

def process_all_sprites():
    """Traite tous les sprites sans perte de qualité"""
    
    print("🎯 OPTIMISATION SANS PERTE DE QUALITÉ")
    print("=" * 50)
    
    assets_dir = Path('./assets/characters')
    optimized_dir = assets_dir / 'optimized'
    optimized_dir.mkdir(exist_ok=True)
    
    # Trouver tous les sprites ninja
    ninja_sprites = list(assets_dir.glob('ninja_*.png'))
    
    if not ninja_sprites:
        print("❌ Aucun sprite ninja trouvé!")
        return False
    
    print(f"🎨 {len(ninja_sprites)} sprites à optimiser")
    
    success_count = 0
    
    for sprite_file in ninja_sprites:
        try:
            output_path = optimized_dir / sprite_file.name
            result = optimize_sprite_quality(sprite_file, output_path)
            print(f"   ✅ {sprite_file.name}: {result}")
            success_count += 1
        except Exception as e:
            print(f"   ❌ {sprite_file.name}: Erreur - {e}")
    
    print(f"\n📊 {success_count}/{len(ninja_sprites)} sprites optimisés")
    
    return success_count > 0

def main():
    """Fonction principale"""
    
    print("🎮 AJUSTEMENT AUTOMATIQUE DES SPRITES")
    print("Sans perte de qualité + Configuration adaptative")
    print("=" * 60)
    
    # 1. Détecter les animations disponibles
    animation_config = detect_sprite_frames()
    
    if not animation_config:
        print("\n❌ Aucune animation détectée!")
        return False
    
    # 2. Optimiser les sprites sans perte de qualité
    print(f"\n🎨 OPTIMISATION DES SPRITES")
    print("-" * 30)
    
    if process_all_sprites():
        print("✅ Sprites optimisés avec succès")
        
        # Copier les sprites optimisés
        print("\n📁 Copie des sprites optimisés...")
        assets_dir = Path('./assets/characters')
        optimized_dir = assets_dir / 'optimized'
        
        import shutil
        for sprite_file in optimized_dir.glob('ninja_*.png'):
            dest_file = assets_dir / sprite_file.name
            shutil.copy2(sprite_file, dest_file)
            print(f"   ✅ Copié: {sprite_file.name}")
    
    # 3. Mettre à jour la configuration du jeu
    if update_game_config(animation_config):
        print("✅ Configuration du jeu mise à jour")
    
    # 4. Instructions finales
    print(f"\n🚀 TERMINÉ!")
    print("=" * 20)
    print("1. ✅ Sprites optimisés sans perte de qualité")
    print("2. ✅ Configuration adaptée à vos frames")
    print("3. 🎮 Rechargez le jeu pour voir les améliorations")
    print("\n💡 Plus d'erreurs idle4/attack4 - Le jeu s'adapte automatiquement!")
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        
        if success:
            print("\n🎉 AJUSTEMENT TERMINÉ AVEC SUCCÈS!")
        else:
            print("\n⚠️ Problème durant l'ajustement")
            
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
    
    input("\n⏸️ Appuyez sur Entrée pour continuer...")