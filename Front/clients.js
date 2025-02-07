// 👉 Afficher le formulaire lors du clic sur "Ajouter un client"
document.getElementById('AjouterClient').addEventListener('click', async () => {
    document.querySelector('.client-section').style.display = 'flex';
    document.querySelector('.footer').style.marginTop = 'auto';

    try {
        const response = await fetch('http://localhost:3000/users/last_id_dossier');
        const data = await response.json();
        if (data) {
<<<<<<< HEAD
            /*document.getElementById('idDossier').value = data.idDossier;*/
            document.getElementById('idDossier').innerText = data.idDossier;
=======
            document.getElementById('idDossier').value = data.idDossier;

>>>>>>> ba1ec336f604c503fa1a2f3e460d02c78161cea7
        }
    } catch (error) {
        Swal.fire({
            title: 'Erreur',
            text: `Une erreur s'est produite lors de la récupération de l'ID Dossier : ${error.message}`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
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
        return Swal.fire({
            title: 'Erreur',
            text: 'Veuillez remplir tous les champs obligatoires.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
    }

    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(telephone)) {
        return Swal.fire({
            title: 'Erreur',
            text: 'Numéro de téléphone invalide. Veuillez entrer uniquement des chiffres.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
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

        Swal.fire({
            title: 'Succès !',
            text: 'Données envoyées avec succès.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            document.getElementById('addClientForm').reset(); // Réinitialisation du formulaire
            document.querySelector('.client-section').style.display = 'none'; // Masquer le formulaire
            document.querySelector('.footer').style.marginTop = '50%'; // Ajuster le footer
        });

    } catch (error) {
        Swal.fire({
            title: 'Erreur',
            text: `Une erreur s'est produite : ${error.message}`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});


document.getElementById('raisonSociale').addEventListener('input', async function () {
    const inputValue = this.value.trim();
    const datalist = document.getElementById('suggestionsRaisonSociale');
    // Si l'utilisateur a tapé moins de 2 caractères, on ne fait pas de requête
    if (inputValue.length < 2) {
        datalist.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/users/search_rs?q=${inputValue}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Vider la liste avant d'ajouter les nouvelles suggestions
        datalist.innerHTML = '';
        // Pour filtere le tableau 
        let i = 1;
        const ttable = document.getElementsByClassName("liste-clients")[0];
        ttable.innerHTML = `
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
        </tr>
        </thead>`;
        const tbody = document.createElement('tbody');
        // Ajouter les résultats à la liste déroulante
        data.forEach(clients => {
            const option = document.createElement('option');
            option.value = clients.raison_sociale;  // Ajustez selon le format de votre API
            datalist.appendChild(option);
            // Dessiner le tableau
            const row = document.createElement("tr");
            row.innerHTML = `                       
                        <td>${String(i++).padStart(3, "0")}</td>
                        <td>${clients.Id_Dossier}</td>
                        <td>${clients.type_client}</td>
                        <td>${clients.raison_sociale}</td>
                        <td>${clients.Adresse_correspondante}</td>
                        <td>${clients.commune_correspondante}</td>
                        <td>${clients.Num_pic_identite?.numero || ""}</td>
                        <td>${clients.Num_pic_identite?.delivre_par || ""}</td>
                        <td>${clients.telephone}</td>
                        <td>${clients.email}</td>
                        <td>${new Date(clients.createdAt).toLocaleDateString('fr-FR')}</td>

                        `;
            tbody.appendChild(row);
            ttable.appendChild(tbody);
            
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des raisons sociales :", error);
    }
});


// liste des clients 

document.getElementById('liste-clients').addEventListener('click', async () => {
    try {
        const response = await fetch("http://localhost:3000/users", { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const posts = await response.json();
        let i = 1;
        const ttable = document.getElementsByClassName("liste-clients")[0];
        ttable.innerHTML = `
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
        </tr>
        </thead>`;
        const tbody = document.createElement('tbody');

        posts.forEach(e => {
            const row = document.createElement("tr");
            row.innerHTML = `                       
                        <td>${String(i++).padStart(3, "0")}</td>
                        <td>${e.Id_Dossier}</td>
                        <td>${e.type_client}</td>
                        <td>${e.raison_sociale}</td>
                        <td>${e.Adresse_correspondante}</td>
                        <td>${e.commune_correspondante}</td>
                        <td>${e.Num_pic_identite?.numero || ""}</td>
                        <td>${e.Num_pic_identite?.delivre_par || ""}</td>
                        <td>${e.telephone}</td>
                        <td>${e.email}</td>
                        <td>${new Date(e.createdAt).toLocaleDateString('fr-FR')}</td>

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
