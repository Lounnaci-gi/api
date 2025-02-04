document.getElementById('AjouterClient').addEventListener('click', async () => {
    document.getElementsByClassName('client-section')[0].style.display = 'flex';
    document.getElementsByClassName('footer')[0].style = 'margin-top: auto';

    try {
        const response = await fetch('http://localhost:3000/users/last_id_dossier')
            .then(response => response.json())
            .then(data => {
                if (data) {
                    document.getElementById('idDossier').value = data.idDossier;
                }
            });

    } catch (error) {
        alert("Une erreur s'est produite lors de la récupération de idDossier.");
        Swal.fire({
            title: 'Erreur',
            text: `Une erreur s'est produite : ${error.message}`,
            icon: 'error',
            confirmButtonText: 'OK'
        });

    }
})


document.getElementsByClassName('btn')[0].addEventListener('click', async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page
    const id_dossier = document.getElementById('idDossier').value;
    const raisonSociale = document.getElementById('raisonSociale').value.trim();
    const typeClient = document.getElementById('typeClient').value;
    const adresseCorrespondante = document.getElementById('adresseCorrespondante').value.trim();
    const communeCorrespondante = document.getElementById('communeCorrespondante').value.trim();
    const numPicIdentite = document.getElementById('numPicIdentite').value.trim();
    const adresseBranchement = document.getElementById('adresseBranchement').value.trim();
    const CommuneBranchement = document.getElementById('CommuneBranchement').value.trim();
    const email = document.getElementById('email').value.trim();
    const telephone = document.getElementById('telephone').value.trim();

    const datas = {
        Id_Dossier: id_dossier, raison_sociale: raisonSociale, type_client: typeClient,
        Adresse_correspondante: adresseCorrespondante, commune_correspondante: communeCorrespondante,
        Num_pic_identite: numPicIdentite, Adresse_branchement: adresseBranchement, commune_branchement: CommuneBranchement,
        email: email, telephone: telephone
    };

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

    try {

        const response = await fetch('http://localhost:3000/users/posts',
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datas),
            });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        } else {
            Swal.fire({
                title: 'Succès !',
                text: 'Données envoyées avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                document.getElementById('addClientForm').reset(); // Réinitialisation du formulaire
                document.getElementsByClassName('client-section')[0].style.display = 'none';
                document.getElementsByClassName('footer')[0].style = 'margin-top: 50%';
            });
        }
    } catch (error) {
        Swal.fire({
            title: 'Erreur',
            text: `Une erreur s'est produite : ${error.message}`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

})