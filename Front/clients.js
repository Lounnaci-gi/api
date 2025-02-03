/*
window.onload = async () => {
    // const id_dossier = document.getElementById('idDossier').value;
    // const raisonSociale = document.getElementById('raisonSociale').value;
    // const typeClient = document.getElementById('typeClient').value;
    // const adresseCorrespondante = document.getElementById('adresseCorrespondante').value;
    // const communeCorrespondante = document.getElementById('communeCorrespondante').value;
    // const numPicIdentite = document.getElementById('numPicIdentite').value;
    // const adresseBranchement = document.getElementById('adresseBranchement').value;
    // const CommuneBranchement = document.getElementById('CommuneBranchement').value;
    // const email = document.getElementById('email').value;
    // const telephone = document.getElementById('telephone').value;
    // const datas = {
    //     id_dossier: id_dossier, raisonSociale: raisonSociale, typeClient: typeClient,
    //     adresseCorrespondante: adresseCorrespondante, communeCorrespondante: communeCorrespondante,
    //     numPicIdentite: numPicIdentite, adresseBranchement: adresseBranchement, CommuneBranchement: CommuneBranchement,
    //     email: email, telephone: telephone
    // };

    try {
        const response = await fetch('http://localhost:3000/users/getuser/last_id_dossier')
            .then(response => response.json())
            .then(data => {
                if (data) {
                    document.getElementById('idDossier').value = data.idDossier;
                }
            });

    } catch {

    }


};
*/
document.getElementById('AjouterClient').addEventListener('click', async () => {
    document.getElementsByClassName('client-section')[0].style.display='flex';
    try {
        const response = await fetch('http://localhost:3000/users/last_id_dossier')
            .then(response => response.json())
            .then(data => {
                if (data) {
                    document.getElementById('idDossier').value = data.idDossier;
                }
            });

    } catch {

    }

})
