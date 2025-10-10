#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🧹 Nettoyage Avancé des Sprites - Suppression des contours blancs
Script pour nettoyer complètement les sprites et supprimer tous les artefacts
"""

import os
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

def analyze_sprite_edges(image_path):
    """Analyse les bords du sprite pour détecter les artefacts"""
    
    with Image.open(image_path).convert("RGBA") as img:
        data = np.array(img)
        
        print(f"\n🔍 Analyse de {Path(image_path).name}:")
        print(f"   Taille: {img.size}")
        
        # Analyser les coins
        corners = {
            'top-left': data[0, 0],
            'top-right': data[0, -1],
            'bottom-left': data[-1, 0],
            'bottom-right': data[-1, -1]
        }
        
        for corner, color in corners.items():
            r, g, b, a = color
            print(f"   {corner}: RGBA({r}, {g}, {b}, {a})")
        
        # Détecter les pixels blancs/gris clairs
        white_pixels = np.sum((data[:,:,0] > 240) & (data[:,:,1] > 240) & (data[:,:,2] > 240) & (data[:,:,3] > 0))
        total_pixels = data.shape[0] * data.shape[1]
        
        print(f"   Pixels blancs: {white_pixels}/{total_pixels} ({white_pixels/total_pixels*100:.1f}%)")
        
        return corners, white_pixels

def clean_sprite_advanced(input_path, output_path):
    """Nettoyage avancé d'un sprite"""
    
    with Image.open(input_path).convert("RGBA") as img:
        data = np.array(img)
        
        print(f"\n🧹 Nettoyage de {Path(input_path).name}...")
        
        # 1. Détecter la couleur de fond dominante dans les coins
        corners = [
            data[0, 0],      # top-left
            data[0, -1],     # top-right  
            data[-1, 0],     # bottom-left
            data[-1, -1]     # bottom-right
        ]
        
        # Couleurs à supprimer (fond + blanc/gris clair)
        colors_to_remove = []
        
        # Ajouter les couleurs des coins si elles sont uniformes
        for corner in corners:
            r, g, b, a = corner
            if a > 0:  # Si pas déjà transparent
                colors_to_remove.append((r, g, b))
        
        # Ajouter toutes les nuances de blanc/gris clair
        for threshold in [255, 250, 245, 240, 235, 230, 220, 210]:
            colors_to_remove.append((threshold, threshold, threshold))
        
        print(f"   Couleurs à supprimer: {len(colors_to_remove)}")
        
        # 2. Supprimer les couleurs de fond avec tolérance
        tolerance = 20
        
        for r_target, g_target, b_target in colors_to_remove:
            # Créer un masque pour les pixels similaires
            mask = (
                (np.abs(data[:,:,0].astype(int) - r_target) <= tolerance) &
                (np.abs(data[:,:,1].astype(int) - g_target) <= tolerance) &
                (np.abs(data[:,:,2].astype(int) - b_target) <= tolerance)
            )
            
            # Rendre ces pixels transparents
            data[mask, 3] = 0
        
        # 3. Nettoyage des contours (anti-aliasing indésirable)
        # Supprimer les pixels semi-transparents aux bords
        edge_mask = (data[:,:,3] > 0) & (data[:,:,3] < 128)  # Pixels semi-transparents
        
        # Vérifier si ces pixels sont aux bords ou isolés
        for y in range(data.shape[0]):
            for x in range(data.shape[1]):
                if edge_mask[y, x]:
                    # Compter les voisins opaques
                    neighbors_opaque = 0
                    for dy in [-1, 0, 1]:
                        for dx in [-1, 0, 1]:
                            ny, nx = y + dy, x + dx
                            if 0 <= ny < data.shape[0] and 0 <= nx < data.shape[1]:
                                if data[ny, nx, 3] > 200:  # Voisin opaque
                                    neighbors_opaque += 1
                    
                    # Si moins de 3 voisins opaques, supprimer le pixel
                    if neighbors_opaque < 3:
                        data[y, x, 3] = 0
        
        # 4. Améliorer le contraste du sprite restant
        # Seulement sur les pixels non-transparents
        opaque_mask = data[:,:,3] > 128
        
        if np.any(opaque_mask):
            # Augmenter légèrement le contraste
            for c in range(3):  # RGB
                channel = data[:,:,c][opaque_mask].astype(float)
                if len(channel) > 0:
                    # Normaliser et améliorer le contraste
                    channel = np.clip(channel * 1.1 - 5, 0, 255)
                    data[:,:,c][opaque_mask] = channel.astype(np.uint8)
        
        # 5. Redimensionner proprement à 80x80
        cleaned_img = Image.fromarray(data, 'RGBA')
        
        # Redimensionnement avec anti-aliasing de qualité
        resized_img = cleaned_img.resize((80, 80), Image.Resampling.LANCZOS)
        
        # 6. Post-traitement final - supprimer les artefacts de redimensionnement
        final_data = np.array(resized_img)
        
        # Supprimer les pixels très faiblement opaques créés par le redimensionnement
        weak_alpha_mask = (final_data[:,:,3] > 0) & (final_data[:,:,3] < 50)
        final_data[weak_alpha_mask, 3] = 0
        
        # Renforcer les pixels moyennement opaques
        medium_alpha_mask = (final_data[:,:,3] >= 50) & (final_data[:,:,3] < 200)
        final_data[medium_alpha_mask, 3] = 255
        
        final_img = Image.fromarray(final_data, 'RGBA')
        final_img.save(output_path, 'PNG', optimize=True)
        
        # Statistiques
        original_pixels = np.sum(np.array(Image.open(input_path).convert("RGBA"))[:,:,3] > 0)
        final_pixels = np.sum(final_data[:,:,3] > 0)
        
        print(f"   ✅ Nettoyé: {original_pixels} → {final_pixels} pixels opaques")
        
        return True

def clean_sprite_advanced(image_path, output_path=None):
    """Nettoie complètement un sprite en supprimant tous les résidus blancs"""
    
    if output_path is None:
        output_path = image_path
    
    print(f"🧹 Nettoyage avancé: {image_path}")
    
    try:
        # Charger l'image
        with Image.open(image_path) as img:
            # Convertir en RGBA si nécessaire
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            # Convertir en array numpy pour traitement
            data = np.array(img)
            
            # Taille originale
            original_size = data.shape[:2]
            print(f"   📐 Taille originale: {original_size[1]}x{original_size[0]}")
            
            # 1. Supprimer les pixels blancs et quasi-blancs
            # Définir ce qu'est "blanc" (RGB proche de 255,255,255)
            white_threshold = 240
            is_white = (
                (data[:,:,0] >= white_threshold) & 
                (data[:,:,1] >= white_threshold) & 
                (data[:,:,2] >= white_threshold)
            )
            
            # Rendre transparents les pixels blancs
            data[is_white] = [0, 0, 0, 0]
            
            # 2. Supprimer les pixels gris très clairs (résidus)
            gray_threshold = 220
            is_light_gray = (
                (data[:,:,0] >= gray_threshold) & 
                (data[:,:,1] >= gray_threshold) & 
                (data[:,:,2] >= gray_threshold) &
                (data[:,:,0] == data[:,:,1]) &  # Vraiment gris (composantes égales)
                (data[:,:,1] == data[:,:,2])
            )
            data[is_light_gray] = [0, 0, 0, 0]
            
            # 3. Detecter les contours et nettoyer
            # Créer un masque des pixels non-transparents
            alpha_mask = data[:,:,3] > 50  # Pixels avec un minimum d'opacité
            
            # 4. Crop automatique pour enlever les bordures vides
            if np.any(alpha_mask):
                # Trouver les limites du contenu
                rows = np.any(alpha_mask, axis=1)
                cols = np.any(alpha_mask, axis=0)
                
                if np.any(rows) and np.any(cols):
                    top, bottom = np.where(rows)[0][[0, -1]]
                    left, right = np.where(cols)[0][[0, -1]]
                    
                    # Ajouter un petit padding
                    padding = 2
                    top = max(0, top - padding)
                    left = max(0, left - padding)
                    bottom = min(data.shape[0] - 1, bottom + padding)
                    right = min(data.shape[1] - 1, right + padding)
                    
                    # Crop l'image
                    cropped_data = data[top:bottom+1, left:right+1]
                    print(f"   ✂️ Crop: {right-left+1}x{bottom-top+1}")
                else:
                    cropped_data = data
            else:
                print("   ⚠️ Image entièrement transparente!")
                cropped_data = data
            
            # 5. Redimensionner à 80x80 avec padding intelligent
            target_size = 80
            cropped_img = Image.fromarray(cropped_data, 'RGBA')
            
            # Calculer les dimensions finales en gardant les proportions
            original_w, original_h = cropped_img.size
            aspect_ratio = original_w / original_h
            
            if aspect_ratio > 1:  # Plus large que haut
                new_w = target_size
                new_h = int(target_size / aspect_ratio)
            else:  # Plus haut que large
                new_h = target_size
                new_w = int(target_size * aspect_ratio)
            
            # Redimensionner avec antialiasing
            resized = cropped_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            # 6. Centrer sur un canvas 80x80 transparent
            final_img = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
            
            # Calculer la position pour centrer
            paste_x = (target_size - new_w) // 2
            paste_y = (target_size - new_h) // 2
            
            final_img.paste(resized, (paste_x, paste_y), resized)
            
            # 7. Post-traitement final
            # Améliorer la netteté
            enhancer = ImageEnhance.Sharpness(final_img)
            final_img = enhancer.enhance(1.2)
            
            # 8. Sauvegarder avec compression optimale
            final_img.save(output_path, 'PNG', optimize=True)
            
            print(f"   ✅ Nettoyé et sauvé: {new_w}x{new_h} → 80x80")
            return True
            
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
        return False

def clean_all_ninja_sprites():
    """Nettoie tous les sprites ninja"""
    
    print("🎨 NETTOYAGE AVANCÉ DES SPRITES NINJA")
    print("=" * 50)
    
    assets_dir = Path('./assets/characters')
    
    # Créer un dossier pour les sprites nettoyés
    cleaned_dir = assets_dir / 'cleaned'
    cleaned_dir.mkdir(exist_ok=True)
    
    # Liste des sprites ninja
    ninja_files = list(assets_dir.glob('ninja_*.png'))
    
    if not ninja_files:
        print("❌ Aucun sprite ninja trouvé!")
        return False
    
    print(f"📁 Trouvé {len(ninja_files)} sprites ninja à nettoyer")
    
    success_count = 0
    
    for sprite_file in ninja_files:
        # Nettoyer vers le dossier cleaned
        output_file = cleaned_dir / sprite_file.name
        
        if clean_sprite_advanced(sprite_file, output_file):
            success_count += 1
    
    print(f"\n📊 RÉSULTATS:")
    print(f"   ✅ Sprites nettoyés: {success_count}/{len(ninja_files)}")
    print(f"   📁 Sauvés dans: {cleaned_dir}")
    
    if success_count == len(ninja_files):
        print(f"\n🎉 Tous les sprites ont été nettoyés avec succès!")
        print(f"💡 Copiez maintenant les sprites nettoyés:")
        print(f"   copy {cleaned_dir}\\*.png {assets_dir}")
        return True
    else:
        print(f"\n⚠️ Quelques sprites n'ont pas pu être nettoyés")
        return False

def analyze_sprite_issues():
    """Analyse les problèmes potentiels des sprites"""
    
    print("🔍 ANALYSE DES SPRITES ACTUELS")
    print("=" * 40)
    
    assets_dir = Path('./assets/characters')
    ninja_files = list(assets_dir.glob('ninja_*.png'))
    
    issues_found = []
    
    for sprite_file in ninja_files:
        try:
            with Image.open(sprite_file) as img:
                if img.mode != 'RGBA':
                    img = img.convert('RGBA')
                
                data = np.array(img)
                
                # Vérifier les pixels blancs
                white_pixels = np.sum(
                    (data[:,:,0] > 240) & 
                    (data[:,:,1] > 240) & 
                    (data[:,:,2] > 240) &
                    (data[:,:,3] > 0)  # Non transparents
                )
                
                # Vérifier les bordures
                border_has_content = (
                    np.any(data[0,:,3] > 0) or   # Top
                    np.any(data[-1,:,3] > 0) or  # Bottom
                    np.any(data[:,0,3] > 0) or   # Left
                    np.any(data[:,-1,3] > 0)     # Right
                )
                
                issues = []
                if white_pixels > 0:
                    issues.append(f"{white_pixels} pixels blancs")
                if border_has_content:
                    issues.append("contenu sur les bordures")
                
                if issues:
                    issues_found.append(f"{sprite_file.name}: {', '.join(issues)}")
                else:
                    print(f"   ✅ {sprite_file.name}")
                    
        except Exception as e:
            issues_found.append(f"{sprite_file.name}: Erreur - {e}")
    
    if issues_found:
        print(f"\n⚠️ PROBLÈMES DÉTECTÉS:")
        for issue in issues_found:
            print(f"   - {issue}")
        return False
    else:
        print(f"\n🎉 Tous les sprites semblent propres!")
        return True

if __name__ == "__main__":
    print("🎨 OUTIL DE NETTOYAGE AVANCÉ DES SPRITES")
    print("=" * 60)
    
    # D'abord analyser les problèmes
    print("1️⃣ Analyse des sprites actuels...")
    has_issues = not analyze_sprite_issues()
    
    if has_issues:
        print("\n2️⃣ Nettoyage des sprites...")
        success = clean_all_ninja_sprites()
        
        if success:
            print(f"\n🚀 ÉTAPES SUIVANTES:")
            print(f"1. Copier les sprites nettoyés:")
            print(f"   copy assets\\characters\\cleaned\\*.png assets\\characters\\")
            print(f"2. Recharger le jeu pour voir la différence!")
        else:
            print(f"\n❌ Le nettoyage a échoué")
    else:
        print(f"\n✅ Aucun nettoyage nécessaire - les sprites sont déjà propres!")