const btn = document.getElementById('btn');

btn.addEventListener('click', async () => {
    try {
        const response = await fetch("http://www.localhost:3000/users", { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const posts = await response.json();
        const count = posts.length;

        const ttable = document.getElementById("table");
        ttable.innerHTML = `
          <tr>
            <th>ID_Client</th>
            <th>Raison Sociale</th>
            <th>Adresse</th>
            <th>Email</th>
          </tr>`;
        posts.forEach(e => {
            const row = document.createElement("tr");
            row.innerHTML = `
                        <td>${e.Id_Client}</td>
                        <td>${e.raison_sociale}</td>
                        <td>${e.Adresse}</td>
                        <td>${e.email}</td>
                        `;
            ttable.appendChild(row);
        });


    }
    catch (error) {
        console.error("Erreur :", error);
        alert("Une erreur s'est produite lors de la récupération des données.");
    }

});