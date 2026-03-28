// --- 1. CONFIGURATION DES CONSEILS ---
const tips = [
    "🌍 Un déchet bien trié = un environnement protégé.",
    "🗑️ Sortez vos poubelles uniquement avant le passage du camion.",
    "🚫 Évitez de jeter les déchets dans la rue, Dakar vous remercie !",
    "🔄 Le plastique est recyclable — pensez à le séparer du reste.",
    "⏰ Respecter les horaires réduit les nuisances sonores.",
    "🧴 Utilisez des sacs réutilisables pour vos courses au marché."
];

function faireDefilerConseils() {
    const tipText = document.getElementById('eco-tip-text');
    if (!tipText) return;
    let index = 0;
    tipText.innerText = tips[0];

    setInterval(() => {
        tipText.style.opacity = 0;
        setTimeout(() => {
            index = (index + 1) % tips.length;
            tipText.innerText = tips[index];
            tipText.style.opacity = 1;
        }, 500);
    }, 10000);
}

// --- 2. GESTION DE L'AFFICHAGE DYNAMIQUE ---
function gererAffichageUtilisateur() {
    const authSection = document.getElementById('auth-section');
    const userData = localStorage.getItem('user');
    const footerNav = document.querySelector('.mobile-nav'); // On récupère le menu du bas
    
    const elementsDashboard = [
        document.getElementById('eco-tip-container'),
        document.getElementById('search-zone'),
        document.getElementById('zones-container'),
        document.getElementById('stats-section'),
        document.querySelector('.next-pickup')
    ];

    if (userData && authSection) {
        // --- MODE CONNECTÉ ---
        const user = JSON.parse(userData);
        const mots = user.name.trim().split(/\s+/);
        const initiales = (mots.length > 1) ? (mots[0][0] + mots[mots.length-1][0]).toUpperCase() : mots[0].substring(0, 2).toUpperCase();
        const couleurs = ['#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#1abc9c'];
        const couleurUser = couleurs[user.name.length % couleurs.length];

        authSection.innerHTML = `
            <div style="display:grid; grid-template-columns: 40px 1fr 40px; align-items:center; background:white; padding:15px; border-radius:20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-bottom:10px;">
                <div></div>
                <a href="profil.html" style="display:flex; flex-direction:column; align-items:center; gap:8px; text-decoration:none;">
                    <div style="position:relative;">
                        <div style="width:55px; height:55px; background:${couleurUser}; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:22px; border:3px solid #f8f9fa;">${initiales}</div>
                        <div style="position:absolute; bottom:2px; right:2px; width:14px; height:14px; background:#2ecc71; border:2px solid white; border-radius:50%; animation: blink 1.5s infinite;"></div>
                    </div>
                    <div style="text-align:center;">
                        <p style="margin:0; font-size:12px; color:#95a5a6;">Mon compte</p>
                        <strong style="font-size:16px; color:#2c3e50;">${user.name}</strong>
                    </div>
                </a>
                <button onclick="confirmerDeconnexion()" style="background:#fff5f5; border:1px solid #fed7d7; width:38px; height:38px; border-radius:12px; cursor:pointer; color:#e74c3c; display:flex; align-items:center; justify-content:center; font-size:20px; align-self:start;">🚪</button>
            </div>`;

        // Afficher dashboard + footer
        elementsDashboard.forEach(el => { if(el) el.style.display = (el.id === 'eco-tip-container') ? 'flex' : 'block'; });
        if(footerNav) footerNav.style.display = 'block';

        afficherToutesLesZones();
        afficherZonesCritiques();
        faireDefilerConseils();

    } else {
        // --- MODE DÉCONNECTÉ ---
        authSection.innerHTML = `
            <div style="text-align:center; padding:40px 20px; background:white; border-radius:25px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-bottom:20px;">
                <div style="font-size:60px; margin-bottom:20px;">🌍</div>
                <h2 style="color:#2c3e50; margin-bottom:10px;">Dakar Propre</h2>
                <p style="color:#7f8c8d; margin-bottom:30px; font-size:15px;">Connectez-vous pour suivre les camions et protéger votre quartier.</p>
                <button onclick="window.location.href='login.html'" style="width:100%; background:#2ecc71; color:white; border:none; padding:16px; border-radius:15px; font-weight:bold; font-size:16px; cursor:pointer; box-shadow: 0 4px 15px rgba(46,204,113,0.3);">Accéder à mon espace</button>
                <p style="margin-top:15px; font-size:13px; color:#95a5a6;">Pas encore inscrit ? <a href="register.html" style="color:#2ecc71; font-weight:bold; text-decoration:none;">Créer un compte</a></p>
            </div>`;
        
        elementsDashboard.forEach(el => { if(el) el.style.display = 'none'; });
        if(footerNav) footerNav.style.display = 'none'; // On cache le menu du bas
    }
}

// --- 3. RÉCUPÉRATION DES DONNÉES API ---
async function afficherToutesLesZones() {
    const container = document.getElementById('zones-container');
    if (!container) return;
    try {
        const response = await fetch('http://localhost:8000/api/zones'); 
        const json = await response.json();
        const zones = json.data || json;
        if (zones.length > 0) {
            container.innerHTML = zones.map(zone => `
                <section class="zone-card bg-white p-4 rounded-xl shadow-sm border-l-4 border-primary mb-3">
                    <h2 class="font-bold text-lg">${zone.nom || zone.name}</h2>
                    <p class="text-gray-600 text-sm">${zone.description || 'Quartier de Dakar'}</p>
                </section>`).join('');
            activerLaRecherche();
        }
    } catch (e) { container.innerHTML = "<p>Serveur indisponible.</p>"; }
}

async function afficherZonesCritiques() {
    const container = document.getElementById('stats-container');
    if (!container) return;
    try {
        const response = await fetch('http://localhost:8000/api/stats/noise');
        const result = await response.json();
        const zones = result.data || [];
        container.innerHTML = zones.map(zone => {
            const avg = parseFloat(zone.reports_avg_noise_level || 0).toFixed(1);
            const isCritical = avg > 3;
            return `
                <div class="zone-card" style="background:#fff; border-left:5px solid ${isCritical ? '#e74c3c' : '#2ecc71'}; padding:12px; margin-bottom:10px; border-radius:8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong>${zone.name}</strong>
                        <span>${isCritical ? '🚨' : '✅'}</span>
                    </div>
                    <p style="font-size:12px; color:#7f8c8d;">Bruit : <b>${avg}/5</b> | Signalements : <b>${zone.reports_count}</b></p>
                </div>`;
        }).join('');
    } catch (e) { container.innerHTML = ""; }
}

function activerLaRecherche() {
    const searchInput = document.getElementById('search-zone');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const zones = document.querySelectorAll('.zone-card');
        zones.forEach(zone => {
            const text = zone.innerText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            zone.style.display = text.includes(term) ? "block" : "none";
        });
    });
}

async function rafraichirStats() {
    const btn = document.getElementById('btn-refresh');
    btn.innerHTML = "⌛...";
    await afficherZonesCritiques();
    setTimeout(() => { btn.innerHTML = "<span>🔄</span> Actualiser"; }, 500);
}

// --- 4. INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    gererAffichageUtilisateur();
});

function confirmerDeconnexion() { document.getElementById('logout-modal').style.display = 'flex'; }
function fermerModal() { document.getElementById('logout-modal').style.display = 'none'; }
function validerDeconnexion() { localStorage.clear(); window.location.reload(); }

const styleBlink = document.createElement('style');
styleBlink.innerHTML = `
    @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
    #eco-tip-text { transition: opacity 0.5s ease; }
`;
document.head.appendChild(styleBlink);
document.addEventListener('DOMContentLoaded', () => {
    // 1. On récupère le nom de la page actuelle (ex: notifications.html)
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';
    
    // 2. On cherche tous les liens du menu
    const navLinks = document.querySelectorAll('.nav-item a');

    navLinks.forEach(link => {
        // 3. Si le href du lien correspond à la page actuelle
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active'); // On ajoute le vert
        } else {
            link.classList.remove('active'); // On enlève le vert des autres
        }
    });
});

