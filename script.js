// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const countryInput = document.getElementById('country-input');
    const searchBtn = document.getElementById('search-btn');
    const countryInfo = document.getElementById('country-info');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    
    // Base de données des dirigeants (simulée)
    const leadersDatabase = {
        'united states': {
            name: 'Joe Biden',
            role: 'Président',
            photo: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Joe_Biden_presidential_portrait.jpg',
            bio: '46ème président des États-Unis'
        },
        'france': {
            name: 'Emmanuel Macron',
            role: 'Président',
            photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Emmanuel_Macron_%28cropped%29.jpg/800px-Emmanuel_Macron_%28cropped%29.jpg',
            bio: 'Président de la République française'
        },
        'germany': {
            name: 'Frank-Walter Steinmeier',
            role: 'Président fédéral',
            photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Frank-Walter_Steinmeier_2018.jpg/800px-Frank-Walter_Steinmeier_2018.jpg',
            bio: 'Président fédéral de l\'Allemagne'
        },
        'japan': {
            name: 'Fumio Kishida',
            role: 'Premier ministre',
            photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Fumio_Kishida_20211005.jpg/800px-Fumio_Kishida_20211005.jpg',
            bio: 'Premier ministre du Japon'
        },
        'brazil': {
            name: 'Luiz Inácio Lula da Silva',
            role: 'Président',
            photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Lula_2023_%28cropped%29.jpg/800px-Lula_2023_%28cropped%29.jpg',
            bio: '39ème président du Brésil'
        },
        'canada': {
            name: 'Justin Trudeau',
            role: 'Premier ministre',
            photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/JT_2021_%28cropped%29.jpg/800px-JT_2021_%28cropped%29.jpg',
            bio: '23ème premier ministre du Canada'
        },
        'united kingdom': {
            name: 'Rishi Sunak',
            role: 'Premier ministre',
            photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Rishi_Sunak_2022_%28cropped%29.jpg/800px-Rishi_Sunak_2022_%28cropped%29.jpg',
            bio: 'Premier ministre du Royaume-Uni'
        },
        'italy': {
            name: 'Giorgia Meloni',
            role: 'Présidente du Conseil',
            photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Giorgia_Meloni_2023.jpg/800px-Giorgia_Meloni_2023.jpg',
            bio: 'Présidente du Conseil des ministres italienne'
        },
        'spain': {
            name: 'Pedro Sánchez',
            role: 'Président du gouvernement',
            photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Pedro_S%C3%A1nchez_2023_%28cropped%29.jpg/800px-Pedro_S%C3%A1nchez_2023_%28cropped%29.jpg',
            bio: 'Président du gouvernement espagnol'
        },
        'mexico': {
            name: 'Andrés Manuel López Obrador',
            role: 'Président',
            photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Andr%C3%A9s_Manuel_L%C3%B3pez_Obrador_2018.jpg/800px-Andr%C3%A9s_Manuel_L%C3%B3pez_Obrador_2018.jpg',
            bio: 'Président du Mexique'
        }
    };
    
    // Événement de recherche
    searchBtn.addEventListener('click', searchCountry);
    countryInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchCountry();
        }
    });
    
    // Fonction de recherche
    function searchCountry() {
        const countryName = countryInput.value.trim();
        
        if (!countryName) {
            showError('Veuillez entrer le nom d\'un pays');
            return;
        }
        
        // Masquer les résultats précédents et les erreurs
        hideCountryInfo();
        hideError();
        
        // Afficher le chargement
        showLoading();
        
        // Appel à l'API
        fetchCountryData(countryName);
    }
    
    // Fonction pour appeler l'API
    function fetchCountryData(countryName) {
        const apiUrl = `https://restcountries.com/v3.1/name/${countryName}`;
        
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Pays non trouvé');
                }
                return response.json();
            })
            .then(data => {
                hideLoading();
                displayCountryInfo(data[0]);
            })
            .catch(error => {
                hideLoading();
                showError('Erreur : ' + error.message + '. Essayez avec le nom anglais du pays.');
            });
    }
    
    // Fonction pour afficher les informations du pays
    function displayCountryInfo(country) {
        // Vérifier que les données nécessaires existent
        const name = country.name?.common || 'Non disponible';
        const capital = country.capital?.[0] || 'Non disponible';
        const region = country.region || 'Non disponible';
        const flagUrl = country.flags?.png || country.flags?.svg;
        
        // Obtenir les informations du dirigeant
        const countryKey = name.toLowerCase();
        const leader = leadersDatabase[countryKey];
        
        // Créer le contenu HTML
        const countryHTML = `
            <div class="country-card">
                <div class="country-header">
                    <img src="${flagUrl}" alt="Drapeau de ${name}" class="flag">
                    <h2 class="country-name">${name}</h2>
                </div>
                
                <div class="country-details">
                    <div class="detail-item">
                        <span class="detail-label">Capitale :</span> ${capital}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Région :</span> ${region}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Population :</span> ${country.population?.toLocaleString() || 'Non disponible'}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Superficie :</span> ${country.area ? `${country.area.toLocaleString()} km²` : 'Non disponible'}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Monnaie :</span> ${getCurrency(country.currencies)}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Langues :</span> ${getLanguages(country.languages)}
                    </div>
                </div>
                
                <div class="leader-section">
                    <h3 class="leader-title">👑 Dirigeant du pays</h3>
                    ${leader ? `
                        <div class="leader-info">
                            <img src="${leader.photo}" alt="${leader.name}" class="leader-photo">
                            <div class="leader-details">
                                <h4 class="leader-name">${leader.name}</h4>
                                <p class="leader-role">${leader.role}</p>
                                <p class="leader-bio">${leader.bio}</p>
                            </div>
                        </div>
                    ` : `
                        <div class="no-leader">
                            <p>Informations sur le dirigeant non disponibles pour ce pays</p>
                            <p><small>La base de données contient actuellement les dirigeants des pays suivants : États-Unis, France, Allemagne, Japon, Brésil, Canada, Royaume-Uni, Italie, Espagne, Mexique</small></p>
                        </div>
                    `}
                </div>
            </div>
        `;
        
        // Afficher les informations
        countryInfo.innerHTML = countryHTML;
        showCountryInfo();
    }
    
    // Fonction pour extraire les informations sur les devises
    function getCurrency(currencies) {
        if (!currencies) return 'Non disponible';
        
        const currencyCodes = Object.keys(currencies);
        if (currencyCodes.length === 0) return 'Non disponible';
        
        return currencies[currencyCodes[0]].name;
    }
    
    // Fonction pour extraire les informations sur les langues
    function getLanguages(languages) {
        if (!languages) return 'Non disponible';
        
        const languageNames = Object.values(languages);
        return languageNames.join(', ');
    }
    
    // Fonctions pour afficher/masquer les éléments
    function showLoading() {
        loading.classList.remove('hidden');
    }
    
    function hideLoading() {
        loading.classList.add('hidden');
    }
    
    function showCountryInfo() {
        countryInfo.classList.remove('hidden');
    }
    
    function hideCountryInfo() {
        countryInfo.classList.add('hidden');
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
    
    function hideError() {
        errorMessage.classList.add('hidden');
    }
    
    // Recherche automatique d'un pays au chargement de la page
    fetchCountryData('Japan');
    countryInput.value = 'Japan';
});