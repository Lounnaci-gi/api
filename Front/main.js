const btn = document.getElementById('btn');

btn.addEventListener('click', async () => {
    try {
        const response = await fetch("http://www.localhost:3000/users", { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const posts = await response.json();
        const count = posts.length;
        alert(`Nombre d'enregistrements : ${count}`);

    }
    catch (error) {
        console.error("Erreur :", error);
        alert("Une erreur s'est produite lors de la récupération des données.");
    }

});