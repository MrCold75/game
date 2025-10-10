#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de vérification des animations multi-frames
"""

import os
from pathlib import Path

def check_animations():
    """Vérifie que toutes les animations sont présentes"""
    
    assets_dir = Path('./assets/characters')
    
    # Configuration des animations attendues
    expected_animations = {
        'ninja': {
            'idle': 4,   # 4 frames
            'walk': 6,   # 6 frames
            'jump': 4,   # 4 frames
            'attack': 4, # 4 frames
            'hurt': 2    # 2 frames
        }
    }
    
    print("🎬 Vérification des animations multi-frames...")
    print("=" * 50)
    
    total_expected = 0
    total_found = 0
    missing_files = []
    
    for character, animations in expected_animations.items():
        print(f"\n🥷 {character.upper()}:")
        
        for anim_name, frame_count in animations.items():
            print(f"  📋 {anim_name}: ", end="")
            
            frames_found = 0
            for i in range(1, frame_count + 1):
                filename = f"{character}_{anim_name}{i}.png"
                filepath = assets_dir / filename
                
                total_expected += 1
                
                if filepath.exists():
                    frames_found += 1
                    total_found += 1
                else:
                    missing_files.append(str(filepath))
            
            if frames_found == frame_count:
                print(f"✅ {frames_found}/{frame_count} frames")
            else:
                print(f"❌ {frames_found}/{frame_count} frames")
    
    print("\n" + "=" * 50)
    print(f"📊 RÉSUMÉ:")
    print(f"   Fichiers attendus: {total_expected}")
    print(f"   Fichiers trouvés: {total_found}")
    print(f"   Taux de réussite: {(total_found/total_expected*100):.1f}%")
    
    if missing_files:
        print(f"\n❌ Fichiers manquants ({len(missing_files)}):")
        for file in missing_files:
            print(f"   - {file}")
    else:
        print(f"\n🎉 Toutes les animations sont présentes !")
    
    # Vérifier les tailles d'images
    print(f"\n🔍 Vérification des tailles...")
    try:
        from PIL import Image
        
        size_issues = []
        for png_file in assets_dir.glob("ninja_*.png"):
            if png_file.name.startswith('ninja_'):
                try:
                    with Image.open(png_file) as img:
                        if img.size != (80, 80):
                            size_issues.append(f"{png_file.name}: {img.size}")
                except Exception as e:
                    size_issues.append(f"{png_file.name}: Error - {e}")
        
        if size_issues:
            print(f"⚠️ Problèmes de taille détectés:")
            for issue in size_issues:
                print(f"   - {issue}")
        else:
            print(f"✅ Toutes les images sont à la bonne taille (80x80)")
            
    except ImportError:
        print(f"⚠️ PIL non disponible pour vérifier les tailles")
    
    print("\n🎮 Prêt pour les animations multi-frames !")
    return total_found == total_expected

if __name__ == "__main__":
    success = check_animations()
    exit(0 if success else 1)