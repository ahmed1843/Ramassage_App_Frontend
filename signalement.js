document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const reportForm = document.getElementById('report-form');
    const photoInput = document.getElementById('photo');
    const previewContainer = document.getElementById('preview-container');
    const previewImg = document.getElementById('photo-preview');

    // 1. APERÇU DE LA PHOTO
    photoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                previewContainer.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    // 2. GÉOLOCALISATION (Optionnel pour remplir le champ)
    document.getElementById('geo-btn').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                document.getElementById('location').value = 
                    `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`;
            });
        }
    });

// 3. ENVOI DU SIGNALEMENT (Version sécurisée pour la carte)
reportForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const locationField = document.getElementById('location').value;
    
    // Sécurité : On vérifie si on a des coordonnées
    if (!locationField || !locationField.includes('Lat:')) {
        const confirmer = confirm("Vous n'avez pas activé la géolocalisation. Voulez-vous envoyer sans point sur la carte ?");
        if (!confirmer) return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    const formData = new FormData();
    
    // On construit le titre pour que profil.js puisse lire les coordonnées
    formData.append('title', locationField || "Signalement sans GPS");
    formData.append('description', document.getElementById('description').value);
    formData.append('zone_id', 1);
    formData.append('noise_level', 1);

    if (photoInput.files[0]) {
        formData.append('image', photoInput.files[0]);
    }

    try {
        btn.disabled = true;
        btn.innerText = "Envoi en cours...";

        const response = await fetch('http://localhost:8000/api/reports', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: formData
        });

        if (response.ok) {
            document.getElementById('confirmation').classList.remove('hidden');
            setTimeout(() => window.location.href = 'profil.html', 1500);
        } else {
            alert("Erreur lors de l'envoi.");
        }
    } catch (error) {
        console.error(error);
        alert("Erreur de connexion.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Envoyer";
        }
    });
});
