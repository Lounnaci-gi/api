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

    const prix_fourniture = parseFloat(document.getElementById("prix_fourniture").value);
    const prix_pose = parseFloat(document.getElementById("prix_pose").value);

    if (isNaN(prix_fourniture) || prix_fourniture <= 0) {
        event.preventDefault(); // Bloque l'envoi du formulaire
        document.getElementById("prix_fourniture").focus();
        return showAlert('Attention', 'Veuillez remplire les champs manquant', 'warning');
    }

    if (isNaN(prix_pose) || prix_pose <= 0) {
        event.preventDefault(); // Bloque l'envoi du formulaire
        document.getElementById("prix_pose").focus();
        return showAlert('Attention', 'Veuillez remplire les champs manquant', 'warning');
    }

    // 🔥 Demander confirmation avant d'envoyer les données
    const confirmation = await Swal.fire({
        title: "Confirmer l'enregistrement ?",
        text: "Voulez-vous vraiment ajouter cet article ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, enregistrer !",
        cancelButtonText: "Annuler"
    });

    if (!confirmation.isConfirmed) {
        return; // ⛔ Ne rien faire si l'utilisateur annule
    }
    const datas = {
        designation: document.getElementById("designation").value,
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
        document.querySelectorAll(".btn delete-btn").forEach(element => element.remove());
        document.querySelectorAll(".caracteristique-entry").forEach(element => element.remove());
        document.getElementById('articleForm').reset();

    } else {
        Swal.fire("Erreur", result.message || "Une erreur est survenue", "error");
    }
});

function getPrixData() {
    return [{
        date_application: new Date(),
        prix_unitaire_ht: parseFloat(document.getElementById("prix_unitaire_ht").value) || 0,
        prix_fourniture: parseFloat(document.getElementById("prix_fourniture").value) || 0,
        prix_pose: parseFloat(document.getElementById("prix_pose").value) || 0
    }];
}

function getCaracteristiquesData() {
    const caracteristiques = {};
    const keys = document.querySelectorAll('select[name="caracteristique_key"]'); // Sélectionner les <select>
    const values = document.querySelectorAll('input[name="caracteristique_value"]'); // Sélectionner les <input>

    keys.forEach((keySelect, index) => {
        const key = keySelect.value.trim(); // Récupérer la valeur sélectionnée dans la liste déroulante
        const value = values[index].value.trim(); // Récupérer la valeur saisie dans le champ de texte
        if (key && value) { // Vérifier que la clé et la valeur ne sont pas vides
            caracteristiques[key] = value;
        }
    });

    return caracteristiques;
}

document.getElementById('btn_article_add_car').addEventListener('click', () => {
    const container = document.getElementById("caracteristiquesContainer");
    const newEntry = document.createElement("div");
    newEntry.className = "caracteristique-entry";

    // Créer la liste déroulante pour la clé
    const selectKey = document.createElement("select");
    selectKey.className = "form-input";
    selectKey.name = "caracteristique_key";

    // Ajouter les options à la liste déroulante
    const options = [
        { value: "", text: "Sélectionnez une clé" },
        { value: "Unite", text: "Unité de mesure (ex: ml, m², m3)" },
        { value: "DN", text: "DN [Diamètre]" },
        { value: "PN", text: "PN [Pression nominale]" },
        { value: "Classe", text: "Classe" }
    ];

    options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.text;

        // Désactiver si déjà sélectionné
        if (isOptionSelected(option.value)) {
            optionElement.disabled = true;
        }

        selectKey.appendChild(optionElement);
    });

    // Créer le champ de texte pour la valeur
    const inputValue = document.createElement("input");
    inputValue.type = "text";
    inputValue.className = "form-input";
    inputValue.name = "caracteristique_value";
    inputValue.placeholder = "Valeur (ex: 20 mm)";

    // Créer le bouton "Supprimer"
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn delete-btn";
    deleteButton.textContent = "Supp";
    deleteButton.addEventListener("click", () => {
        container.removeChild(newEntry);
        updateOptions(); // 🔄 Mettre à jour les options après suppression
    });

    // Ajouter les éléments au conteneur
    newEntry.appendChild(selectKey);
    newEntry.appendChild(inputValue);
    newEntry.appendChild(deleteButton);
    container.insertBefore(newEntry, container.lastElementChild);

    // Mettre à jour les options disponibles
    selectKey.addEventListener("change", updateOptions);
});

// Fonction pour vérifier si une option est déjà sélectionnée
function isOptionSelected(value) {
    return Array.from(document.querySelectorAll('select[name="caracteristique_key"]'))
        .some(select => select.value === value);
}

// Fonction pour mettre à jour les options disponibles
function updateOptions() {
    const selectedValues = Array.from(document.querySelectorAll('select[name="caracteristique_key"]'))
        .map(select => select.value);

    document.querySelectorAll('select[name="caracteristique_key"] option').forEach(option => {
        if (option.value && selectedValues.includes(option.value)) {
            option.disabled = true;
        } else {
            option.disabled = false;
        }
    });
}

