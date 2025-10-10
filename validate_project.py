#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎬 Validation Finale - Jump Ultimate Stars avec Animations Multi-Frames
Script de vérification complète du projet
"""

import os
from pathlib import Path
import json

def validate_project():
    """Validation complète du projet"""
    
    print("🎮 VALIDATION FINALE - JUMP ULTIMATE STARS")
    print("=" * 60)
    
    # 1. Vérification des fichiers principaux
    print("\n📁 1. FICHIERS PRINCIPAUX:")
    main_files = [
        'animated.html',      # VERSION PRINCIPALE avec animations
        'sprites.html',       # Version sprites simples
        'index.html',        # Version originale
        'README.md',         # Documentation
        'ANIMATIONS.md',     # Doc animations
        '.github/copilot-instructions.md'  # Instructions Copilot
    ]
    
    for file in main_files:
        if Path(file).exists():
            print(f"   ✅ {file}")
        else:
            print(f"   ❌ {file} - MANQUANT")
    
    # 2. Vérification des scripts Python
    print("\n🐍 2. SCRIPTS PYTHON:")
    python_files = [
        'process_sprites.py',    # Traitement automatique
        'check_animations.py',   # Vérification animations
        __file__                 # Ce script
    ]
    
    for file in python_files:
        if Path(file).exists():
            print(f"   ✅ {file}")
        else:
            print(f"   ❌ {file} - MANQUANT")
    
    # 3. Vérification des animations ninja
    print("\n🥷 3. ANIMATIONS NINJA:")
    animations = {
        'idle': 4,
        'walk': 6,
        'jump': 4,
        'attack': 4,
        'hurt': 2
    }
    
    assets_dir = Path('./assets/characters')
    total_frames = 0
    found_frames = 0
    
    for anim, count in animations.items():
        print(f"   📋 {anim}:", end=" ")
        found = 0
        for i in range(1, count + 1):
            filename = f"ninja_{anim}{i}.png"
            if (assets_dir / filename).exists():
                found += 1
                found_frames += 1
            total_frames += 1
        
        if found == count:
            print(f"✅ {found}/{count}")
        else:
            print(f"❌ {found}/{count}")
    
    # 4. Vérification des autres assets
    print("\n🎨 4. AUTRES PERSONNAGES:")
    other_chars = ['warrior', 'robot', 'mage']
    other_anims = ['idle', 'walk', 'jump', 'attack', 'hurt', 'icon']
    
    for char in other_chars:
        print(f"   {char}:", end=" ")
        char_files = 0
        for anim in other_anims:
            filename = f"{char}_{anim}.png"
            if (assets_dir / filename).exists():
                char_files += 1
        print(f"{char_files}/{len(other_anims)} fichiers")
    
    # 5. Test de chargement HTML
    print("\n🌐 5. VALIDATION HTML:")
    html_files = ['animated.html', 'sprites.html', 'index.html']
    
    for html_file in html_files:
        if Path(html_file).exists():
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Vérifications basiques
            has_canvas = '<canvas' in content
            has_js = '<script' in content or '.js' in content
            has_css = '<style' in content or '.css' in content
            
            status = "✅" if all([has_canvas, has_js, has_css]) else "⚠️"
            print(f"   {status} {html_file} - Canvas:{has_canvas} JS:{has_js} CSS:{has_css}")
    
    # 6. Statistiques finales
    print("\n📊 6. STATISTIQUES:")
    print(f"   🥷 Frames ninja: {found_frames}/{total_frames} ({found_frames/total_frames*100:.1f}%)")
    print(f"   📁 Taille projet: {get_project_size()}")
    
    # 7. Instructions de lancement
    print("\n🚀 7. INSTRUCTIONS DE LANCEMENT:")
    print("   1️⃣ python -m http.server 8000")
    print("   2️⃣ Ouvrir: http://localhost:8000/animated.html")
    print("   3️⃣ Attendre le chargement des 20 sprites")
    print("   4️⃣ Cliquer 'COMMENCER LE COMBAT !'")
    
    # 8. Status global
    ninja_complete = found_frames == total_frames
    files_ok = all(Path(f).exists() for f in main_files[:3])
    
    print("\n" + "=" * 60)
    if ninja_complete and files_ok:
        print("🎉 PROJET VALIDÉ ! Animations multi-frames opérationnelles !")
        print("🎬 Les personnages sont maintenant VIVANTS !")
    else:
        print("⚠️ Validation incomplète - Vérifier les erreurs ci-dessus")
    
    print("\n🎮 Bon jeu avec Jump Ultimate Stars Multi-Frames !")
    return ninja_complete and files_ok

def get_project_size():
    """Calcule la taille approximative du projet"""
    total_size = 0
    extensions = ['.html', '.js', '.css', '.py', '.png', '.jpg', '.md']
    
    for ext in extensions:
        for file in Path('.').rglob(f'*{ext}'):
            if file.is_file():
                total_size += file.stat().st_size
    
    # Conversion en unités lisibles
    if total_size < 1024:
        return f"{total_size} B"
    elif total_size < 1024**2:
        return f"{total_size/1024:.1f} KB"
    else:
        return f"{total_size/(1024**2):.1f} MB"

if __name__ == "__main__":
    success = validate_project()
    
    print(f"\n🔍 Validation terminée : {'SUCCÈS' if success else 'ÉCHEC'}")
    exit(0 if success else 1)