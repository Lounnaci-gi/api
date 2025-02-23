// Enregistre les données de l'article
const rubriqueMapping = {
    "pieces_speciales": "pièces spéciales",
    "canalisations": "canalisations",
    "terrassement": "terrassement",
    "cautionnements": "cautionnements",
    "autres": "autres"
};

document.getElementById("articleForm").addEventListener('submit', async (event) => {
    event.preventDefault();  // Empêcher le rechargement de la page
    const token = sessionStorage.getItem("token");
    if (!token) {
        showAlert("Erreur", "Vous devez être connecté.", "error");
        return;
    }
    console.log(getPrixData());
    const datas = {
        designation: document.getElementById("designation").value,
        unite: document.getElementById("unite").value,
        diametre: document.getElementById("diametre").value || null,
        rubrique: document.getElementById("rubrique").value,
        materiau: document.getElementById("materiau").value,
        prix: getPrixData(),
        caracteristiques: getCaracteristiquesData()
    };

    // Utiliser l'endpoint correct
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

function getPrixData() {
    return [{
        date_application: new Date().toISOString(),
        prix_achat_ht: parseFloat(document.getElementById("prix_achat_ht").value) || 0,
        prix_fourniture: parseFloat(document.getElementById("prix_fourniture").value) || 0,
        prix_pose: parseFloat(document.getElementById("prix_pose").value) || 0
    }];
}

function getCaracteristiquesData() {
    const caracteristiques = {};
    const keys = document.querySelectorAll('input[name="caracteristique_key"]');
    const values = document.querySelectorAll('input[name="caracteristique_value"]');

    keys.forEach((keyInput, index) => {
        const key = keyInput.value.trim();
        const value = values[index].value.trim();
        if (key && value) {
            caracteristiques[key] = value;
        }
    });

    return caracteristiques;
}



function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'OK'
    });
}