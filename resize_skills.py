from PIL import Image
import os

def resize_skills_sprites():
    """Redimensionne tous les sprites du dossier skills à 80x80"""
    
    skills_path = "assets/characters/skills/"
    
    if not os.path.exists(skills_path):
        print(f"❌ Dossier {skills_path} non trouvé")
        return
    
    print("🎯 Redimensionnement des sprites spéciaux...")
    
    # Liste tous les fichiers PNG dans skills/
    sprite_files = [f for f in os.listdir(skills_path) if f.endswith('.png')]
    
    if not sprite_files:
        print("❌ Aucun sprite PNG trouvé dans skills/")
        return
    
    print(f"📁 {len(sprite_files)} sprites trouvés:")
    
    for filename in sprite_files:
        filepath = os.path.join(skills_path, filename)
        
        try:
            # Ouvrir l'image
            img = Image.open(filepath)
            original_size = img.size
            
            # Redimensionner à 80x80 avec LANCZOS pour la qualité
            resized_img = img.resize((80, 80), Image.Resampling.LANCZOS)
            
            # Sauvegarder (écrase l'original)
            resized_img.save(filepath, 'PNG', optimize=True)
            
            print(f"✅ {filename}: {original_size} → (80, 80)")
            
        except Exception as e:
            print(f"❌ Erreur avec {filename}: {e}")
    
    print("\n🎉 Redimensionnement terminé !")
    print("🎯 Tous les sprites spéciaux sont maintenant en 80x80")

if __name__ == "__main__":
    resize_skills_sprites()