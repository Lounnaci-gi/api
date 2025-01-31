const btn = document.getElementById('btn');
/*
btn.addEventListener('click', async () => {
    try {
        const response = await fetch("http://localhost:3000/users", { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const posts = await response.json();
        const count = posts.length;
        let i = 1;
        const ttable = document.getElementById("table");
        ttable.innerHTML = `
        <thead>  
        <tr>
            <th>#</th>
            <th>ID_Client</th>
            <th>Raison Sociale</th>
            <th>Adresse</th>
            <th>Email</th>
        </tr>
        </thead>`;
        const tbody = document.createElement('tbody');

        posts.forEach(e => {
            const row = document.createElement("tr");
            row.innerHTML = `
                        <td>${i++}</td>
                        <td>${e.Id_Client}</td>
                        <td>${e.raison_sociale}</td>
                        <td>${e.Adresse}</td>
                        <td>${e.email}</td>
                        `;
            tbody.appendChild(row);
            ttable.appendChild(tbody);
        });


    }
    catch (error) {
        console.error("Erreur :", error);
        alert("Une erreur s'est produite lors de la récupération des données.");
    }

});
*/
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
/*
// Fonction login
document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault(); // Empêche la soumission du formulaire

    const user = document.getElementById('user').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!user || !password) {
        alert("Veuillez remplir tous les champs.");
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

        if (response.ok) {
            // Afficher le nom d'utilisateur sans guillemets
            document.getElementsByClassName('logo')[0].innerText = result.data.nomUtilisateur;
            closeLogin();
            document.getElementById('user').value = "";
            document.getElementById('password').value = "";
        } else {
            alert(result.message || "Erreur lors de la connexion.");
        }
    } catch (err) {
        alert("Une erreur s'est produite lors de la récupération des données.");
    }
});
*/
document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault(); // Empêche la soumission du formulaire

    const user = document.getElementById('user').value.trim();
    const password = document.getElementById('password').value.trim();

    // Vérification des champs vides
    if (!user || !password) {
        showLoginError();
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
        document.getElementById('user').value = "";
        document.getElementById('password').value = "";

    } catch (err) {
        showLoginError(); // Fait vibrer la boîte en cas d'échec
    }
});

function showLoginError() {
    const loginModal = document.querySelector('.modal-content'); // Sélection de la boîte de connexion

    if (loginModal) {
        loginModal.classList.add('shake'); // Ajoute l’animation

        setTimeout(() => {
            loginModal.classList.remove('shake'); // Retire l’animation après 400ms
            document.getElementById('user').value = "";
            document.getElementById('password').value = "";
        }, 400);
    }
}



// Fonction inscription nouveau utilistaeur

document.getElementById('inscrire').addEventListener('click',  async function (event) {
    const nomComplet = document.querySelector("input[name='nomComplet']").value.trim();
    const nomUtilisateur = document.querySelector("input[name='nomUtilisateurs']").value.trim();
    const email = document.querySelector("input[name='email']").value.trim();
    const password = document.querySelector("input[name='motDePasse']").value.trim();
    const confirmPassword = document.querySelector("input[placeholder='Confirmer le mot de passe']").value.trim();
    if (!password || !confirmPassword) {
        alert("Veuillez remplir tous les champs.");
    } else if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas.");
        document.querySelector("input[placeholder='Confirmer le mot de passe']").value = "";
        confirmPassword.focus();
        event.preventDefault(); // Bloquer l'envoi du formulaire
    }
    const datas = { nomComplet: nomComplet, nomUtilisateur: nomUtilisateur, email: email, motDePasse: password };
    
        try {
            const response = await fetch('http://localhost:3000/users/newuser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datas),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                closeLogin();
            } else {
                alert(result.message || "Erreur lors de la connexion.");
            }
        } catch (err) {
            alert("Une erreur s'est produite lors de la récupération des données.");
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

    if (!email) {
        alert("Veuillez entrer une adresse e-mail.");
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

        alert("Un e-mail de réinitialisation a été envoyé.");
        showLoginForm();

    } catch (err) {
        alert(err.message);
    }
}