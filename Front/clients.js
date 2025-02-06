// 👉 Afficher le formulaire lors du clic sur "Ajouter un client"
document.getElementById('AjouterClient').addEventListener('click', async () => {
    document.querySelector('.client-section').style.display = 'flex';
    document.querySelector('.footer').style.marginTop = 'auto';

    try {
        const response = await fetch('http://localhost:3000/users/last_id_dossier');
        const data = await response.json();
        if (data) {
            document.getElementById('idDossier').value = data.idDossier;
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

    if (!id_dossier || !raisonSociale || !typeClient || !numPicIdentite || !adresseBranchement || !adresseCorrespondante) {
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

        // Ajouter les résultats à la liste déroulante
        data.forEach(clients => {
            const option = document.createElement('option');
            option.value = clients.raison_sociale;  // Ajustez selon le format de votre API
            datalist.appendChild(option);
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des raisons sociales :", error);
    }
});
