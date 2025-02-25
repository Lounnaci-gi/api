document.addEventListener("DOMContentLoaded", function () {
    const token = sessionStorage.getItem("token");

    // 🔍 Vérifier si on est sur index.html
    const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

    if (!isIndexPage) { 
        // ✅ Empêche l'accès aux pages protégées si pas de token
        if (!token) {
            window.location.href = "index.html"; 
        } else {
            resetTimer(); // 🔥 Active le timer d'inactivité si l'utilisateur est connecté
        }
    }
});

let logoutTimer; 

function resetTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        showAlert("Déconnexion", "Votre session a expiré pour inactivité.", "info").then(() => {
            window.location.href = "index.html"; 
        });
    }, 15 * 60 * 1000); 
}

// 🔄 Réinitialise le timer à chaque activité de l’utilisateur uniquement si ce n'est pas `index.html`
if (!window.location.pathname.endsWith("index.html") && window.location.pathname !== "/") {
    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keypress", resetTimer);
    document.addEventListener("click", resetTimer);
    document.addEventListener("scroll", resetTimer);
}

// 🔔 Fonction d'alerte globale
function showAlert(title, text, icon) {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: "OK"
    });
}
