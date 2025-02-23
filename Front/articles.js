document.querySelector(".btn").addEventListener('click', async () => {
    const datas = {
        nom_article: document.querySelector('.nom_article').value,
        unite: document.getElementById("unite").value,
        diametre: document.getElementById("diametre").value,
        type_materiau: document.getElementById("materiau").value,
        rubrique: document.getElementById("rubrique").value
    }

    const token = sessionStorage.getItem("token"); // 🔥 Récupérer le token
    if (!token) {
        showAlert("Erreur", "Vous devez être connecté.", "error");
        return;
    }
    const response = await fetch('http://localhost:3000/users/ajout_article', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`, // ✅ Ajouter le token
            'Content-Type': 'application/json' // 🔥 Ajouter `Content-Type
        },
        body: JSON.stringify(datas)
    });
    console.log(await response.json());
});