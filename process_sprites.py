import os
from PIL import Image, ImageChops
import numpy as np

def remove_background_auto(image_path, output_path, target_size=(80, 80)):
    """
    Retire automatiquement le background et redimensionne l'image
    """
    try:
        # Charger l'image
        img = Image.open(image_path).convert("RGBA")
        print(f"Traitement de {os.path.basename(image_path)} ({img.width}x{img.height})")
        
        # Convertir en array numpy pour faciliter le traitement
        data = np.array(img)
        
        # Méthode 1: Retirer la couleur dominante des coins
        # Prendre les couleurs des 4 coins
        corners = [
            tuple(data[0, 0, :3]),      # Top-left
            tuple(data[0, -1, :3]),     # Top-right  
            tuple(data[-1, 0, :3]),     # Bottom-left
            tuple(data[-1, -1, :3])     # Bottom-right
        ]
        
        # Trouver la couleur de fond la plus fréquente dans les coins
        corner_colors = {}
        for color in corners:
            corner_colors[color] = corner_colors.get(color, 0) + 1
        
        bg_color = max(corner_colors.items(), key=lambda x: x[1])[0]
        print(f"  Couleur de fond détectée: RGB{bg_color}")
        
        # Créer un masque pour la couleur de fond (avec tolérance)
        tolerance = 30
        mask = np.all(np.abs(data[:, :, :3] - bg_color) <= tolerance, axis=2)
        
        # Appliquer la transparence
        data[mask, 3] = 0  # Rendre transparent
        
        # Reconvertir en image PIL
        result = Image.fromarray(data, 'RGBA')
        
        # Si ça n'a pas bien marché, essayer une autre méthode
        if np.sum(data[:, :, 3] > 0) < (img.width * img.height * 0.1):  # Moins de 10% opaque
            print(f"  Méthode couleur échouée, essai méthode contours...")
            # Méthode alternative: garder seulement la zone centrale
            img = Image.open(image_path).convert("RGBA")
            result = remove_background_center_crop(img)
        
        # Redimensionner à la taille cible
        result = result.resize(target_size, Image.Resampling.LANCZOS)
        
        # Sauvegarder
        result.save(output_path, "PNG")
        print(f"  ✅ Sauvegardé: {output_path}")
        return True
        
    except Exception as e:
        print(f"  ❌ Erreur: {e}")
        return False

def remove_background_center_crop(img, margin_percent=0.15):
    """
    Méthode alternative: crop du centre et ajout de transparence sur les bords
    """
    width, height = img.size
    
    # Calculer les marges
    margin_x = int(width * margin_percent)
    margin_y = int(height * margin_percent)
    
    # Créer une nouvelle image transparente
    result = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    
    # Copier la partie centrale
    center_box = (margin_x, margin_y, width - margin_x, height - margin_y)
    center = img.crop(center_box)
    result.paste(center, center_box)
    
    return result

def process_ninja_sprites():
    """
    Traite tous les sprites ninja avec animations multiples
    """
    input_dir = "assets/characters"
    output_dir = "assets/characters/processed"
    
    # Créer le dossier de sortie
    os.makedirs(output_dir, exist_ok=True)
    
    # Lister tous les fichiers ninja avec numéros
    ninja_files = []
    for file in os.listdir(input_dir):
        if file.startswith('ninja_') and file.endswith('.png'):
            if any(char.isdigit() for char in file):  # Contient un chiffre
                ninja_files.append(file)
    
    ninja_files.sort()  # Trier pour avoir un ordre correct
    
    print(f"🥷 Traitement de {len(ninja_files)} sprites ninja...")
    print("=" * 50)
    
    success_count = 0
    for file in ninja_files:
        input_path = os.path.join(input_dir, file)
        output_path = os.path.join(output_dir, file)
        
        if remove_background_auto(input_path, output_path):
            success_count += 1
    
    print("=" * 50)
    print(f"✅ Traitement terminé: {success_count}/{len(ninja_files)} sprites traités avec succès")
    
    return success_count > 0

if __name__ == "__main__":
    # Changer vers le répertoire du jeu
    os.chdir(r"C:\Users\Kraken\Documents\Play")
    
    # Traiter les sprites
    if process_ninja_sprites():
        print("\n🎉 Tous les sprites sont prêts !")
        print("📁 Fichiers sauvegardés dans: assets/characters/processed/")
    else:
        print("\n❌ Erreur lors du traitement")