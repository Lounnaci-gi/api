document.addEventListener("DOMContentLoaded", function () {
    const token = sessionStorage.getItem("token");
    // 🔍 Vérifier si la page est index.html
    const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    
    if (!isIndexPage) {
        // ✅ Empêcher l'accès aux pages protégées si pas de token
        if (!token) {
            window.location.href = "index.html";
        } else {
            document.body.style.display = "block"; // ✅ Afficher la page uniquement si l'utilisateur est connecté
            resetTimer(); // 🔥 Active le timer d'inactivité si l'utilisateur est connecté
        }
    } else {
        document.body.style.display = "block"; // ✅ Afficher la page uniquement si l'utilisateur est connecté
        // ✅ Si on est sur index.html, on vérifie juste l'inactivité sans redirection
        resetTimer();
    }
});

let logoutTimer;

function resetTimer() {
    // ✅ Vérifier si le token existe encore avant d'afficher l'alerte
    if (!sessionStorage.getItem("token")) {
        return; // ⛔ Stopper l'exécution ici
    }
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        showAlert("Déconnexion", "Votre session a expiré pour inactivité.", "info").then(() => {
            window.location.href = "index.html"; // 🔄 Redirige immédiatement vers la page de connexion
        });
    }, 15 * 60 * 1000); // ⏳ Déconnecte après 15 minutes d'inactivité
}


// 🔄 Réinitialise le timer à chaque activité de l’utilisateur
document.addEventListener("mousemove", resetTimer);
document.addEventListener("keypress", resetTimer);
document.addEventListener("click", resetTimer);
document.addEventListener("scroll", resetTimer);

// 🔔 Fonction d'alerte globale
function showAlert(title, text, icon) {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: "OK"
    });
}


//Vérification de la connexion
document.addEventListener("DOMContentLoaded", () => {
    // Vérifier si l'utilisateur est déjà hors ligne au chargement
    if (!navigator.onLine) {
        showAlert("Problème de connexion", "Vous êtes hors ligne.", "error");
    }

    // Événements pour détecter les changements de connexion en temps réel
    window.addEventListener('offline', () => {
        showAlert("Problème de connexion", "Vous êtes hors ligne.", "error");
    });

    window.addEventListener('online', () => {
        showAlert("Connexion rétablie", "Vous êtes de nouveau en ligne.", "success");
    });
});