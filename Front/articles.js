//Enregistre les données de l'article
document.querySelector(".btn").addEventListener('click', async (event) => {
    event.preventDefault();  // Empêcher le rechargement de la page
    const datas = {
        designation: document.getElementById("nom_article").value,
        unite: document.getElementById("unite").value,
        diametre: document.getElementById("diametre").value,
        rubrique: document.getElementById("rubrique").value,
        materiau: document.getElementById("materiau").value,
        prix: getPrixData() // ✅ Ajouter les prix
    };
    const token = sessionStorage.getItem("token");
    if (!token) {
        showAlert("Erreur", "Vous devez être connecté.", "error");
        return;
    }
    const response = await fetch('http://localhost:3000/users/ajout_article', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datas)
    });
    const result = await response.json();

    if (response.ok) {
        Swal.fire("Succès", "Article ajouté avec succès", "success");
    } else {
        Swal.fire("Erreur", result.message || "Une erreur est survenue", "error");
    }
});

//Remplire les prix 
function getPrixData() {
    return [
        {
            annee: new Date().getFullYear(),  // ✅ Corrigé
            prix_fourniture: parseFloat(document.getElementById("prix_achat").value) || null,
            prix_pose: parseFloat(document.getElementById("prix_vente").value) || null
        }
    ];
}


