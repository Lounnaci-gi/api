const btn = document.getElementById('btn');

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
    document.getElementById("loginModal").style.display = "block";
    showLoginForm(); // Afficher le formulaire de connexion par défaut
}

// Fonction pour fermer le modal
function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault(); // Empêche la soumission du formulaire

    const user = document.getElementById('user').value.trim();
    const password = document.getElementById('password').value.trim();

    // Vérification des champs vides
    if (!user || !password) {
        Swal.fire({
            title: 'Erreur',
            text: 'Veuillez remplir tous les champs.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    const datas = { nomUtilisateur: user, motDePasse: password };

    try {
        const response = await fetch('http://localhost:3000/users/getuser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datas),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Erreur lors de la connexion.");
        }

        // Vérification si les données retournées sont valides
        if (!result.data || !result.data.nomUtilisateur) {
            throw new Error("Données utilisateur invalides.");
        }

        // Afficher le nom d'utilisateur sans guillemets
        document.getElementsByClassName('logo')[0].innerText = result.data.nomUtilisateur;
        closeLogin();

        // Réinitialiser les champs du formulaire
        document.getElementById('connexion').reset();

    } catch (err) {
        Swal.fire({
            title: 'Erreur de connexion',
            text: err.message || 'Échec de l’authentification.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
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
        Swal.fire({
            title: 'Erreur',
            text: 'Veuillez remplir tous les champs.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
        Swal.fire({
            title: 'Attention',
            text: 'Les mots de passe ne correspondent pas.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
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
            Swal.fire({
                title: 'Succès',
                text: 'Inscription réussie !',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                closeLogin(); // Fermer le formulaire si nécessaire
            });
        } else {
            Swal.fire({
                title: 'Erreur',
                text: result.message || 'Erreur lors de l\'inscription.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } catch (err) {
        Swal.fire({
            title: 'Erreur',
            text: 'Une erreur s\'est produite lors de la récupération des données.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
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
        Swal.fire({
            title: 'Attention',
            text: !email ? 'Veuillez entrer une adresse e-mail.' : 'Veuillez entrer une adresse e-mail valide.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
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

        Swal.fire({
            title: 'E-mail envoyé',
            text: 'Veuillez vérifier votre boîte de réception.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        showLoginForm();

    } catch (err) {
        Swal.fire({
            title: 'E-mail non envoyé',
            text: err.message || 'Erreur lors de la connexion au serveur.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}