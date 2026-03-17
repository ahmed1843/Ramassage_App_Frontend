// --- 1. GESTION DU RAMASSAGE (Code de ton binôme) ---
const pickupTimeElement = document.getElementById("pickup-time");

const pickupSchedule = [
  { day: "Lundi", time: "07h00" },
  { day: "Mercredi", time: "08h30" },
  { day: "Vendredi", time: "06h45" }
];

// On affiche le premier jour par défaut (pour l'instant)
const nextPickup = pickupSchedule[0];
if (pickupTimeElement) {
    pickupTimeElement.textContent = `${nextPickup.day} à ${nextPickup.time}`;
}

// --- 2. PERSONNALISATION DE L'ACCUEIL & LOGOUT ---
const authSection = document.querySelector(".auth-options");
const userPrenom = localStorage.getItem("user_prenom");
const isLoggedIn = localStorage.getItem("isLoggedIn");

// Si l'utilisateur est connecté, on change le bouton "Se connecter"
if (isLoggedIn === "true" && authSection) {
  authSection.innerHTML = `
    <div class="welcome-card" style="text-align: center; background: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <p style="margin: 0; color: #2c3e50;">Bonjour, <strong>${userPrenom}</strong> ! 👋</p>
      <button id="quick-logout" style="background: none; border: none; color: #e74c3c; text-decoration: underline; font-size: 0.8rem; cursor: pointer; margin-top: 10px;">Se déconnecter</button>
    </div>
  `;

  // Logique du bouton de déconnexion rapide
  document.getElementById("quick-logout").addEventListener("click", () => {
    if (confirm("Voulez-vous vous déconnecter ?")) {
      localStorage.clear(); // On vide la session
      window.location.reload(); // On recharge pour réafficher le bouton de connexion
    }
  });
}
