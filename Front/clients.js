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

    } catch {
        alert("Une erreur s'est produite lors de la récupération de idDossier.");

    }
})


document.getElementsByClassName('btn')[0].addEventListener('click', async () => {
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

    try {

        const response = await fetch('http://localhost:3000/users/posts',
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datas),
            });
    } catch (error) {
        alert(`Une erreur s'est produite : ${error.message}`);
    }

})