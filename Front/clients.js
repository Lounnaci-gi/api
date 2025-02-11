// 👉 Afficher le formulaire lors du clic sur "Ajouter un client"
document.getElementById('AjouterClient').addEventListener('click', async () => {
    document.querySelector('.client-section').style.display = 'flex';
    const ttable = document.getElementsByClassName("liste-clients")[0];
    document.querySelector('.footer').style.marginTop = 'auto';
    ttable.innerHTML = '';
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
    if (!phoneRegex.test(telephone) && telephone) {
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

    // Si l'utilisateur a tapé moins de 2 caractères, on ne fait pas de requête
    if (inputValue.length < 2) {
        ttable.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/users/search_rs?q=${encodeURIComponent(inputValue)}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Réinitialisation du tableau
        ttable.innerHTML = `
        <thead>  
            <tr>
                <th>N°</th>
                <th>N° Dossier</th>
                <th>Raison Sociale</th>
                <th>Adresse</th>
                <th>Commune</th>  
                <th>Date Dépot</th>
            </tr>
        </thead>`;

        const tbody = document.createElement('tbody');

        if (data.length > 0) {
            let i = 1;
            // Ajouter les résultats à la liste
            data.forEach(client => {
                const row = document.createElement("tr");
                row.innerHTML = `                       
                    <td>${String(i++).padStart(3, "0")}</td>
                    <td>${client.Id_Dossier}</td>
                    <td>${client.raison_sociale}</td>
                    <td>${client.Adresse_correspondante}</td>
                    <td>${client.commune_correspondante}</td>
                    <td>${new Date(client.createdAt).toLocaleDateString('fr-FR')}</td>`;
                tbody.appendChild(row);
            });

            ttable.appendChild(tbody);
        } else {
            // Ajouter une ligne indiquant qu'aucun résultat n'a été trouvé
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="6" style="text-align:center;">Aucun résultat trouvé</td>`;
            tbody.appendChild(row);
            ttable.appendChild(tbody);
            setTimeout(() => {
                ttable.innerHTML = ``;
            }, 3000);

        }
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
    const ttable = document.getElementsByClassName("liste-clients")[0];
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
                <th>Actions</th>
            </tr>
        </thead>`;

        const tbody = document.createElement('tbody');

        if (clients.length > 0) {
            let i = 1;
            clients.forEach(client => {
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
                        <i class='bx bxs-printer' >
                    </td>
                `;
                tbody.appendChild(row);
            });
        } else {
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="11" style="text-align:center;">Aucun client trouvé</td>`;
            tbody.appendChild(row);
        }

        ttable.appendChild(tbody);
        Swal.close();

    } catch (error) {
        console.error("Erreur :", error);
        Swal.fire({
            title: 'Erreur',
            text: 'Impossible de récupérer les clients.',
            icon: 'error'
        });
    }
});
//-------------------------------
const dateInput = document.getElementById('dateDelivrance');

// Vérification en temps réel pour le jour et le mois
dateInput.addEventListener('input', function () {
    let value = this.value.replace(/[^0-9]/g, ''); // Supprime tout caractère non numérique
    let formattedValue = '';

    if (value.length >= 1) {
        let jour = value.substring(0, 2);
        if (parseInt(jour) > 31) {
            Swal.fire({
                title: 'Date invalide',
                text: 'Le jour ne peut pas dépasser 31.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            jour = '31'; // Limite à 31
        }
        formattedValue += jour;
    }

    if (value.length > 2) {
        let mois = value.substring(2, 4);
        if (parseInt(mois) > 12) {
            Swal.fire({
                title: 'Date invalide',
                text: 'Le mois ne peut pas dépasser 12.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
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
            Swal.fire({
                title: 'Date invalide',
                text: `L'année doit être comprise entre 1900 et ${anneeActuelle}.`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            parts[2] = anneeActuelle.toString(); // Corrige l'année
            this.value = parts.join('/'); // Met à jour avec la correction
        }
    }
});

document.getElementById("numPicIdentite").addEventListener('blur', () => {
    if (document.getElementById("numPicIdentite").value.trim() !== '') {
        document.getElementById("delivrePar").setAttribute("required", true);
        document.getElementById("dateDelivrance").setAttribute("required", true);
        document.getElementById("delivrePar").removeAttribute("readonly");
        document.getElementById("dateDelivrance").removeAttribute("readonly");
    } else {
        document.getElementById("delivrePar").setAttribute("readonly",true);
        document.getElementById("dateDelivrance").setAttribute("readonly",true);
        document.getElementById("delivrePar").value='';
        document.getElementById("dateDelivrance").value='';
    }

})

document.getElementById('devis').addEventListener('click',()=>{
    Swal.fire({
        title: 'Connexion',
        html:
            '<input id="swal-email" class="swal2-input" placeholder="Email">' +
            '<input id="swal-password" class="swal2-input" type="password" placeholder="Mot de passe">',
        focusConfirm: false,
        preConfirm: () => {
            const email = document.getElementById('swal-email').value;
            const password = document.getElementById('swal-password').value;
            if (!email || !password) {
                Swal.showValidationMessage('Veuillez remplir tous les champs.');
            }
            return { email, password };
        },
        showCancelButton: true,
        confirmButtonText: 'Se connecter',
        cancelButtonText: 'Annuler'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Données soumises', `Email : ${result.value.email}<br>Mot de passe : ${result.value.password}`, 'success');
        }
    });
})