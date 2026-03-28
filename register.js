// 1. GESTION NOM ET PRÉNOM (Messages spécifiques sous les champs)
const prenomInput = document.getElementById('prenom');
const nomInput = document.getElementById('nom');

const verifierSaisieTexte = (e, errorElementId, typeLabel) => {
    const errorSpan = document.getElementById(errorElementId);
    const regexChiffres = /[0-9]/;
    const val = e.target.value;

    if (regexChiffres.test(val)) {
        // Affiche le message personnalisé sous le champ
        errorSpan.innerText = `⚠️ Il semble que vous ayez entré un numéro ou un e-mail. Veuillez entrer votre ${typeLabel}.`;
        errorSpan.style.display = 'block';
        
        // Supprime le chiffre pour forcer le texte
        e.target.value = val.replace(/[0-9]/g, '');
        e.target.style.borderColor = '#e74c3c';
    } else {
        errorSpan.style.display = 'none';
        e.target.style.borderColor = '#eee';
    }
};

if (prenomInput && nomInput) {
    prenomInput.addEventListener('input', (e) => verifierSaisieTexte(e, 'error-prenom', 'prénom'));
    nomInput.addEventListener('input', (e) => verifierSaisieTexte(e, 'error-nom', 'nom'));
}

// 2. GESTION DE L'EMAIL (Validation en temps réel)
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('input', () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.length > 0 && !regex.test(emailInput.value)) {
            emailInput.style.borderColor = '#e74c3c';
        } else {
            emailInput.style.borderColor = '#2ecc71';
        }
    });
}

// 3. JAUGE DE FORCE DU MOT DE PASSE (8 car. + Maj + Chiffre + Symbole)
const passwordInput = document.getElementById('password');
const strengthContainer = document.getElementById('password-strength-container');
const bars = [document.getElementById('bar-1'), document.getElementById('bar-2'), document.getElementById('bar-3')];
const strengthText = document.getElementById('strength-text');

if (passwordInput) {
    passwordInput.addEventListener('input', function() {
        const val = this.value;
        let score = 0;
        let conseils = [];

        if (val.length === 0) {
            strengthContainer.style.display = 'none';
            return;
        }
        strengthContainer.style.display = 'block';

        if (val.length >= 8) { score++; } else { conseils.push("8 car. min."); }
        if (/[0-9]/.test(val)) { score++; } else { conseils.push("chiffre"); }
        if (/[A-Z]/.test(val)) { score++; } else { conseils.push("majuscule"); }
        if (/[^A-Za-z0-9]/.test(val)) { score++; } else { conseils.push("symbole"); }

        const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'];
        const labels = ['Très faible 🔴', 'Faible 🟠', 'Moyen 🟡', 'Fort ! 🟢'];
        const ratio = Math.floor((score / 4) * 3);
        
        bars.forEach((bar, i) => {
            bar.style.background = (i < ratio || (score === 4)) ? colors[score - 1] : '#eee';
        });

        const texteConseil = (score < 4 && conseils.length > 0) ? ` (Ajoutez : ${conseils.join(', ')})` : "";
        strengthText.textContent = labels[score - 1] + texteConseil;
        strengthText.style.color = colors[score - 1] || '#95a5a6';
    });
}

// 4. AFFICHER/MASQUER LE MOT DE PASSE
const toggleBtn = document.getElementById('togglePassword');
if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '🙈';
    });
}

// 5. ENVOI DU FORMULAIRE À L'API LARAVEL
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.getElementById('error-message');
    
    const userData = {
        name: prenomInput.value + " " + nomInput.value,
        email: emailInput.value,
        phone: document.getElementById('telephone').value,
        password: passwordInput.value,
        password_confirmation: passwordInput.value 
    };

    try {
        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('register-form').classList.add('hidden');
            document.getElementById('register-confirmation').classList.remove('hidden');
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setTimeout(() => { window.location.href = 'index.html'; }, 2000);
        } else {
            errorBox.innerText = "❌ " + (data.message || "Erreur d'inscription");
            errorBox.classList.remove('hidden');
        }
    } catch (error) {
        errorBox.innerText = "❌ Serveur inaccessible";
        errorBox.classList.remove('hidden');
    }
});
