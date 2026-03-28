const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('login-error');

        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // 1. ON SAUVEGARDE LES INFOS DANS LE NAVIGATEUR
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // 2. REDIRECTION VERS L'ACCUEIL
                window.location.href = 'index.html';
            } else {
                errorMsg.innerText = data.message || "Identifiants incorrects";
                errorMsg.style.display = 'block';
            }
        } catch (error) {
            console.error("Erreur Login:", error);
            alert("Serveur inaccessible");
        }
    });
}
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    // On bascule le type
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    
    // On change l'icône (facultatif mais pro)
    this.textContent = type === 'password' ? '👁️' : '🙈';
});

