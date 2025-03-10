function vider_formulaire_inscreption(identifiant) {
    // Vérifier si l'élément existe
    const formulaire = document.getElementById(identifiant);
    if (!formulaire) {
        console.error("L'élément avec l'identifiant", identifiant, "n'existe pas.");
        return;
    }

    // Vider tous les champs input
    formulaire.querySelectorAll('input').forEach(input => {
        input.value = ""; // Vider la valeur de l'input
    });

    // Réinitialiser le select avec l'id 'role'
    const roleSelect = document.getElementById('role');
    if (roleSelect) {
        roleSelect.selectedIndex = 0; // Réinitialiser à la première option
    } else {
        console.error("L'élément avec l'id 'role' n'existe pas.");
    }
}

function showAlert(title, text, icon) {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonText: 'OK'
    });
}

//-----------------
const loginModal = document.querySelector("#loginModal");

function toggleMenu() {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('active');
}
// Fonction pour afficher le formulaire d'inscription
function showRegisterForm() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
    vider_formulaire_inscreption('registerForm');
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
    event.preventDefault(); // Empêche la soumission du formulaire
    const user = document.getElementById('user').value.trim();
    const password = document.getElementById('password').value.trim();

    // Vérification des champs vides
    if (!user || !password) {
        showAlert('Erreur', 'Veuillez remplir tous les champs.', 'warning');
        return;
    }

    if (!navigator.onLine) {
        return showAlert("Problème de connexion", "Vous êtes hors ligne.", "error");
    }

    Swal.fire({
        title: 'Connexion en cours...',
        html: 'Veuillez patienter...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    const datas = { nomUtilisateur: user, motDePasse: password };

    try {
        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datas),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Erreur lors de la connexion.");
        }

        if (!result.token) {
            throw new Error("Token non reçu, problème d'authentification.");
        }


        // Vérification si les données retournées sont valides
        if (!result.data || !result.data.nomUtilisateur) {
            throw new Error("Données utilisateur invalides.");
        }

        // 🔥 Stocker le token et les informations utilisateur dans `sessionStorage`
        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('user', JSON.stringify(result.data));

        Swal.close();
        // Afficher le nom d'utilisateur sans guillemets
        showAlert("Succès", "Connexion réussie !", "success").then(() => {
            updateLoginButton();  // 🔥 Mettre à jour le bouton immédiatement
            closeLogin();  // 🔥 Fermer la boîte de connexion
        });


        // Réinitialiser les champs du formulaire
        document.getElementById('connexion').reset();

    } catch (err) {
        showAlert("Erreur de connexion", err.message || 'Échec de l’authentification.', "error");
    }
});


// Fonction inscription nouveau utilistaeur
document.getElementById('inscrire').addEventListener('click', async function (event) {
    event.preventDefault();
    const btnInscrire = document.getElementById('inscrire');
    btnInscrire.disabled = true; // Désactiver le bouton pour éviter le double envoi 
    
    const nomComplet = document.querySelector("input[name='nomComplet']").value.trim();
    const nomUtilisateur = document.querySelector("input[name='nomUtilisateurs']").value.trim(); // ✅ Correction ici
    const email = document.querySelector("input[name='email']").value.trim();
    const password = document.querySelector("input[name='motDePasse']").value.trim();
    const confirmPasswordInput = document.querySelector("input[name='confirmMotDePasse']"); // ✅ Correction ici
    const confirmPassword = confirmPasswordInput.value.trim();
    const role = document.querySelector("select[name='role']").value; // ✅ Ajout du rôle
    const secretCode = document.getElementById('code_secret').value.trim();

    // Vérifier si tous les champs sont remplis
    if (!nomComplet || !nomUtilisateur || !email || !password || !confirmPassword) {
        btnInscrire.disabled = false; // Réactiver le bouton en cas d'erreur
        showAlert("Erreur", 'Veuillez remplir tous les champs.', "error");
        return;
    }

    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
        btnInscrire.disabled = false; // Réactiver le bouton
        showAlert("Attention", 'Les mots de passe ne correspondent pas.', "warning");
        password.focus();
        return;
    }
    
    // Afficher un indicateur de chargement
    Swal.fire({
        title: 'Inscription en cours...',
        html: 'Veuillez patienter...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Création de l'objet de données à envoyer
    const datas = {
        nomComplet,
        nomUtilisateur,
        email,
        motDePasse: password,
        role, // ✅ Ajout du rôle
        secretCode
    };


    try {
        const response = await fetch('http://localhost:3000/users/newuser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datas),
        });

        const result = await response.json();

        if (response.ok) {
            Swal.close();
            showAlert("Succès", 'Inscription réussie !', "success")
                .then(() => {
                    closeLogin(); // Fermer le formulaire
                });
                document.getElementById('code_secret').style.display = 'none';
                document.getElementById('code_secret').value = "";
        } else {
            // 🔥 Afficher les erreurs de validation du backend
            const errorMessage = result.errors
                ? result.errors.map(err => `• ${err.msg}`).join("\n") // 🔥 Ajoute une puce `•` pour chaque erreur
                : result.message || "Erreur lors de l'inscription.";

            showAlert("Erreur", errorMessage, "error");
            // showAlert("Erreur", result.message || `Erreur lors de l'inscription.`, "error");
            btnInscrire.disabled = false; // ✅ Réactiver le bouton si erreur serveur
        }
    } catch (err) {
        console.error("Erreur de requête :", err);
        showAlert("Erreur", `Une erreur s'est produite : ${err.message}`, "error");
    }
    btnInscrire.disabled = false; // ✅ Réactiver le bouton en cas d'erreur réseau

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

//-------------------
function openLogin() {
    const token = sessionStorage.getItem("token");

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
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    showAlert("Déconnexion", "Vous avez été déconnecté.", "info").then(() => {
        updateLoginButton(); // 🔄 Mettre à jour immédiatement
        window.location.reload(); // 🔄 Recharge la page pour appliquer les changements
    });
}


function updateLoginButton() {
    const loginButton = document.getElementById("loginButton");
    const logo = document.querySelector(".logo"); // 🔥 Sélection du logo
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user")); // 🔥 Récupérer l'utilisateur stocké

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


document.getElementById('role').addEventListener('change', () => {
    if (document.getElementById('role').value === 'admin') {
        document.getElementById('code_secret').style.display = 'block';
        document.getElementById('code_secret').required = true;
    } else {
        document.getElementById('code_secret').style.display = 'none';
        document.getElementById('code_secret').required = false;
        document.getElementById('code_secret').value = "";
    }
})

