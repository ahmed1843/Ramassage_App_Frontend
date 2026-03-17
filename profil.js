const form = document.getElementById("preferences-form");
const confirmation = document.getElementById("confirmation");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").checked;
  const sms = document.getElementById("sms").checked;
  const push = document.getElementById("push").checked;

  // Simuler sauvegarde des préférences
  console.log("Préférences sauvegardées :", { email, sms, push });

  confirmation.classList.remove("hidden");

  // Masquer le message après 3 secondes
  setTimeout(() => {
    confirmation.classList.add("hidden");
  }, 3000);
});
const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // 1. Demander confirmation (optionnel mais plus pro)
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
      
      // 2. Vider TOUT le localStorage (isLoggedIn, user_prenom, etc.)
      localStorage.clear();
      
      // 3. Rediriger immédiatement vers l'accueil
      window.location.href = "index.html";
    }
  });
}
