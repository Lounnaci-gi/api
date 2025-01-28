const btn = document.getElementById('btn');

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

// Fonction pour ouvrir le modal
function openLogin() {
    document.getElementById("loginModal").style.display = "block";
}

// Fonction pour fermer le modal
function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

// Fermer le modal si on clique en dehors
window.onclick = function(event) {
    const modal = document.getElementById("loginModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
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

// Fermer le modal si on clique en dehors
window.onclick = function(event) {
    const modal = document.getElementById("loginModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}