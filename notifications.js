const notificationsList = document.getElementById("notifications-list");

const fakeNotifications = [
  {
    title: "🚛 Camion en approche",
    message: "Le ramassage commence dans votre zone dans 10 minutes. Préparez vos bacs !",
    time: "À l'instant",
    type: "info"
  },
  {
    title: "✅ Signalement résolu",
    message: "Le dépôt sauvage à Médina Rue 10 a été nettoyé. Merci !",
    time: "Il y a 2h",
    type: "success"
  }
];

function displayNotifications() {
  if (!notificationsList) return; // Sécurité si l'élément n'existe pas
  
  notificationsList.innerHTML = ""; 

  if (fakeNotifications.length === 0) {
    notificationsList.innerHTML = "<p class='empty-msg'>Aucune notification pour le moment.</p>";
    return;
  }

  fakeNotifications.forEach(notif => {
    const notifElement = document.createElement("div");
    
    // IMPORTANT : On utilise "notification" pour correspondre à ton CSS
    notifElement.classList.add("notification", notif.type);
    
    notifElement.innerHTML = `
      <div class="notif-content">
        <h3>${notif.title}</h3>
        <p>${notif.message}</p>
        <span class="notif-time">${notif.time}</span>
      </div>
    `;
    notificationsList.appendChild(notifElement);
  });
}

window.onload = displayNotifications;
