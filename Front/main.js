const btn = document.getElementById('btn');

btn.addEventListener('click', async () => {
    try {
        const response = await fetch("http://www.localhost:3000/users", { method: 'GET' });
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