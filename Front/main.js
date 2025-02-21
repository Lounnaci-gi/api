function showAlert(title, text, icon) {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonText: 'OK'
    });
}

const loginModal = document.querySelector("#loginModal");

function toggleMenu() {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('active');
}
// Fonction pour afficher le formulaire d'inscription
function showRegisterForm() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
}

// Fonction pour afficher le formulaire de connexion
function showLoginForm() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById('forgotPasswordForm').style.display = 'none';
}

// Fonction pour ouvrir le modal (connexion par défaut)
function openLogin() {
    loginModal.style.display = "block";
    showLoginForm(); // Afficher le formulaire de connexion par défaut
}

// Fonction pour fermer le modal
function closeLogin() {
    loginModal.style.display = "none";
}

document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault();

    const user = document.getElementById('user').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!user || !password) {
        showAlert('Erreur', 'Veuillez remplir tous les champs.', 'warning');
        return;
    }

    if (!navigator.onLine) {
     return  showAlert("Problème de connexion", "Vous êtes hors ligne.", "error");
    }

    const datas = { nomUtilisateur: user, motDePasse: password };

    try {
        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datas),
        });

        const result = await response.json();
        console.log("📌 Réponse du serveur :", result); // 🔥 Ajout pour voir la réponse complète

        if (!response.ok) {
            throw new Error(result.message || "Erreur lors de la connexion.");
        }

        if (!result.accessToken) {
            throw new Error("Token non reçu, problème d'authentification.");
        }

        // ✅ Stocker les tokens
        localStorage.setItem("token", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);

        document.getElementsByClassName('logo')[0].innerText = result.data.nomUtilisateur;
        closeLogin();
        document.getElementById('connexion').reset();

    } catch (err) {
        showAlert("Erreur de connexion", err.message || 'Échec de l’authentification.', "error");
    }
});



// Fonction inscription nouveau utilistaeur
document.getElementById('inscrire').addEventListener('click', async function (event) {
    event.preventDefault(); // Empêcher l'envoi du formulaire par défaut
    const nomComplet = document.querySelector("input[name='nomComplet']").value.trim();
    const nomUtilisateur = document.querySelector("input[name='nomUtilisateurs']").value.trim();
    const email = document.querySelector("input[name='email']").value.trim();
    const password = document.querySelector("input[name='motDePasse']").value.trim();
    const confirmPasswordInput = document.querySelector("input[placeholder='Confirmer le mot de passe']");
    const confirmPassword = confirmPasswordInput.value.trim();

    // Vérifier si tous les champs sont remplis
    if (!nomComplet || !nomUtilisateur || !email || !password || !confirmPassword) {
        showAlert("Erreur", 'Veuillez remplir tous les champs.', "error");
        return;
    }

    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
        showAlert("Attention", 'Les mots de passe ne correspondent pas.', "warning");
        confirmPasswordInput.value = "";
        confirmPasswordInput.focus(); // Remettre le focus sur le champ
        return;
    }

    // Création de l'objet de données à envoyer
    const datas = {
        nomComplet: nomComplet,
        nomUtilisateur: nomUtilisateur,
        email: email,
        motDePasse: password
    };

    try {
        const response = await fetch('http://localhost:3000/users/newuser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datas),
        });

        const result = await response.json();

        if (response.ok) {
            showAlert("Succès", 'Inscription réussie !', "success")
                .then(() => {
                    closeLogin(); // Fermer le formulaire si nécessaire
                });
        } else {
            showAlert("Erreur", result.message || `Erreur lors de l'inscription.`, "error");
        }
    } catch (err) {
        showAlert("Erreur", `Une erreur s\'est produite lors de la récupération des données.`, "error");
    }
});


// Afficher le formulaire de récupération de mot de passe
function showForgotPassword() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'block';
}

// Envoyer la demande de réinitialisation
async function sendPasswordReset() {
    const email = document.getElementById('emailReset').value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !emailRegex.test(email)) {
        showAlert("Attention", !email ? 'Veuillez entrer une adresse e-mail.' : 'Veuillez entrer une adresse e-mail valide.', "warning");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/users/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Erreur lors de la réinitialisation.");
        }
        showAlert("Succès", `Un e-mail de réinitialisation a été envoyé à ${result.email}. Veuillez vérifier votre boîte de réception.`, "success");
        showLoginForm();

    } catch (err) {
        showAlert("Erreur", 'E-mail non envoyé', "error");
        return;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Vérifier si l'utilisateur est déjà hors ligne au chargement
    if (!navigator.onLine) {
        showAlert("Problème de connexion", "Vous êtes hors ligne.", "error");
    }

    // Événements pour détecter la perte et le retour de connexion
    window.addEventListener('offline', () => {
        showAlert("Problème de connexion", "Vous êtes hors ligne.", "error");
    });

    window.addEventListener('online', () => {
        showAlert("Connexion rétablie", "Vous êtes de nouveau en ligne.", "success");
    });
});


//-------------------
function openLogin() {
    const token = localStorage.getItem("token");

    if (token) {
        // 🔄 Si déjà connecté, alors on déconnecte
        handleLogout();
    } else {
        // 🔑 Sinon, ouvrir la boîte de connexion
        loginModal.style.display = "block";
        showLoginForm(); // Assurer que le formulaire de connexion est affiché
    }
}

function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showAlert("Déconnexion", "Vous avez été déconnecté.", "info").then(() => {
        updateLoginButton(); // 🔄 Mettre à jour immédiatement
        window.location.reload(); // 🔄 Recharge la page pour appliquer les changements
    });
}


function updateLoginButton() {
    const loginButton = document.getElementById("loginButton");
    const logo = document.querySelector(".logo"); // 🔥 Sélection du logo
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); // 🔥 Récupérer l'utilisateur stocké

    if (!loginButton || !logo) return; // 🔥 Vérifie que les éléments existent

    if (token && user) {
        loginButton.textContent = "Déconnexion";
        loginButton.onclick = handleLogout;

        // 🔥 Afficher le nom d'utilisateur dans le logo
        logo.textContent = user.nomUtilisateur || "Utilisateur";
    } else {
        loginButton.textContent = "Login";
        loginButton.onclick = openLogin;

        // 🔄 Remettre le logo à son état initial
        logo.textContent = "Logo";
    }
}

// 🔄 Mettre à jour le bouton et le logo au chargement de la page
document.addEventListener("DOMContentLoaded", updateLoginButton);

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        console.log("Aucun Refresh Token trouvé.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/users/refresh-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });

        if (!response.ok) {
            throw new Error("Échec du rafraîchissement du token.");
        }

        const data = await response.json();
        localStorage.setItem("token", data.accessToken);
        console.log("✅ Token rafraîchi avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors du rafraîchissement du token :", error);
    }
}

// 📌 Rafraîchir le token toutes les 55 minutes (avant expiration de 1h)
setInterval(refreshAccessToken, 55 * 60 * 1000);


