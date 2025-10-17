// Helper para toast messages
function showToastSafe(message, type = 'success') {
    if (typeof cineboxAdapted !== 'undefined') {
        cineboxAdapted.showToast(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// Funcionalidades Avançadas - CineBox
class CineBoxAdvanced {
    constructor() {
        this.watchLater = JSON.parse(localStorage.getItem('cinebox_watch_later')) || [];
        this.customLists = JSON.parse(localStorage.getItem('cinebox_custom_lists')) || [];
        this.ratings = JSON.parse(localStorage.getItem('cinebox_ratings')) || {};
        this.recommendations = [];
        this.init();
    }

    init() {
        this.createAdvancedUI();
        this.setupAdvancedEventListeners();
        this.initializeRecommendations();
        this.setupKeyboardShortcuts();
        this.initializeTheaterMode();
    }

    createAdvancedUI() {
        // Adicionar botões avançados aos cards de filme
        this.enhanceMovieCards();
        
        // Criar sistema de avaliação
        this.createRatingSystem();
        
        // Criar modo teatro
        this.createTheaterMode();
        
        // Criar sistema de listas personalizadas
        this.createCustomListsSystem();
        
        // Criar centro de notificações
        this.createNotificationCenter();
    }

    enhanceMovieCards() {
        // Adicionar botões extras aos cards existentes
        const style = document.createElement('style');
        style.textContent = `
            .movie-card {
                position: relative;
            }
            
            .movie-actions {
                position: absolute;
                top: 10px;
                right: 10px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .movie-card:hover .movie-actions {
                opacity: 1;
            }
            
            .action-btn-small {
                width: 32px;
                height: 32px;
                background: rgba(0, 0, 0, 0.8);
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                font-size: 14px;
            }
            
            .action-btn-small:hover {
                background: var(--primary-color);
                transform: scale(1.1);
            }
            
            .action-btn-small.active {
                background: var(--primary-color);
            }
            
            .rating-stars {
                display: flex;
                gap: 2px;
                margin-top: 8px;
            }
            
            .rating-star {
                color: #666;
                cursor: pointer;
                transition: color 0.2s ease;
                font-size: 14px;
            }
            
            .rating-star.active,
            .rating-star:hover {
                color: #ffd700;
            }
            
            .movie-progress-bar {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 4px;
                background: var(--primary-color);
                transition: width 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    createRatingSystem() {
        // Sistema de avaliação por estrelas
        window.rateMovie = (movieId, rating) => {
            this.ratings[movieId] = rating;
            localStorage.setItem('cinebox_ratings', JSON.stringify(this.ratings));
            if (typeof cineboxAdapted !== 'undefined') {
                cineboxAdapted.showToast(`Avaliação salva: ${rating} estrelas`, 'success');
            }
            this.updateRecommendations();
        };
    }

    createTheaterMode() {
        // Modo teatro para experiência imersiva
        const theaterButton = document.createElement('button');
        theaterButton.className = 'theater-mode-btn';
        theaterButton.innerHTML = '<i class="fas fa-expand"></i>';
        theaterButton.title = 'Modo Teatro (T)';
        theaterButton.onclick = () => this.toggleTheaterMode();
        
        // Adicionar ao player
        document.addEventListener('DOMContentLoaded', () => {
            const playerActions = document.querySelector('.player-actions');
            if (playerActions) {
                playerActions.appendChild(theaterButton);
            }
        });
    }

    createCustomListsSystem() {
        // Sistema de listas personalizadas
        this.createListModal();
    }

    createListModal() {
        const modal = document.createElement('div');
        modal.className = 'list-modal';
        modal.id = 'customListModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Criar Lista Personalizada</h3>
                    <button class="close-modal" onclick="cineboxAdvanced.closeListModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="form-group">
                        <label>Nome da Lista</label>
                        <input type="text" id="listName" placeholder="Ex: Filmes para Maratona">
                    </div>
                    
                    <div class="form-group">
                        <label>Descrição (opcional)</label>
                        <textarea id="listDescription" placeholder="Descrição da sua lista..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Privacidade</label>
                        <select id="listPrivacy">
                            <option value="private">Privada</option>
                            <option value="public">Pública</option>
                        </select>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="cineboxAdvanced.closeListModal()">
                        Cancelar
                    </button>
                    <button class="btn btn-primary" onclick="cineboxAdvanced.createCustomList()">
                        Criar Lista
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    createNotificationCenter() {
        // Centro de notificações
        const notificationCenter = document.createElement('div');
        notificationCenter.className = 'notification-center';
        notificationCenter.id = 'notificationCenter';
        notificationCenter.innerHTML = `
            <div class="notification-header">
                <h4>Notificações</h4>
                <button onclick="cineboxAdvanced.markAllAsRead()">
                    <i class="fas fa-check-double"></i>
                </button>
            </div>
            <div class="notification-list" id="notificationList">
                <!-- Notificações serão adicionadas aqui -->
            </div>
        `;
        
        // Adicionar ao dropdown do usuário
        document.addEventListener('DOMContentLoaded', () => {
            const userMenu = document.querySelector('.user-menu');
            if (userMenu) {
                userMenu.appendChild(notificationCenter);
            }
        });
    }

    setupAdvancedEventListeners() {
        // Picture-in-Picture
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' && e.altKey) {
                this.togglePictureInPicture();
            }
        });

        // Controle de velocidade
        document.addEventListener('keydown', (e) => {
            const player = document.getElementById('moviePlayer');
            if (player && player.contentWindow) {
                if (e.key === ',' && e.shiftKey) {
                    this.changePlaybackSpeed(-0.25);
                } else if (e.key === '.' && e.shiftKey) {
                    this.changePlaybackSpeed(0.25);
                }
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Não executar se estiver digitando em um input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key.toLowerCase()) {
                case 't':
                    this.toggleTheaterMode();
                    break;
                case 'f':
                    this.toggleFullscreen();
                    break;
                case 'm':
                    this.toggleMute();
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'arrowleft':
                    this.seekBackward();
                    break;
                case 'arrowright':
                    this.seekForward();
                    break;
                case 'arrowup':
                    e.preventDefault();
                    this.volumeUp();
                    break;
                case 'arrowdown':
                    e.preventDefault();
                    this.volumeDown();
                    break;
            }
        });
    }

    initializeTheaterMode() {
        this.theaterMode = false;
    }

    initializeRecommendations() {
        // Sistema de recomendações baseado em histórico
        this.generateRecommendations();
    }

    // Funcionalidades do Player Avançado
    toggleTheaterMode() {
        this.theaterMode = !this.theaterMode;
        const body = document.body;
        
        if (this.theaterMode) {
            body.classList.add('theater-mode');
            if (typeof cineboxAdapted !== 'undefined') {
            cineboxAdapted.showToast('Modo Teatro Ativado', 'success');
        }
        } else {
            body.classList.remove('theater-mode');
            cineboxAdapted.showToast('Modo Teatro Desativado', 'success');
        }
    }

    togglePictureInPicture() {
        const player = document.getElementById('moviePlayer');
        if (player && 'pictureInPictureEnabled' in document) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else {
                player.requestPictureInPicture().catch(err => {
                    cineboxAdapted.showToast('Picture-in-Picture não suportado', 'error');
                });
            }
        }
    }

    changePlaybackSpeed(delta) {
        const player = document.getElementById('moviePlayer');
        if (player && player.contentWindow) {
            // Implementar controle de velocidade
            cineboxAdapted.showToast(`Velocidade alterada`, 'success');
        }
    }

    toggleFullscreen() {
        const playerContainer = document.querySelector('.player-container');
        if (playerContainer) {
            if (!document.fullscreenElement) {
                playerContainer.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    }

    togglePlayPause() {
        // Implementar play/pause
        cineboxAdapted.showToast('Play/Pause', 'success');
    }

    toggleMute() {
        // Implementar mute
        cineboxAdapted.showToast('Mute/Unmute', 'success');
    }

    seekBackward() {
        // Voltar 10 segundos
        cineboxAdapted.showToast('← 10s', 'success');
    }

    seekForward() {
        // Avançar 10 segundos
        cineboxAdapted.showToast('10s →', 'success');
    }

    volumeUp() {
        // Aumentar volume
        cineboxAdapted.showToast('Volume +', 'success');
    }

    volumeDown() {
        // Diminuir volume
        cineboxAdapted.showToast('Volume -', 'success');
    }

    // Sistema de Listas Personalizadas
    showCreateListModal() {
        document.getElementById('customListModal').classList.add('active');
    }

    closeListModal() {
        document.getElementById('customListModal').classList.remove('active');
    }

    createCustomList() {
        const name = document.getElementById('listName').value;
        const description = document.getElementById('listDescription').value;
        const privacy = document.getElementById('listPrivacy').value;

        if (!name.trim()) {
            cineboxAdapted.showToast('Nome da lista é obrigatório', 'error');
            return;
        }

        const newList = {
            id: Date.now().toString(),
            name: name.trim(),
            description: description.trim(),
            privacy: privacy,
            movies: [],
            createdAt: new Date().toISOString()
        };

        this.customLists.push(newList);
        localStorage.setItem('cinebox_custom_lists', JSON.stringify(this.customLists));
        
        cineboxAdapted.showToast('Lista criada com sucesso!', 'success');
        this.closeListModal();
        
        // Limpar formulário
        document.getElementById('listName').value = '';
        document.getElementById('listDescription').value = '';
    }

    addToWatchLater(movieId) {
        if (!this.watchLater.includes(movieId)) {
            this.watchLater.push(movieId);
            localStorage.setItem('cinebox_watch_later', JSON.stringify(this.watchLater));
            cineboxAdapted.showToast('Adicionado para assistir depois', 'success');
        } else {
            cineboxAdapted.showToast('Já está na lista para assistir depois', 'warning');
        }
    }

    removeFromWatchLater(movieId) {
        const index = this.watchLater.indexOf(movieId);
        if (index > -1) {
            this.watchLater.splice(index, 1);
            localStorage.setItem('cinebox_watch_later', JSON.stringify(this.watchLater));
            cineboxAdapted.showToast('Removido da lista', 'success');
        }
    }

    // Sistema de Recomendações
    generateRecommendations() {
        if (typeof cineboxAdapted === 'undefined') {
            this.recommendations = [];
            return;
        }
        
        const watchHistory = Object.keys(cineboxAdapted.watchProgress || {});
        const favoriteGenres = this.getFavoriteGenres();
        
        // Algoritmo simples de recomendação
        this.recommendations = cineboxAdapted.movies.filter(movie => {
            return !watchHistory.includes(movie.id) && 
                   favoriteGenres.includes(movie.genre);
        }).slice(0, 10);
    }

    getFavoriteGenres() {
        if (typeof cineboxAdapted === 'undefined') {
            return [];
        }
        
        const genreCount = {};
        const favorites = cineboxAdapted.favorites || [];
        
        favorites.forEach(movieId => {
            const movie = cineboxAdapted.movies.find(m => m.id === movieId);
            if (movie && movie.genre) {
                genreCount[movie.genre] = (genreCount[movie.genre] || 0) + 1;
            }
        });
        
        return Object.keys(genreCount).sort((a, b) => genreCount[b] - genreCount[a]);
    }

    updateRecommendations() {
        this.generateRecommendations();
        // Atualizar UI se necessário
    }

    // Sistema de Notificações
    addNotification(title, message, type = 'info') {
        const notification = {
            id: Date.now().toString(),
            title,
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false
        };

        const notifications = JSON.parse(localStorage.getItem('cinebox_notifications')) || [];
        notifications.unshift(notification);
        
        // Manter apenas as últimas 50 notificações
        if (notifications.length > 50) {
            notifications.splice(50);
        }
        
        localStorage.setItem('cinebox_notifications', JSON.stringify(notifications));
        this.updateNotificationBadge();
    }

    updateNotificationBadge() {
        const notifications = JSON.parse(localStorage.getItem('cinebox_notifications')) || [];
        const unreadCount = notifications.filter(n => !n.read).length;
        
        const badge = document.querySelector('.notification-dot');
        if (badge) {
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    markAllAsRead() {
        const notifications = JSON.parse(localStorage.getItem('cinebox_notifications')) || [];
        notifications.forEach(n => n.read = true);
        localStorage.setItem('cinebox_notifications', JSON.stringify(notifications));
        this.updateNotificationBadge();
    }

    // Análise de Dados do Usuário
    getUserStats() {
        if (typeof cineboxAdapted === 'undefined') {
            return {
                totalWatched: 0,
                totalFavorites: 0,
                totalRatings: 0,
                averageRating: 0,
                favoriteGenre: 'Não definido',
                watchTime: 0
            };
        }
        
        const watchHistory = Object.keys(cineboxAdapted.watchProgress || {});
        const favorites = cineboxAdapted.favorites || [];
        const ratings = Object.keys(this.ratings);
        
        return {
            totalWatched: watchHistory.length,
            totalFavorites: favorites.length,
            totalRatings: ratings.length,
            averageRating: this.getAverageRating(),
            favoriteGenre: this.getFavoriteGenres()[0] || 'Não definido',
            watchTime: this.calculateWatchTime()
        };
    }

    getAverageRating() {
        const ratings = Object.values(this.ratings);
        if (ratings.length === 0) return 0;
        return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
    }

    calculateWatchTime() {
        if (typeof cineboxAdapted === 'undefined') {
            return 0;
        }
        const watchHistory = Object.keys(cineboxAdapted.watchProgress || {});
        // Estimativa: 2 horas por filme
        return watchHistory.length * 2;
    }

    // Compartilhamento Social
    shareMovie(movieId) {
        if (typeof cineboxAdapted === 'undefined') {
            return;
        }
        const movie = cineboxAdapted.movies.find(m => m.id === movieId);
        if (!movie) return;

        if (navigator.share) {
            navigator.share({
                title: movie.title,
                text: `Confira este filme incrível: ${movie.title}`,
                url: window.location.href
            });
        } else {
            // Fallback para copiar link
            navigator.clipboard.writeText(window.location.href);
            cineboxAdapted.showToast('Link copiado para a área de transferência!', 'success');
        }
    }

    // Modo Escuro/Claro
    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('cinebox_theme', newTheme);
        
        cineboxAdapted.showToast(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`, 'success');
    }
}

// Inicializar funcionalidades avançadas
const cineboxAdvanced = new CineBoxAdvanced();
