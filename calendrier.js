document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.getElementById('calendar-body');
    const zoneInfo = document.getElementById('zone-info');
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await apiFetch('/zones');
        const json = await response.json();
        const zones = json.data || json;

        // --- CORRECTION SÉCURISÉE ---
        // On cherche "Médina" sans risquer de plantage si z.nom est absent
        const maZone = zones.find(z => {
            const nom = (z.nom || z.name || "").toLowerCase();
            return nom.includes("médina");
        }) || zones[0];

        // On récupère les horaires (que ce soit 'horaires' ou 'schedules')
        const planning = maZone.horaires || maZone.schedules || [];

        if (maZone && planning.length > 0) {
            zoneInfo.innerText = `Secteur : ${maZone.nom || maZone.name}`;
            
            // --- BONUS : JOUR ACTUEL ---
            const joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            const aujourdhui = joursSemaine[new Date().getDay()];

    tableBody.innerHTML = planning.map(h => {
    // On teste toutes les possibilités de clés envoyées par le Backend
    const jour = h.jour || h.collection_day || "Jour inconnu";
   // Remplace h.debut et h.fin par ceci :
const debut = (h.debut || h.start_time || "").substring(0, 5); // Garde "08:00"
const fin = (h.fin || h.end_time || "").substring(0, 5);       // Garde "09:00"

    return `
        <tr>
            <td style="font-weight:bold;">${jour}</td>
            <td>${debut} - ${fin}</td>
        </tr>
    `;
}).join('');

            
        } else {
            tableBody.innerHTML = "<tr><td colspan='2'>Aucun horaire disponible pour cette zone.</td></tr>";
        }

    } catch (error) {
        console.error("Erreur calendrier:", error);
        tableBody.innerHTML = "<tr><td colspan='2' style='color:red;'>Erreur de chargement.</td></tr>";
    }
});
