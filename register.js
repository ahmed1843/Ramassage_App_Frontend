const registerForm = document.getElementById("register-form");
const registerConfirmation = document.getElementById("register-confirmation");

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');

emailInput.addEventListener('input', () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(emailInput.value)) {
        emailError.classList.remove('hidden');
        emailInput.style.borderColor = 'red';
    } else {
        emailError.classList.add('hidden');
        emailInput.style.borderColor = '#27ae60';
    }
});


    const errorBox = document.getElementById('error-message');
    
    // Préparation des données pour Laravel
    const userData = {
        name: document.getElementById('prenom').value + " " + document.getElementById('nom').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('telephone').value,
        password: document.getElementById('password').value,
        password_confirmation: document.getElementById('password').value // Laravel le demande souvent
    };

    try {
        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            // Inscription réussie !
            document.getElementById('register-form').classList.add('hidden');
            document.getElementById('register-confirmation').classList.remove('hidden');
            
            // On connecte l'utilisateur automatiquement
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            setTimeout(() => { window.location.href = 'index.html'; }, 2000);
        } else {
            // Affichage de l'erreur précise (ex: email déjà pris)
            errorBox.innerText = "❌ " + (data.message || "Erreur d'inscription");
            errorBox.classList.remove('hidden');
        }
    } catch (error) {
        errorBox.innerText = "❌ Serveur inaccessible";
        errorBox.classList.remove('hidden');
    }
});
