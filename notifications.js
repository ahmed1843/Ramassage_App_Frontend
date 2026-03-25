const ucgSounds = {
    bell: new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3'),
    truck: new Audio('https://www.soundjay.com/transportation/sounds/truck-horn-01.mp3')
};

const styleNotif = document.createElement('style');
styleNotif.innerHTML = `
    @keyframes pulse-urgent {
        0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
        70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
        100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
    }
    .status-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 12px; flex-shrink: 0; }
    .bg-info { background: #3498db; }
    .bg-success { background: #2ecc71; }
    .bg-urgent { background: #e74c3c; animation: pulse-urgent 2s infinite; }
`;
document.head.appendChild(styleNotif);

// 2. CHARGEMENT DES NOTIFICATIONS API
async function chargerNotifications() {
    const list = document.getElementById('notifications-list');
    const token = localStorage.getItem('token');
    if (!list) return;

    list.innerHTML = `<div class="skeleton" style="height: 60px; margin-bottom: 10px; background:#eee;"></div>`; 

    try {
        const response = await fetch('http://localhost:8000/api/notifications', {
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const notifications = await response.json();
        list.innerHTML = ""; 

        if (notifications.length > 0) {
            notifications.forEach(notif => {
                let typeClass = "bg-info"; 
                let emoji = "ℹ️";
                const msg = notif.message ? notif.message.toLowerCase() : "";

                // LOGIQUE COULEUR & EMOJI
                if (msg.includes("arrive") || msg.includes("urgence")) {
                    typeClass = "bg-urgent"; emoji = "🚨";
                } else if (msg.includes("traité") || msg.includes("nettoyé")) {
                    typeClass = "bg-success"; emoji = "✅";
                }

                // CORRECTION DU UNDEFINED ICI
                const titreAffiche = notif.title || notif.titre || "Alerte Passage";

                list.innerHTML += `
                    <div class="bg-white p-4 rounded-xl shadow-sm mb-3 flex items-center">
                        <div class="status-dot ${typeClass}"></div>
                        <div style="flex:1">
                            <strong class="text-sm">${emoji} ${titreAffiche}</strong>
                            <p class="text-xs text-slate-600">${notif.message}</p>
                        </div>
                    </div>`;
            });
        } else {
            list.innerHTML = `<p class="text-center text-gray-400">Aucune alerte. ✨</p>`;
        }
    } catch (error) { console.error(error); }
}

// 3. LOGIQUE DE SIMULATION DU CAMION
const trajetUcg = [{ nom: "Colobane" }, { nom: "Avenue Blaise Diagne" }, { nom: "Rue 22 Médina" }, { nom: "Arrivée" }];

function lancerLaSimulation() {
    let etape = 0;
    console.log("🚛 Simulation UCG lancée...");
    const intervalle = setInterval(() => {
        if (etape < trajetUcg.length) {
            console.log("Position : " + trajetUcg[etape].nom);
            if (trajetUcg[etape].nom === "Rue 22 Médina") {
                declencherAlerteVisuelleEtSonore();
            }
            etape++;
        } else { clearInterval(intervalle); }
    }, 3000);
}

function declencherAlerteVisuelleEtSonore() {
    const saved = localStorage.getItem('user_notif_settings');
    const settings = saved ? JSON.parse(saved) : { enabled: true, sound: 'system' };

    if (!settings.enabled) return;

    // --- GESTION DU SON ---
    if (settings.sound === 'system') {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode); gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.5);
    } 
    else if (settings.sound === 'bell') {
        ucgSounds.bell.play().catch(e => console.log("Audio bloqué :", e));
    } 
    else if (settings.sound === 'truck') {
        ucgSounds.truck.play().catch(e => console.log("Audio bloqué :", e));
    }

    // --- BONUS : VIBRATION MOBILE ---
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]); // Vibration : bzz - pause - bzz
    }

    // --- AFFICHAGE VISUEL ---
    const html = `<div id="notif-ucg" style="position:fixed; top:20px; right:20px; background:#1e272e; color:#2ecc71; border:2px solid #2ecc71; padding:20px; border-radius:12px; z-index:10001; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width:280px; font-family:Arial, sans-serif; animation: slideIn 0.5s ease;">
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:25px;">🔔</span>
                <div>
                    <strong style="color:white;">ALERTE UCG</strong><br>
                    <span style="font-size:13px;">Le camion est à la <strong>Médina</strong> !</span>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(() => { document.getElementById('notif-ucg')?.remove(); }, 6000);
}


// 4. INITIALISATION
document.addEventListener('DOMContentLoaded', () => {
    chargerNotifications();

    const masterNotif = document.getElementById('notif-master');
    const selectSound = document.getElementById('select-sound');
    const typeChecks = document.querySelectorAll('.notif-type'); // On récupère les 3 types

    // Sauvegarde de TOUS les réglages
    const sauverReglages = () => {
        const settings = { 
            enabled: masterNotif.checked, 
            sound: selectSound.value,
            types: Array.from(typeChecks).filter(c => c.checked).map(c => c.value)
        };
        localStorage.setItem('user_notif_settings', JSON.stringify(settings));
        console.log("⚙️ Réglages complets sauvegardés");
    };

    if (masterNotif && selectSound) {
        masterNotif.addEventListener('change', sauverReglages);
        selectSound.addEventListener('change', sauverReglages);
        typeChecks.forEach(cb => cb.addEventListener('change', sauverReglages));
        
        // Charger les réglages précédents
        const saved = localStorage.getItem('user_notif_settings');
        if (saved) {
            const s = JSON.parse(saved);
            masterNotif.checked = s.enabled;
            selectSound.value = s.sound;
            // On recoche les types sauvegardés
            if (s.types) {
                typeChecks.forEach(cb => cb.checked = s.types.includes(cb.value));
            }
        }
    }

    // Ajout du bouton Suivre
    const boutonHtml = `<button id="btn-demo-ucg" style="position: fixed; bottom: 80px; right: 20px; background: #2ecc71; color: white; border: none; padding: 10px 15px; border-radius: 30px; cursor: pointer; font-weight: bold; font-size: 12px; z-index: 10000; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">🚛 Suivre Camion</button>`;
    document.body.insertAdjacentHTML('beforeend', boutonHtml);

    document.getElementById('btn-demo-ucg').addEventListener('click', function() { 
        this.style.display = 'none'; 
        lancerLaSimulation(); 
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-zone');
    const zonesContainer = document.getElementById('zones-container');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const zones = zonesContainer.querySelectorAll('.zone-card'); // Assure-toi que tes zones ont cette classe

            zones.forEach(zone => {
                const text = zone.textContent.toLowerCase();
                if (text.includes(term)) {
                    zone.style.display = "block";
                } else {
                    zone.style.display = "none";
                }
            });
        });
    }
});
// --- SYSTÈME DE RECHERCHE ULTRA-ROBUSTE ---
document.addEventListener('input', (e) => {
    if (e.target.id === 'search-zone') {
        const term = e.target.value.toLowerCase().trim();
        const container = document.getElementById('zones-container');
        
        if (!container) return;

        // On cible TOUS les éléments à l'intérieur, peu importe leur classe
        const zones = container.children;

        Array.from(zones).forEach(zone => {
            // On récupère tout le texte (Nom de zone, heure, etc.)
            const txt = zone.innerText.toLowerCase();
            
            if (txt.includes(term)) {
                zone.style.display = ""; // Rétablit (flex ou block)
                zone.style.opacity = "1";
            } else {
                zone.style.display = "none"; // Cache
            }
        });
    }
});



