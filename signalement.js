// Sélection des éléments
const form = document.getElementById("report-form");
const confirmation = document.getElementById("confirmation");
const photoInput = document.getElementById("photo");
const previewContainer = document.getElementById("preview-container");
const photoPreview = document.getElementById("photo-preview");
const geoBtn = document.getElementById("geo-btn");
const locationInput = document.getElementById("location");

// --- 1. GESTION DE LA PHOTO (PRÉVISUALISATION) ---
photoInput.addEventListener("change", function() {
  const file = this.files[0]; // On prend le premier fichier choisi

  if (file) {
    const reader = new FileReader();

    reader.onload = function(e) {
      photoPreview.src = e.target.result; // On met l'image dans la balise img
      previewContainer.style.display = "block"; // On affiche le bloc
    };

    reader.readAsDataURL(file); // On lit le contenu du fichier
  } else {
    previewContainer.style.display = "none";
  }
});

// --- 2. GESTION DE LA GÉOLOCALISATION ---
geoBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    geoBtn.textContent = "⌛";
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude.toFixed(5);
      const lon = position.coords.longitude.toFixed(5);
      locationInput.value = `Lat: ${lat}, Lon: ${lon}`;
      geoBtn.textContent = "✅";
    }, () => {
      alert("Erreur de géolocalisation");
      geoBtn.textContent = "📍";
    });
  }
});

// --- 3. ENVOI DU FORMULAIRE ---
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // 1. On récupère le bouton et on le bloque
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Envoi en cours... ⏳";

  // Simulation du délai du serveur (2 secondes)
  setTimeout(() => {
    const description = document.getElementById("description").value;
    const location = document.getElementById("location").value;

    console.log("Signalement envoyé au backend :", { description, location });

    // 2. On affiche la confirmation
    form.style.display = "none";
    confirmation.classList.remove("hidden");

    // Redirection après succès
    setTimeout(() => { window.location.href = 'index.html'; }, 2000);
  }, 2000); 
});

