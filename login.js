const loginForm = document.getElementById("login-form");
const loginConfirmation = document.getElementById("login-confirmation");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const telephone = document.getElementById("telephone").value;
  const submitBtn = loginForm.querySelector(".auth-btn");

  if (telephone.length >= 9) {
    // --- ÉTAPE CHARGEMENT ---
    // 1. On bloque le bouton pour éviter les doubles clics
    submitBtn.disabled = true;
    submitBtn.textContent = "Vérification en cours... 🔒";

    // 2. On simule un délai de réponse du serveur (1.5 seconde)
    setTimeout(() => {
      console.log("Connexion réussie pour :", telephone);

      // Cacher le formulaire et montrer le succès
      loginForm.style.display = "none";
      loginConfirmation.classList.remove("hidden");

      // Sauvegarde de la session
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userPhone", telephone);

      // Redirection finale
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    }, 1500);

  } else {
    alert("Veuillez entrer un numéro de téléphone valide.");
  }
});
