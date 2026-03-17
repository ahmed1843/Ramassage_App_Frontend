// auth-guard.js
(function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // Si l'utilisateur n'est pas connecté, on le renvoie au login
    if (isLoggedIn !== "true") {
        alert("Veuillez vous connecter pour accéder à cette page.");
        window.location.href = "login.html";
    }
})();
