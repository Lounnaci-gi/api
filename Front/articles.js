//Enregistre les données de l'article
const rubriqueMapping = {
    "pieces_speciales": "pièces spéciales",
    "canalisations": "canalisations",
    "terrassement": "terrassement",
    "cautionnements": "cautionnements",
    "autres": "autres"
};
document.querySelector(".btn").addEventListener('click', async (event) => {
    event.preventDefault();  // Empêcher le rechargement de la page

    const token = sessionStorage.getItem("token");
    if (!token) {
        showAlert("Erreur", "Vous devez être connecté.", "error");
        return;
    }

    const rubriqueValue = document.getElementById("rubrique").value;

    const datas = {
        designation: document.getElementById("nom_article").value,
        unite: document.getElementById("unite").value,
        diametre: document.getElementById("diametre").value || null,
        rubrique: rubriqueMapping[rubriqueValue] || rubriqueValue,  // ✅ Convertir avant envoi
        materiau: document.getElementById("materiau").value,
        prix: getPrixData()
    };

   
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
            date_application: new Date().toISOString(), // ✅ Ajout de la date d'application
            prix_achat_ht: parseFloat(document.getElementById("prix_achat").value) || null,
            prix_fourniture: parseFloat(document.getElementById("prix_forniture").value) || null,
            prix_pose: parseFloat(document.getElementById("prix_pose").value) || null
        }
    ];
}




