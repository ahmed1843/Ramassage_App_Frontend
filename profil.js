let tousLesRapports = [];

// 1. Lancement au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
        const user = JSON.parse(userData);
        document.getElementById('user-name-display').innerText = user.name;
        document.getElementById('user-email-display').innerText = user.email;
        document.getElementById('display-name').value = user.name;
        
        chargerMesSignalements(token);
    } else {
        window.location.href = 'login.html';
    }

    // --- FORMULAIRE MISE À JOUR ---
    const updateForm = document.getElementById('profil-form');
    if (updateForm) {
        updateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nom = document.getElementById('display-name').value;
            const quartier = document.getElementById('user-quartier').value;
            const token = localStorage.getItem('token');
            await mettreAJourProfil(nom, quartier, token);
        });
    }

    // --- DÉCONNEXION ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }

    // --- GESTION DES FILTRES ---
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Reset style des boutons
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.style.background = "#fff";
                b.style.color = b.style.borderColor; 
            });
            // Style bouton actif
            this.style.background = "#333";
            this.style.color = "#fff";
            
            const statut = this.getAttribute('data-status');
            console.log("Filtrage sur :", statut);
            afficherSignalementsFiltrés(statut);
        });
    });
});

// --- FONCTION API (Laravel PUT) ---
async function mettreAJourProfil(nom, quartier, token) {
    try {
        const response = await fetch('http://localhost:8000/api/user/update', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name: nom, quartier: quartier })
        });

        if (response.ok) {
            const user = JSON.parse(localStorage.getItem('user'));
            user.name = nom;
            localStorage.setItem('user', JSON.stringify(user));
            document.getElementById('user-name-display').innerText = nom;
            alert("✅ Profil mis à jour !");
        } else {
            alert("❌ Erreur serveur.");
        }
    } catch (e) { console.error(e); }
}

// --- CHARGEMENT DES SIGNALEMENTS ---
async function chargerMesSignalements(token) {
    try {
        const response = await fetch('http://localhost:8000/api/my-reports', {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        const res = await response.json();
        // On récupère les données soit dans res.data soit directement dans res
        tousLesRapports = res.data || res || [];
        afficherSignalementsFiltrés('all');
    } catch (e) { 
        console.error("Erreur API :", e); 
    }
}

function afficherSignalementsFiltrés(filtre) {
    const container = document.getElementById('my-reports-list');
    if (!container) return;
    container.innerHTML = "";

    const liste = filtre === 'all' ? tousLesRapports : tousLesRapports.filter(r => {
        const s = r.status ? r.status.toLowerCase() : "";
        if (filtre === 'pending') return s === 'pending' || s === 'en_attente';
        if (filtre === 'in_progress') return s === 'in_progress' || s === 'en_cours';
        if (filtre === 'resolved') return s === 'resolved' || s === 'resolu';
        return s === filtre;
    });

    if (liste.length === 0) {
        container.innerHTML = "<p class='text-center text-gray-500 py-4'>Aucun signalement trouvé.</p>";
        return;
    }

    liste.forEach(report => {
        let progress = "33%", color = "#f1c40f", statusText = "En attente";
        const s = report.status ? report.status.toLowerCase() : "";
        
        if (s === "in_progress" || s === "en_cours") { 
            progress = "66%"; color = "#3498db"; statusText = "En cours"; 
        } else if (s === "resolved" || s === "resolu") { 
            progress = "100%"; color = "#27ae60"; statusText = "Terminé"; 
        }

        const titre = report.title || report.titre || "Signalement";
        const titreNettoye = titre.split("Lat:")[0];

        container.innerHTML += `
            <div style="background:#fff; padding:15px; border-radius:10px; margin-bottom:15px; border-left:5px solid ${color}; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <p style="font-weight:bold; margin:0; color:#333;">📍 ${titreNettoye}</p>
                    <span style="font-size:10px; font-weight:bold; color:${color}; text-transform:uppercase; border:1px solid ${color}; padding:2px 6px; border-radius:10px;">${statusText}</span>
                </div>
                <p style="font-size:13px; color:#666; margin:10px 0;">${report.description || 'Pas de description'}</p>
                <div style="width:100%; background:#eee; height:8px; border-radius:10px; overflow:hidden; margin-top:10px;">
                    <div style="width:${progress}; background:${color}; height:100%; transition: width 0.5s;"></div>
                </div>
            </div>`;
    });
}
