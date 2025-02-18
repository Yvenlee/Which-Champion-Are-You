import streamlit as st
import tensorflow as tf
import numpy as np
import os
import random
import tempfile
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing import image
from PIL import Image

# Charger le modèle
MODEL_PATH = "modelfinal.h5"  # Modifier si besoin
model = tf.keras.models.load_model(MODEL_PATH)

dataset_dir = "Players_merged1"  # Modifier si besoin

# Fonction pour prétraiter une image
def preprocess_image(img_path, img_size=(128, 128)):
    img = Image.open(img_path).convert('RGB')  # Assurer que l'image est en RGB
    img = img.resize(img_size)
    img_array = np.array(img)
    img_array = img_array / 255.0  # Normalisation
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# Fonction pour récupérer une image d’un sportif spécifique
def get_sample_image(sportif_name):
    possible_folders = [f for f in os.listdir(dataset_dir) if sportif_name.lower() in f.lower()]
    if possible_folders:
        class_folder = os.path.join(dataset_dir, possible_folders[0])
        images = [img for img in os.listdir(class_folder) if img.endswith((".jpg", ".jpeg", ".png"))]
        if images:
            return os.path.join(class_folder, random.choice(images))
    return None

# Interface Streamlit
st.title("🔍 Which Champion are you ?")
option = st.radio("Choisissez une option :", ("📂 Uploader une image", "📸 Prendre une photo"))

img_path = None
if option == "📂 Uploader une image":
    uploaded_file = st.file_uploader("Uploader une image", type=["jpg", "jpeg", "png"])
    if uploaded_file:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(uploaded_file.name)[-1]) as temp_file:
            temp_file.write(uploaded_file.read())
            img_path = temp_file.name

elif option == "📸 Prendre une photo":
    captured_image = st.camera_input("Prenez une photo")
    if captured_image:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_file:
            temp_file.write(captured_image.read())
            img_path = temp_file.name

if img_path:
    st.image(img_path, caption="Image test", use_column_width=True)
    
    with st.spinner('Veuillez patienter... en cours de prédiction...'):
        img_array = preprocess_image(img_path)
        predictions = model.predict(img_array)
        top_3_indices = np.argsort(predictions[0])[-3:][::-1]
        top_3_probabilities = predictions[0][top_3_indices]

        class_labels = os.listdir(dataset_dir)
        
        st.subheader("🧑‍🎤 Résultats :")
        fig, axes = plt.subplots(1, 4, figsize=(15, 5))
        img_test = Image.open(img_path)
        axes[0].imshow(img_test)
        axes[0].set_title("Image Test")
        axes[0].axis("off")
        
        for i, idx in enumerate(top_3_indices):
            sportif_name = class_labels[idx]
            sample_img_path = get_sample_image(sportif_name)
            if sample_img_path:
                img_pred = Image.open(sample_img_path)
                axes[i + 1].imshow(img_pred)
                axes[i + 1].set_title(f"{sportif_name} ({top_3_probabilities[i]:.2%})")
                axes[i + 1].axis("off")
            else:
                axes[i + 1].set_title(f"{sportif_name} (Image introuvable)")
                axes[i + 1].axis("off")
        
        st.pyplot(fig)
