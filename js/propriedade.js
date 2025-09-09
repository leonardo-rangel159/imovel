// Script para o carrossel de propriedades em destaque
        document.addEventListener('DOMContentLoaded', function() {
            const propertiesContainer = document.querySelector('.properties-container');
            const propertyCards = document.querySelectorAll('.property-card');
            const prevBtn = document.querySelector('.prev-btn');
            const nextBtn = document.querySelector('.next-btn');
            const dots = document.querySelectorAll('.dot');
            
            let currentIndex = 0;
            const cardCount = propertyCards.length;
            const cardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;
            
            // Função para atualizar a exibição do carrossel
            function updateCarousel() {
                // Calcular a translação com base no índice atual
                const translateValue = (-currentIndex * (200 / cardsPerView)) + '%';
                propertiesContainer.style.transform = `translateX(${translateValue})`;
                
                // Atualizar os dots
                dots.forEach((dot, index) => {
                    if (index === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
            
            // Event listeners para os botões de navegação
            prevBtn.addEventListener('click', function() {
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = Math.ceil(cardCount / cardsPerView) - 1;
                }
                updateCarousel();
            });
            
            nextBtn.addEventListener('click', function() {
                if (currentIndex < Math.ceil(cardCount / cardsPerView) - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateCarousel();
            });
            
            // Event listeners para os dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', function() {
                    currentIndex = index;
                    updateCarousel();
                });
            });
            
            // Inicializar o carrossel
            updateCarousel();
            
            // Ajustar quando a janela for redimensionada
            window.addEventListener('resize', function() {
                const newCardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;
                if (newCardsPerView !== cardsPerView) {
                    currentIndex = 0;
                    updateCarousel();
                }
            });
            
            // Funcionalidade da galeria de imagens
            const galleryIcons = document.querySelectorAll('.gallery-icon');
            const galleryModal = document.querySelector('.gallery-modal');
            const galleryClose = document.querySelector('.gallery-close');
            const galleryMainImage = document.querySelector('.gallery-main-image');
            const galleryPrev = document.querySelector('.gallery-prev');
            const galleryNext = document.querySelector('.gallery-next');
            const galleryThumbnails = document.querySelector('.gallery-thumbnails');
            
            // Dados de exemplo para as galerias (normalmente viriam de um banco de dados)
            const propertyGalleries = {
                1: [
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80',
                    'https://images.unsplash.com/photo-1600566753052-dc5d4c361816?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',

                ],
                2: [
                    'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1084&q=80',
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1153&q=80',
                    'https://images.unsplash.com/photo-1600566753190-17f0d8c4dcaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
                ],
                3: [
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1153&q=80',
                    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                    'https://images.unsplash.com/photo-1600566752732-679f3c10d336?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
                ]
            };
            
            let currentGallery = [];
            let currentImageIndex = 0;
            
            // Abrir a galeria
            galleryIcons.forEach(icon => {
                icon.addEventListener('click', function() {
                    const propertyId = this.getAttribute('data-property');
                    currentGallery = propertyGalleries[propertyId] || [];
                    console.log(currentGallery);

                    if (currentGallery.length > 0) {
                        currentImageIndex = 0;
                        updateGallery();
                        galleryModal.style.display = 'flex';
                    }
                });
            });
            
            // Fechar a galeria
            galleryClose.addEventListener('click', function() {
                galleryModal.style.display = 'none';
            });
            
            // Navegação da galeria
            galleryPrev.addEventListener('click', function() {
                if (currentImageIndex > 0) {
                    currentImageIndex--;
                } else {
                    currentImageIndex = currentGallery.length - 1;
                }
                updateGallery();
            });
            
            galleryNext.addEventListener('click', function() {
                if (currentImageIndex < currentGallery.length - 1) {
                    currentImageIndex++;
                } else {
                    currentImageIndex = 0;
                }
                updateGallery();
            });
            
            // Atualizar a galeria
            function updateGallery() {
                if (currentGallery.length === 0) return;
                
                galleryMainImage.src = currentGallery[currentImageIndex];
                
                // Atualizar miniaturas
                galleryThumbnails.innerHTML = '';
                currentGallery.forEach((img, index) => {
                    const thumbnail = document.createElement('img');
                    thumbnail.src = img;
                    thumbnail.classList.add('gallery-thumbnail');
                    if (index === currentImageIndex) {
                        thumbnail.classList.add('active');
                    }
                    thumbnail.addEventListener('click', function() {
                        currentImageIndex = index;
                        updateGallery();
                    });
                    galleryThumbnails.appendChild(thumbnail);
                });
            }
            
            // Fechar a galeria ao clicar fora da imagem
            galleryModal.addEventListener('click', function(e) {
                if (e.target === galleryModal) {
                    galleryModal.style.display = 'none';
                }
            });
        });