from PIL import Image
import os

def remove_background_skills():
    """Supprime le background des sprites spéciaux et les rend transparents"""
    
    skills_path = "assets/characters/skills/"
    
    if not os.path.exists(skills_path):
        print(f"❌ Dossier {skills_path} non trouvé")
        return
    
    print("🧹 Suppression des backgrounds des sprites spéciaux...")
    
    sprite_files = [f for f in os.listdir(skills_path) if f.endswith('.png')]
    
    for filename in sprite_files:
        filepath = os.path.join(skills_path, filename)
        
        try:
            # Ouvrir l'image
            img = Image.open(filepath).convert("RGBA")
            
            # Créer une nouvelle image avec canal alpha
            new_img = Image.new("RGBA", img.size, (0, 0, 0, 0))
            
            # Parcourir tous les pixels
            pixels = img.load()
            new_pixels = new_img.load()
            
            for y in range(img.height):
                for x in range(img.width):
                    r, g, b, a = pixels[x, y]
                    
                    # Détecter les couleurs de background à supprimer
                    is_background = False
                    
                    # Background bleu/cyan
                    if (b > 150 and b > r + 50 and b > g + 50):
                        is_background = True
                    
                    # Background blanc/gris clair
                    elif (r > 240 and g > 240 and b > 240):
                        is_background = True
                    
                    # Background très clair (proche du blanc)
                    elif (r > 200 and g > 200 and b > 200 and 
                          abs(r-g) < 30 and abs(r-b) < 30 and abs(g-b) < 30):
                        is_background = True
                    
                    # Si ce n'est pas du background, garder le pixel
                    if not is_background:
                        new_pixels[x, y] = (r, g, b, a)
                    # Sinon, le rendre transparent
                    else:
                        new_pixels[x, y] = (0, 0, 0, 0)
            
            # Sauvegarder avec transparence
            new_img.save(filepath, 'PNG', optimize=True)
            
            print(f"✅ {filename}: Background supprimé")
            
        except Exception as e:
            print(f"❌ Erreur avec {filename}: {e}")
    
    print("\n🎉 Nettoyage terminé !")
    print("🎯 Les sprites spéciaux sont maintenant transparents")

if __name__ == "__main__":
    remove_background_skills()