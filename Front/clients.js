function dessiner_tableau() {
    return `
    <thead>  
        <tr>
            <th>N°</th>
            <th>N° Dossier</th>
            <th>Statut</th>
            <th>Raison Sociale</th>
            <th>Adresse</th>
            <th>Commune</th>
            <th>N° Pièce d'identité</th>
            <th>N° Délivrer par</th>
            <th>Telephone</th>
            <th>Email</th>
            <th>Date Dépot</th>
            <th>Actions</th>
        </tr>
    </thead>`
}

function showAlert(title, text, icon) {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonText: 'OK'
    });
}

function validatePhoneNumber(phone) {
    return /^\d{10}$/.test(phone);
}

function validatePostalCode(code) {
    return /^\d{5}$/.test(code);
}

//-------------------
function renderClientsTable(data) {
    const element = document.querySelector('.table-container');
    const ttable = document.querySelector(".liste-clients");

    // Réinitialiser le tableau
    ttable.innerHTML = dessiner_tableau();
    const tbody = document.createElement('tbody');

    if (data.length > 0) {
        let i = 1;
        data.forEach(client => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${String(i++).padStart(3, "0")}</td>
                <td>${client.Id_Dossier}</td>
                <td>${client.type_client}</td>
                <td>${client.raison_sociale}</td>
                <td>${client.Adresse_correspondante}</td>
                <td>${client.commune_correspondante}</td>
                <td>${client.Num_pic_identite?.numero || ""}</td>
                <td>${client.Num_pic_identite?.delivre_par || ""}</td>
                <td>${client.telephone}</td>
                <td>${client.email}</td>
                <td>${new Date(client.createdAt).toLocaleDateString('fr-FR')}</td>
                <td>
                    <i class='bx bxs-message-square-edit'></i>
                    <i class='bx bxs-message-square-x'></i>
                    <i class='bx bxs-printer'></i>
                </td>`;
            tbody.appendChild(row);
        });
        ttable.appendChild(tbody);

        // ✅ Afficher le tableau uniquement après remplissage
        element.style.display = "block";
    } else {
        ttable.innerHTML += `<tr><td colspan="11" style="text-align:center;">Aucun client trouvé</td></tr>`;
        element.style.display = "none";
    }
}


// 👉 Afficher le formulaire lors du clic sur "Ajouter un client"
document.getElementById('AjouterClient').addEventListener('click', async () => {
    document.querySelector('.client-section').style.display = 'flex';
    const ttable = document.getElementsByClassName("liste-clients")[0];
    document.querySelector('.footer').style.marginTop = 'auto';
    ttable.innerHTML = '';
    // Cacher le tableau
    var element = document.querySelector('.table-container');
    element.style.display = "none";

    // Afficher le loader avec SweetAlert2
    Swal.fire({
        title: 'Chargement...',
        html: 'Veuillez patienter...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    try {
        const response = await fetch('http://localhost:3000/users/last_id_dossier');
        const data = await response.json();
        if (data) {
            document.getElementById('idDossier').value = data.idDossier;
            Swal.close();
        }
    } catch (error) {
        showAlert('Erreur', `Une erreur s'est produite lors de la récupération de l'ID Dossier : ${error.message}`, 'error');
    }
});

document.getElementById('addClientForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page
    const getValue = (id) => document.getElementById(id).value.trim();

    const id_dossier = getValue('idDossier');
    const civilite = getValue('civilite');
    const raisonSociale = getValue('raisonSociale');
    const typeClient = getValue('typeClient');
    const adresseCorrespondante = getValue('adresseCorrespondante');
    const communeCorrespondante = getValue('communeCorrespondante');
    const code_postale = getValue('codePostal');
    const numPicIdentite = getValue('numPicIdentite'); // Ancien champ pour compatibilité
    const delivrePar = getValue('delivrePar'); // Nouveau champ
    const dateDelivrance = getValue('dateDelivrance'); // Nouveau champ
    const adresseBranchement = getValue('adresseBranchement');
    const communeBranchement = getValue('CommuneBranchement');
    const email = getValue('email');
    const telephone = getValue('telephone');

    if (!id_dossier || !raisonSociale || !typeClient || !adresseBranchement || !adresseCorrespondante) {
        return showAlert('Attention', 'Veuillez remplir tous les champs obligatoires.', 'warning');
    }

    if (!validatePhoneNumber(telephone)) {
        showAlert("Erreur", "Le numéro de téléphone doit contenir exactement 10 chiffres.", "error");
        return;
    }

    if (!validatePostalCode(code_postale)) {
        showAlert("Erreur", "Le code postal doit contenir exactement 5 chiffres.", "error");
        return;
    }
    // 👉 Affichage de la boîte de confirmation avant soumission
    const confirmation = await Swal.fire({
        title: 'Confirmation',
        text: 'Voulez-vous vraiment soumettre ces informations ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui, envoyer',
        cancelButtonText: 'Annuler'
    });

    // Si l'utilisateur annule, on stoppe l'envoi
    if (!confirmation.isConfirmed) {
        return;
    }

    const datas = {
        Id_Dossier: id_dossier,
        Civilite: civilite,
        raison_sociale: raisonSociale,
        type_client: typeClient,
        Adresse_correspondante: adresseCorrespondante,
        commune_correspondante: communeCorrespondante,
        Code_postale: code_postale,
        Num_pic_identite: {
            numero: numPicIdentite, // Récupère le numéro d'identité
            delivre_par: delivrePar, // Récupère l'autorité de délivrance
            date_delivrance: dateDelivrance || null // Convertir la date si besoin
        },
        Adresse_branchement: adresseBranchement,
        commune_branchement: communeBranchement,
        email: email,
        telephone: telephone
    };

    try {
        const response = await fetch('http://localhost:3000/users/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datas),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        showAlert('Succès !', 'Données envoyées avec succès.', 'success')
            .then(() => {
                document.getElementById('addClientForm').reset(); // Réinitialisation du formulaire
                document.querySelector('.client-section').style.display = 'none'; // Masquer le formulaire
                document.querySelector('.footer').style.marginTop = '50%'; // Ajuster le footer
            });

    } catch (error) {
        showAlert('Erreur', `Une erreur s'est produite : ${error.message}`, 'error');
    }
});

// Fonction debounce
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Fonction de recherche
async function searchRaisonSociale() {
    const inputValue = document.getElementById('raisonSociale').value.trim();
    const ttable = document.getElementsByClassName("liste-clients")[0];
    var element = document.querySelector('.table-container');
    // Si l'utilisateur a tapé moins de 2 caractères, on ne fait pas de requête
    if (inputValue.length < 2) {
        element.style.display = 'none';
        document.getElementById('nbr_dossier').textContent = '';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/users/search_rs?q=${encodeURIComponent(inputValue)}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        renderClientsTable(data);
    } catch (error) {
        console.error("Erreur lors de la récupération des raisons sociales :", error);
        // Afficher un message d'erreur à l'utilisateur
        ttable.innerHTML = '<tr><td colspan="6" style="text-align:center; color: red;">Erreur lors de la récupération des données</td></tr>';
    }
}

// Appliquer le debounce à la fonction de recherche
const debouncedSearch = debounce(searchRaisonSociale, 300);

// Ajouter l'événement input avec le debounce
document.getElementById('raisonSociale').addEventListener('input', debouncedSearch);


// liste des clients 
document.getElementById('liste-clients').addEventListener('click', async () => {
    // Afficher le loader avec SweetAlert2
    Swal.fire({
        title: 'Chargement...',
        html: 'Veuillez patienter...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    document.querySelector('.client-section').style.display = 'none';

    try {
        const response = await fetch("http://localhost:3000/users", { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const clients = await response.json();
        renderClientsTable(clients);
        Swal.close();
    } catch (error) {
        showAlert('Erreur', 'Impossible de récupérer les clients.', 'error');
    }
});
//-------------------------------
// const dateInput = document.getElementById('dateDelivrance');
document.querySelectorAll('.date_client').forEach(dateInput => {
    // Vérification en temps réel pour le jour et le mois
    dateInput.addEventListener('input', function () {
        let value = this.value.replace(/[^0-9]/g, ''); // Supprime tout caractère non numérique
        let formattedValue = '';

        if (value.length >= 1) {
            let jour = value.substring(0, 2);
            if (parseInt(jour) > 31) {
                showAlert('Date invalide', 'Le jour ne peut pas dépasser 31.', 'error');
                jour = '31'; // Limite à 31
            }
            formattedValue += jour;
        }

        if (value.length > 2) {
            let mois = value.substring(2, 4);
            if (parseInt(mois) > 12) {
                showAlert('Date invalide', 'Le mois ne peut pas dépasser 12.', 'error');
                mois = '12'; // Limite à 12
            }
            formattedValue += '/' + mois;
        }

        if (value.length > 4) {
            let annee = value.substring(4, 8);
            formattedValue += '/' + annee; // Ajoute l'année mais ne la vérifie pas encore
        }

        this.value = formattedValue; // Met à jour le champ avec le bon format
    });

    // Vérification de l'année uniquement après perte de focus
    dateInput.addEventListener('blur', function () {
        let parts = this.value.split('/');
        if (parts.length === 3) {
            let annee = parseInt(parts[2]);
            let anneeActuelle = new Date().getFullYear();

            if (annee < 1900 || annee > anneeActuelle + 10) {
                showAlert('Date invalide', `L'année doit être comprise entre 1900 et ${anneeActuelle}.`, 'error');
                parts[2] = anneeActuelle.toString(); // Corrige l'année
                this.value = parts.join('/'); // Met à jour avec la correction
            }
        }
    });

});


document.getElementById("numPicIdentite").addEventListener('blur', () => {
    if (document.getElementById("numPicIdentite").value.trim() !== '') {
        document.getElementById("delivrePar").setAttribute("required", true);
        document.getElementById("dateDelivrance").setAttribute("required", true);
        document.getElementById("delivrePar").removeAttribute("readonly");
        document.getElementById("dateDelivrance").removeAttribute("readonly");
    } else {
        document.getElementById("delivrePar").setAttribute("readonly", true);
        document.getElementById("dateDelivrance").setAttribute("readonly", true);
        document.getElementById("delivrePar").value = '';
        document.getElementById("dateDelivrance").value = '';
    }

})

document.getElementById('filter').addEventListener('click', () => {
    enregistrements_dossiers_journaliers();
})



async function enregistrements_dossiers_journaliers() {
    const ttable = document.querySelector(".liste-clients");
    const date_debut = document.querySelector("#date_debut").value;
    const date_fin = document.querySelector("#date_fin").value;


    if (!date_debut || !date_fin) {
        showAlert('Erreur', 'Veuillez sélectionner une plage de dates.', 'error');
        return;
    }
    // Vérification que date_debut ≤ date_fin
    if (new Date(date_debut) > new Date(date_fin)) {
        showAlert('Erreur', 'La date de début ne peut pas être après la date de fin.', 'error');
        return;
    }

    Swal.fire({
        title: 'Chargement...',
        html: 'Veuillez patienter...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {

        const response = await fetch(`http://localhost:3000/users/records_de_jours?date_debut=${date_debut}&date_fin=${date_fin}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            showAlert('Erreur', 'Impossible de récupérer les clients.', 'error');
            return;
        }

        const clients = await response.json();
        if (clients.length === 0) {
            showAlert('Information', `Aucun dossier enregistré entre le ${date_debut} et le ${date_fin}.`, 'info');
            return;
        }
        renderClientsTable(clients);
        Swal.close();
    } catch (error) {
        showAlert('Erreur', `Une erreur s'est produite : ${error.message}`, 'error');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Vérifier si l'utilisateur est déjà hors ligne au chargement
    if (!navigator.onLine) {
        showAlert("Problème de connexion", "Vous êtes hors ligne.", "error");
    }

    // Événements pour détecter les changements de connexion en temps réel
    window.addEventListener('offline', () => {
        showAlert("Problème de connexion", "Vous êtes hors ligne.", "error");
    });

    window.addEventListener('online', () => {
        showAlert("Connexion rétablie", "Vous êtes de nouveau en ligne.", "success");
    });
});


document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('bxs-message-square-edit')) {
        // Récupérer l'ID du dossier
        const idDossier = event.target.closest('tr')?.children[1]?.textContent.trim();

        if (!idDossier) {
            showAlert('Erreur', 'ID du dossier invalide.', 'error');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/users/${encodeURIComponent(idDossier)}`, { method: 'GET' });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status} : ${response.statusText}`);
            }

            const client = await response.json();
            showAlert('success','Dossier trouver avec success','success');

        } catch (err) {
            console.error("Erreur lors de la récupération du dossier :", err);
            showAlert('Erreur', err.message || 'Impossible de récupérer le dossier.', 'error');
        }
    }
});


//----------------
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('bxs-message-square-edit')) {
        // Récupérer l'ID du dossier
        const idDossier = event.target.closest('tr')?.children[1]?.textContent.trim();

        if (!idDossier) {
            showAlert('Erreur', 'ID du dossier invalide.', 'error');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/users/${encodeURIComponent(idDossier)}`, { method: 'GET' });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status} : ${response.statusText}`);
            }

            const client = await response.json();
            console.log(client);

            // **Préremplir le formulaire avec les données récupérées**
            fillClientForm(client);

        } catch (err) {
            console.error("Erreur lors de la récupération du dossier :", err);
            showAlert('Erreur', err.message || 'Impossible de récupérer le dossier.', 'error');
        }
    }
});

/**
 * 📌 Fonction pour préremplir le formulaire avec les données du client
 */
function fillClientForm(client) {
    document.getElementById('idDossier').value = client.Id_Dossier || '';
    document.getElementById('civilite').value = client.Civilite || '';
    document.getElementById('raisonSociale').value = client.raison_sociale || '';
    document.getElementById('typeClient').value = client.type_client || '';
    document.getElementById('adresseCorrespondante').value = client.Adresse_correspondante || '';
    document.getElementById('communeCorrespondante').value = client.commune_correspondante || '';
    document.getElementById('codePostal').value = client.Code_postale || '';
    document.getElementById('numPicIdentite').value = client.Num_pic_identite?.numero || '';
    document.getElementById('delivrePar').value = client.Num_pic_identite?.delivre_par || '';
    document.getElementById('dateDelivrance').value = client.Num_pic_identite?.date_delivrance || '';
    document.getElementById('adresseBranchement').value = client.Adresse_branchement || '';
    document.getElementById('CommuneBranchement').value = client.commune_branchement || '';
    document.getElementById('email').value = client.email || '';
    document.getElementById('telephone').value = client.telephone || '';

    // **Afficher le formulaire si besoin**
    document.querySelector('.client-section').style.display = 'block';
    document.querySelector('.footer').style.marginTop = '0';
    document.querySelector('.table-container').style.display = 'none';
}
