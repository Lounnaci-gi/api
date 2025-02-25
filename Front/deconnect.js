function showAlert(title, text, icon) {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: "OK"
    });
}

let logoutTimer; 

function resetTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        showAlert("Déconnexion", "Votre session a expiré pour inactivité.", "info").then(() => {
            window.location.href = "index.html"; // 🔄 Redirige vers la page de connexion
        });
    }, 15 * 60 * 1000); // ⏳ Déconnecte après 15 minutes d'inactivité
}

// 🔄 Réinitialise le timer à chaque activité de l’utilisateur
window.onload = resetTimer;
document.addEventListener("mousemove", resetTimer);
document.addEventListener("keypress", resetTimer);
document.addEventListener("click", resetTimer);
document.addEventListener("scroll", resetTimer);


