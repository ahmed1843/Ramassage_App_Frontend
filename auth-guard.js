async function checkAuth() {
    const token = localStorage.getItem('token');
    const isLoginPage = window.location.pathname.includes('login.html');

    if (!token && !isLoginPage) {
        window.location.href = 'login.html';
        return;
    }

    if (token) {
        try {
            // On demande au backend : "Ce token appartient-il toujours à quelqu'un ?"
            const response = await fetch('http://localhost:8000/api/user', {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });

            if (!response.ok) throw new Error("Session expirée");
            
            // Si on est sur login mais déjà validé, on va à l'accueil
            if (isLoginPage) window.location.href = 'index.html';

        } catch (error) {
            localStorage.clear();
            if (!isLoginPage) window.location.href = 'login.html';
        }
    }
}
checkAuth();
