        // Données JSON intégrées
        const zonesData = [
            {
                "title": "Les Bossons",
                "topImage": "bossons_nouveau.jpg",
                "bottomImage": "bossons_ancien.jpg",
                "activePage": "bossons.html"
            },
            {
                "title": "Les Gaillants - Les Pélerins",
                "topImage": "gaillands-pelerins_nouveau.jpg",
                "bottomImage": "gaillands-pelerins_ancien.jpg",
                "activePage": "gaillands-pelerins.html"
            },
            {
                "title": "Chamonix",
                "topImage": "chamonix_nouveau.jpg",
                "bottomImage": "chamonix_ancien.jpg",
                "activePage": "chamonix.html"
            },
            {
                "title": "Les Mouilles - La Frasse - Les Coverays",
                "topImage": "mouilles-frasse-coverays_nouveau.jpg",
                "bottomImage": "mouilles-frasse-coverays_ancien.jpg",
                "activePage": "mouilles-frasse-coverays.html"
            },
            {
                "title": "Les Praz - Les Rosières - Les Nants",
                "topImage": "praz-rosieres-nants_nouveau.jpg",
                "bottomImage": "praz-rosieres-nants_ancien.jpg",
                "activePage": "praz-rosieres-nants.html"
            },
            {
                "title": "Les Bois - Les Tines",
                "topImage": "bois&tines_nouveau.jpg",
                "bottomImage": "bois&tines_ancien.jpg",
                "activePage": "bois&tines.html"
            },
            {
                "title": "Le Lavancher - La Joux",
                "topImage": "lavancher&joux_nouveau.jpg",
                "bottomImage": "lavancher&joux_ancien.jpg",
                "activePage": "lavancher&joux.html"
            },
            {
                "title": "Les îles - Les chosalets",
                "topImage": "iles&chosalets_nouveau.jpg",
                "bottomImage": "iles&chosalets_ancien.jpg",
                "activePage": "iles&chosalets.html"
            },
            {
                "title": "Agentière",
                "topImage": "argentiere_nouveau.jpg",
                "bottomImage": "argentiere_ancien.jpg",
                "activePage": "argentiere.html"
            },
            {
                "title": "Montroc",
                "topImage": "montroc_nouveau.jpg",
                "bottomImage": "montroc_ancien.jpg",
                "activePage": "montroc.html"
            },
            {
                "title": "Le Tour",
                "topImage": "letour_nouveau.jpg",
                "bottomImage": "letour_ancien.jpg",
                "activePage": "letour.html"
            }
        ];
        function getZoneFromURL() {
            // Récupère le nom de la zone depuis l'URL (ex: bossons.html -> bossons)
            const currentPage = window.location.pathname.split('/').pop();
            return zonesData.find(zone => zone.activePage === currentPage);
        }

        function getZoneFromParameter() {
            // Utilise un paramètre URL (ex: ?zone=bossons)
            const urlParams = new URLSearchParams(window.location.search);
            const zoneName = urlParams.get('zone');
            return zonesData.find(zone => 
                zone.activePage.replace('.html', '') === zoneName
            );
        }

        function switchZone(zoneName) {
            console.log('switchZone appelée avec:', zoneName);
            
            // Trouve la zone correspondante
            const selectedZone = zonesData.find(zone => {
                const zoneKey = zone.activePage.replace('.html', '');
                console.log('Comparaison:', zoneKey, 'vs', zoneName);
                return zoneKey === zoneName;
            });
            
            console.log('Zone trouvée:', selectedZone);
            
            if (selectedZone) {
                // Met à jour l'URL sans recharger la page
                const newUrl = `${window.location.pathname}?zone=${zoneName}`;
                window.history.pushState({zone: zoneName}, '', newUrl);
                
                console.log('Avant updatePageContent');
                // Met à jour le contenu
                updatePageContent(selectedZone);
                console.log('Après updatePageContent');
            } else {
                console.error('Zone non trouvée pour:', zoneName);
            }
        }

        function updatePageContent(zone) {
            console.log('updatePageContent appelée avec:', zone);
            
            // Met à jour le titre de la page - essaie plusieurs méthodes
            let pageTitle = document.getElementById('page-title') || document.querySelector('title');
            let headerTitle = document.getElementById('header-title');
            
            console.log('pageTitle trouvé:', pageTitle);
            console.log('headerTitle trouvé:', headerTitle);
            
            if (pageTitle) {
                pageTitle.textContent = `${zone.title} - Comparateur PLU`;
                console.log('Titre de page mis à jour:', zone.title);
            }
            
            if (headerTitle) {
                headerTitle.textContent = zone.title;
                console.log('Header mis à jour:', zone.title);
            }

            // Met à jour les images - essaie plusieurs sélecteurs
            let topLayer = document.getElementById('top-layer') || document.querySelector('#top-layer') || document.querySelector('.on-top');
            let bottomLayer = document.getElementById('bottom-layer') || document.querySelector('#bottom-layer');
            
            console.log('topLayer trouvé:', topLayer);
            console.log('bottomLayer trouvé:', bottomLayer);
            
            if (topLayer) {
                topLayer.src = zone.topImage;
                topLayer.alt = `Image nouvelle de ${zone.title}`;
                console.log('Image du haut mise à jour:', zone.topImage);
            }
            
            if (bottomLayer) {
                bottomLayer.src = zone.bottomImage;
                bottomLayer.alt = `Image ancienne de ${zone.title}`;
                console.log('Image du bas mise à jour:', zone.bottomImage);
            }

            // Régénère le menu avec le bon bouton actif
            console.log('Régénération du menu...');
            generateMenu(zone.title);
            console.log('Menu régénéré');
        }

        function loadZoneContent() {
            // Essaie le paramètre URL, sinon charge la première zone
            let currentZone = getZoneFromParameter() || zonesData[0];

            // Met à jour le contenu
            updatePageContent(currentZone);
        }

        function generateMenu(activeZone) {
            const menuContainer = document.getElementById('menu-container');
            let menuHTML = '';

            zonesData.forEach((zone, index) => {
                const isActive = zone.title === activeZone;
                const style = isActive ? 'style="background-color: orange"' : '';
                const zoneName = zone.activePage.replace('.html', '');
                menuHTML += `<a href="#" data-zone="${zoneName}" ${style} onclick="switchZone('${zoneName}')">${zone.title}</a>`;
            });

            // Ajoute le lien vers la légende
            menuHTML += `
                <a href="legende.png" target="_blank" rel="noopener noreferrer" 
                   style="background-color: white; border: 2px solid orange">
                    Voir la légende des zonages
                </a>
            `;

            menuContainer.innerHTML = menuHTML;
        }

       /* // Gestion du bouton retour/avancer du navigateur
        window.addEventListener('popstate', function(event) {
            if (event.state && event.state.zone) {
                const zone = zonesData.find(z => 
                    z.activePage.replace('.html', '') === event.state.zone
                );
                if (zone) {
                    updatePageContent(zone);
                }
            } else {
                // Retour à la première zone
                updatePageContent(zonesData[0]);
            }
        });*/

        // Charge le contenu au chargement de la page
        document.addEventListener('DOMContentLoaded', loadZoneContent);

        // Votre script existant pour le zoom et la transparence
        // (Ajoutez ici votre script.js existant)
        