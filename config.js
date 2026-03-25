const BASE_URL = "http://localhost:8000/api";

async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    // On prépare les headers par défaut
    const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    // Si on a un token, on l'ajoute automatiquement
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers // Permet d'écraser si besoin
        }
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Si le token est expiré (401), on déconnecte direct
    if (response.status === 401) {
        localStorage.clear();
        window.location.href = 'login.html';
    }

    return response;
}
