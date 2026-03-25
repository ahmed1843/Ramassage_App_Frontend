const style = document.createElement('style');
style.innerHTML = `
    @keyframes alerte-douce {
        0% { border: 2px solid #ff0000; box-shadow: 0 0 5px rgba(255,0,0,0.2); }
        50% { border: 2px solid #ffcccc; box-shadow: 0 0 15px rgba(255,0,0,0.5); }
        100% { border: 2px solid #ff0000; box-shadow: 0 0 5px rgba(255,0,0,0.2); }
    }
    .prioritaire-active {
        animation: alerte-douce 2s infinite !important;
    }
    /* Classe pour identifier les zones lors de la recherche */
    .zone-card { transition: all 0.3s ease; }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Démarrage de l'accueil...");

    if (document.getElementById('auth-section')) {
        gererAffichageUtilisateur();
    }

    if (document.getElementById('zones-container')) {
        await afficherToutesLesZones();
        // LANCER LA RECHERCHE UNE FOIS LES ZONES CHARGÉES
        activerLaRecherche();
    }

    if (document.getElementById('stats-container')) {
        await afficherZonesCritiques();
    }
});

function activerLaRecherche() {
    const searchInput = document.getElementById('search-zone');
    const container = document.getElementById('zones-container');

    if (searchInput && container) {
        searchInput.addEventListener('input', (e) => {
            // 1. On nettoie la saisie de l'utilisateur (minuscules + sans accents)
            const term = e.target.value
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .trim();

            const zones = container.querySelectorAll('.zone-card');

            zones.forEach(zone => {
                // 2. On nettoie aussi le texte de la zone pour comparer
                const zoneText = zone.innerText
                    .toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                
                // 3. Comparaison ultra-flexible
                zone.style.display = zoneText.includes(term) ? "block" : "none";
            });
        });
    }
}



async function afficherToutesLesZones() {
    const container = document.getElementById('zones-container');
    try {
        const response = await apiFetch('/zones');
        const json = await response.json();
        const zones = json.data || json;

        if (zones.length > 0) {
            // AJOUT DE LA CLASSE zone-card ICI
            container.innerHTML = zones.map(zone => `
                <section class="zone-card next-pickup bg-white p-4 rounded-xl shadow-sm border-l-4 border-primary mb-3">
                    <h2 class="font-bold text-lg">${zone.nom || zone.name}</h2>
                    <p class="text-gray-600 text-sm">${zone.description || ''}</p>
                </section>
            `).join('');
        } else {
            container.innerHTML = "<p>Aucune zone trouvée.</p>";
        }
    } catch (error) {
        console.error("Erreur Zones:", error);
        container.innerHTML = "<p style='color:red;'>Erreur de connexion au serveur.</p>";
    }
}

async function afficherZonesCritiques() {
    const container = document.getElementById('stats-container');
    try {
        const response = await apiFetch('/stats/noise');
        const result = await response.json();
        const zones = result.data || [];

        container.innerHTML = zones.map(zone => {
            const avg = parseFloat(zone.reports_avg_noise_level || 0).toFixed(1);
            const isCritical = avg > 3;
            return `
                <div class="zone-card" style="background:#fff; border-left:5px solid ${isCritical ? '#e74c3c' : '#2ecc71'}; padding:12px; margin-bottom:10px; border-radius:8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="color:#333;">${zone.name}</strong>
                        <span style="font-size:12px;">${isCritical ? '🚨 Critique' : '✅ Calme'}</span>
                    </div>
                    <p style="font-size:12px; color:#7f8c8d; margin-top:5px;">
                        Bruit : <b>${avg}/5</b> | Signalements : <b>${zone.reports_count}</b>
                    </p>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Erreur Stats:", e);
        container.innerHTML = ""; 
    }
}

function gererAffichageUtilisateur() {
    const authSection = document.getElementById('auth-section');
    const userData = localStorage.getItem('user');

    if (userData && authSection) {
        const user = JSON.parse(userData);
        authSection.innerHTML = `
            <div style="text-align:center; padding:15px; background:#fff; border-radius:15px; box-shadow: 0 4px 66px rgba(0,0,0,0.05);">
                <p>Bonjour, <strong>${user.name}</strong> ! 👋</p>
                <button onclick="localStorage.clear(); window.location.reload();" style="color:#e74c3c; background:none; border:none; text-decoration:underline; cursor:pointer; margin-top:5px;">
                    Se déconnecter
                </button>
            </div>
        `;
    }
}
