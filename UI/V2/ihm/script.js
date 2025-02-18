let videoStream = null;

const startCamera = document.getElementById('startCamera');
const capturePhoto = document.getElementById('capturePhoto');
const video = document.getElementById('video');
const imagePreview = document.getElementById('imagePreview');
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const searchButton = document.getElementById('searchButton');
const fileNameDisplay = document.getElementById('fileName');

// Drag-and-Drop functionality
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        previewImage(file);
        setFileToInput(file);
    } else {
        alert('Veuillez déposer un fichier image.');
    }
});

// File input change event
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) previewImage(file);
});

// Webcam functionality
startCamera.addEventListener('click', async () => {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }, // Use "environment" for rear camera
        });

        video.srcObject = videoStream;
        video.style.display = 'block';
        capturePhoto.style.display = 'inline';
        imagePreview.style.display = 'none'; // Hide preview image
    } catch (err) {
        alert('Erreur lors de l\'activation de la caméra : ' + err.message);
    }
});

capturePhoto.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const imgData = canvas.toDataURL('image/png');
    imagePreview.src = imgData;
    imagePreview.style.display = 'block';

    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        video.style.display = 'none';
        capturePhoto.style.display = 'none';
    }
});

// Image preview function
function previewImage(file) {
    const reader = new FileReader();
    reader.onload = () => {
        imagePreview.src = reader.result;
        imagePreview.style.display = 'block';
        searchButton.style.display = 'block';
        fileNameDisplay.textContent = `Fichier : ${file.name}`;
        fileNameDisplay.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Set file to input programmatically
function setFileToInput(file) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
}

searchButton.addEventListener("click", async () => {
    let formData = new FormData();

    // Vérifier si un fichier a été sélectionné
    if (fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]);
    } 
    // Sinon, envoyer l’image capturée par la webcam
    else if (imagePreview.src.startsWith("data:image")) {
        let blob = await fetch(imagePreview.src).then(res => res.blob());
        formData.append("file", blob, "capture.png");
    } 
    else {
        alert("Veuillez sélectionner une image !");
        return;
    }

    try {
        let response = await fetch("http://localhost:5001/predict/test", {
            method: "POST",
            body: formData
        });

        let result = await response.json();
        console.log(result); // Affiche la réponse du serveur
        alert("Résultat : " + JSON.stringify(result));
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'image :", error);
        alert("Erreur de connexion au serveur.");
    }
});
