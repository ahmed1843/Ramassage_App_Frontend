const registerForm = document.getElementById("register-form");
const registerConfirmation = document.getElementById("register-confirmation");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const errorBox = document.getElementById("error-message");
  const telephone = document.getElementById("telephone").value;
  const submitBtn = registerForm.querySelector(".auth-btn");

  // On cache l'ancienne erreur s'il y en avait une
  errorBox.classList.add("hidden");

  // Simulation de chargement
  submitBtn.disabled = true;
  submitBtn.textContent = "Inscription... ⏳";

  setTimeout(() => {
    // SIMULATION D'ERREUR (Le "Pont" vers le Catch du Backend)
    if (telephone === "000000000") {
      errorBox.textContent = "⚠️ Ce numéro est déjà utilisé par un autre compte.";
      errorBox.classList.remove("hidden");
      submitBtn.disabled = false;
      submitBtn.textContent = "S'enregistrer";
    } else {
      // Cas de succès habituel
      registerForm.style.display = "none";
      document.getElementById("register-confirmation").classList.remove("hidden");
      // ... suite de ta logique de redirection
    }
  }, 1500);
});
