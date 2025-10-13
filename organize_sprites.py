#!/usr/bin/env python3
"""
Script pour réorganiser automatiquement les sprites par personnage et catégorie
"""

import os
import shutil
from pathlib import Path

def organize_sprites():
    base_path = Path("assets/characters")
    
    # Définition de l'organisation des sprites
    sprite_organization = {
        "ninja": {
            "basic": ["idle", "walk", "jump", "icon"],
            "combat": ["attack", "hurt"],
            "special": ["uppercut", "low", "double", "down"]
        },
        "mage": {
            "basic": ["idle", "walk", "jump", "icon"],
            "combat": ["attack", "hurt"]
        },
        "warrior": {
            "basic": ["idle", "walk", "jump", "icon"],
            "combat": ["attack", "hurt"]
        },
        "robot": {
            "basic": ["idle", "walk", "jump", "icon"],
            "combat": ["attack", "hurt"]
        }
    }
    
    print("🗂️  Organisation des sprites par personnage...")
    
    # Parcourir tous les fichiers dans le dossier characters
    for file_path in base_path.glob("*.png"):
        filename = file_path.name
        
        # Identifier le personnage
        character = None
        for char_name in sprite_organization.keys():
            if filename.startswith(char_name + "_"):
                character = char_name
                break
        
        if not character:
            print(f"⚠️  Sprite non reconnu : {filename}")
            continue
            
        # Identifier la catégorie
        sprite_type = filename.replace(f"{character}_", "").split("1")[0].split("2")[0].split("3")[0].split(".")[0]
        
        category = None
        for cat_name, sprite_types in sprite_organization[character].items():
            if sprite_type in sprite_types:
                category = cat_name
                break
        
        if not category:
            print(f"⚠️  Catégorie non trouvée pour : {filename} (type: {sprite_type})")
            continue
        
        # Créer le dossier de destination
        dest_dir = base_path / character / category
        dest_dir.mkdir(parents=True, exist_ok=True)
        
        # Déplacer le fichier
        dest_path = dest_dir / filename
        try:
            shutil.move(str(file_path), str(dest_path))
            print(f"✅ {filename} → {character}/{category}/")
        except Exception as e:
            print(f"❌ Erreur pour {filename}: {e}")
    
    print("\n📁 Structure finale :")
    for character in sprite_organization.keys():
        char_path = base_path / character
        if char_path.exists():
            print(f"\n{character.upper()}:")
            for category in ["basic", "combat", "special"]:
                cat_path = char_path / category
                if cat_path.exists():
                    sprites = list(cat_path.glob("*.png"))
                    if sprites:
                        print(f"  📂 {category}: {len(sprites)} sprites")
                        for sprite in sorted(sprites):
                            print(f"    - {sprite.name}")

if __name__ == "__main__":
    organize_sprites()