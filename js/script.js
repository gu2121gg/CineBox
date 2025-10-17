// CineBox Adapted - Visual Original + Mecânica do Projeto
class CineBoxAdapted {
    constructor() {
        this.currentMovie = null;
        this.currentPage = 'home';
        this.favorites = JSON.parse(localStorage.getItem('cinebox_favorites')) || [];
        this.watchProgress = JSON.parse(localStorage.getItem('cinebox_progress')) || {};
        this.movies = [];
        this.series = [];
        this.init();
    }

    init() {
        this.loadMovieData();
        this.loadMoviesFromFirestore(); // Carregar do Firestore e adicionar aos existentes!
        this.setupEventListeners();
        this.setupScrollEffect();
        this.loadHomePage();
    }

    loadMovieData() {
        // Usar dados do sistema original se disponível
        if (typeof movieCatalog !== 'undefined') {
            this.movies = [
                ...movieCatalog.trending,
                ...movieCatalog.action,
                ...movieCatalog.comedy,
                ...movieCatalog.drama || []
            ];
            this.series = movieCatalog.series || [];
        } else {
            // Dados de exemplo se não houver o sistema original
            this.movies = [
                {
                    id: 'movie1',
                    title: 'Filme Exemplo 1',
                    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
                    year: 2024,
                    duration: '2h 30min',
                    rating: '8.5',
                    genre: 'action',
                    description: 'Um filme incrível com muita ação e aventura que vai te deixar na borda da cadeira.',
                    embedUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
                    isNew: true
                },
                {
                    id: 'movie2',
                    title: 'Comédia Romântica',
                    poster: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
                    year: 2023,
                    duration: '1h 45min',
                    rating: '7.8',
                    genre: 'comedy',
                    description: 'Uma história de amor divertida e emocionante.',
                    embedUrl: 'https://www.youtube.com/embed/0pdqf4P9MB8'
                },
                {
                    id: 'movie3',
                    title: 'Drama Intenso',
                    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
                    year: 2023,
                    duration: '2h 15min',
                    rating: '9.2',
                    genre: 'drama',
                    description: 'Um drama profundo que explora as complexidades da vida humana.',
                    embedUrl: 'https://www.youtube.com/embed/5xH0HfJHsaY'
                }
            ];
            this.series = [];
        }
    }

    // Carregar filmes adicionados pelo Admin Panel do Firestore
    async loadMoviesFromFirestore() {
        try {
            if (typeof db !== 'undefined') {
                console.log('🔥 Buscando filmes do Admin Panel no Firestore...');
                const snapshot = await db.collection('movies').get();
                
                if (snapshot.size > 0) {
                    const firestoreMovies = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    
                    console.log(`✅ ${firestoreMovies.length} filmes do Admin Panel carregados!`);
                    
                    // Separar filmes NOVOS (isNew=true) para aparecer em destaque
                    const newMovies = firestoreMovies.filter(m => m.isNew);
                    const normalMovies = firestoreMovies.filter(m => !m.isNew);
                    
                    // Adicionar filmes NOVOS no início (destaque)
                    // Depois adicionar filmes normais
                    this.movies = [...newMovies, ...this.movies, ...normalMovies];
                    
                    console.log(`🆕 ${newMovies.length} filmes NOVOS em destaque!`);
                    
                    // Recarregar carrosséis para mostrar os novos filmes
                    setTimeout(() => {
                        this.loadHomePage();
                    }, 1000);
                } else {
                    console.log('ℹ️ Nenhum filme adicionado pelo Admin ainda');
                }
            }
        } catch (error) {
            console.log('⚠️ Firestore offline - usando apenas filmes do data.js');
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                }
            });
        }

        // Hero actions
        const playHeroBtn = document.getElementById('playHeroBtn');
        if (playHeroBtn) {
            playHeroBtn.addEventListener('click', () => {
                if (this.currentMovie) {
                    this.playMovie(this.currentMovie.id);
                }
            });
        }

        const addToListBtn = document.getElementById('addToListBtn');
        if (addToListBtn) {
            addToListBtn.addEventListener('click', () => {
                if (this.currentMovie) {
                    this.toggleFavorite(this.currentMovie.id);
                }
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (typeof cineboxAuth !== 'undefined') {
                    cineboxAuth.logout();
                } else {
                    this.logout();
                }
            });
        }

        // Player modal
        const closePlayer = document.getElementById('closePlayer');
        if (closePlayer) {
            closePlayer.addEventListener('click', () => {
                this.closePlayer();
            });
        }

        // Carousel buttons
        this.setupCarouselButtons();

        // Filters
        const genreFilter = document.getElementById('genreFilter');
        const yearFilter = document.getElementById('yearFilter');
        
        if (genreFilter) {
            genreFilter.addEventListener('change', () => this.applyFilters());
        }
        
        if (yearFilter) {
            yearFilter.addEventListener('change', () => this.applyFilters());
        }
    }

    setupScrollEffect() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });
    }

    setupCarouselButtons() {
        // Trending carousel
        const trendingPrev = document.getElementById('trendingPrev');
        const trendingNext = document.getElementById('trendingNext');
        const trendingList = document.getElementById('trendingList');
        
        if (trendingPrev && trendingNext && trendingList) {
            trendingPrev.addEventListener('click', () => this.scrollCarousel(trendingList, -1));
            trendingNext.addEventListener('click', () => this.scrollCarousel(trendingList, 1));
        }

        // Action carousel
        const actionPrev = document.getElementById('actionPrev');
        const actionNext = document.getElementById('actionNext');
        const actionList = document.getElementById('actionList');
        
        if (actionPrev && actionNext && actionList) {
            actionPrev.addEventListener('click', () => this.scrollCarousel(actionList, -1));
            actionNext.addEventListener('click', () => this.scrollCarousel(actionList, 1));
        }

        // Comedy carousel
        const comedyPrev = document.getElementById('comedyPrev');
        const comedyNext = document.getElementById('comedyNext');
        const comedyList = document.getElementById('comedyList');
        
        if (comedyPrev && comedyNext && comedyList) {
            comedyPrev.addEventListener('click', () => this.scrollCarousel(comedyList, -1));
            comedyNext.addEventListener('click', () => this.scrollCarousel(comedyList, 1));
        }
    }

    scrollCarousel(container, direction) {
        const scrollAmount = 220; // Width of card + gap
        container.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }

    navigateToPage(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Show selected page
        const targetPage = document.getElementById(page + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
        }
        
        // Load page content
        switch(page) {
            case 'home':
                this.loadHomePage();
                break;
            case 'movies':
                this.loadMoviesPage();
                break;
            case 'series':
                this.loadSeriesPage();
                break;
            case 'favorites':
                this.loadFavoritesPage();
                break;
        }
    }

    loadHomePage() {
        // Set hero movie
        const featuredMovie = this.movies.find(m => m.isNew) || this.movies[0];
        if (featuredMovie) {
            this.setHeroMovie(featuredMovie);
        }

        // Load continue watching FIRST
        this.loadContinueWatching();

        // Load carousels
        // Em Alta Hoje - Priorizar filmes NOVOS (isNew=true)
        const trendingMovies = [
            ...this.movies.filter(m => m.isNew),
            ...this.movies.filter(m => !m.isNew)
        ].slice(0, 10);
        
        this.loadCarousel('trendingList', trendingMovies);
        this.loadCarousel('actionList', this.movies.filter(m => m.category === 'action' || m.genre === 'action').slice(0, 10));
        this.loadCarousel('comedyList', this.movies.filter(m => m.category === 'comedy' || m.genre === 'comedy').slice(0, 10));
    }

    setHeroMovie(movie) {
        this.currentMovie = movie;
        
        document.getElementById('heroTitle').textContent = movie.title;
        document.getElementById('heroDescription').textContent = movie.description || 'Descrição não disponível';
        document.getElementById('heroYear').textContent = movie.year || '2024';
        document.getElementById('heroDuration').textContent = movie.duration || '2h';
        document.getElementById('heroRating').textContent = `★ ${movie.rating || '8.0'}`;
        
        const heroImage = document.getElementById('heroImage');
        // Usar backdrop se existir, senão usar poster
        heroImage.src = movie.backdrop || movie.poster;
        heroImage.alt = movie.title;
        
        // Update add to list button
        const addToListBtn = document.getElementById('addToListBtn');
        const isFavorite = this.favorites.includes(movie.id);
        addToListBtn.innerHTML = isFavorite ? 
            '<i class="fas fa-check"></i> Na Minha Lista' : 
            '<i class="fas fa-plus"></i> Minha Lista';
    }

    loadCarousel(containerId, movies) {
        const container = document.getElementById(containerId);
        if (!container || !movies.length) return;

        container.innerHTML = movies.map(movie => this.createMovieCard(movie)).join('');
    }

    createMovieCard(movie) {
        return `
            <div class="movie-card" onclick="cineboxAdapted.playMovie('${movie.id}')">
                <div class="movie-poster" style="background-image: url(${movie.poster})">
                    <div class="movie-overlay">
                        <button class="play-btn">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="movie-info">
                    <div class="movie-title">${movie.title}</div>
                    <div class="movie-meta">
                        <span>${movie.year || '2024'}</span>
                        <span>${movie.duration || '2h'}</span>
                        <span>★ ${movie.rating || '8.0'}</span>
                    </div>
                    <div class="movie-description">${(movie.description || '').substring(0, 100)}...</div>
                </div>
            </div>
        `;
    }

    loadMoviesPage() {
        this.renderMoviesGrid('allMoviesGrid', this.movies);
    }

    loadSeriesPage() {
        this.renderMoviesGrid('seriesGrid', this.series);
    }

    loadFavoritesPage() {
        const favoriteMovies = this.movies.filter(movie => this.favorites.includes(movie.id));
        const favoriteSeries = this.series.filter(serie => this.favorites.includes(serie.id));
        const allFavorites = [...favoriteMovies, ...favoriteSeries];
        
        const emptyState = document.getElementById('emptyFavorites');
        const grid = document.getElementById('favoritesGrid');
        
        if (allFavorites.length === 0) {
            emptyState.style.display = 'block';
            grid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            grid.style.display = 'grid';
            this.renderMoviesGrid('favoritesGrid', allFavorites);
        }
    }

    loadProfilePage() {
        // Calcular estatísticas REAIS baseadas no histórico do usuário
        const realWatchHistory = Object.keys(this.watchProgress).filter(movieId => {
            const progress = this.watchProgress[movieId];
            // Só contar se realmente assistiu (progresso > 10% ou marcado como assistido)
            return progress && (progress.watched === true || progress.progress > 10);
        });
        
        const totalWatched = realWatchHistory.length;
        const totalFavorites = this.favorites.length;
        
        // Calcular tempo REAL assistido (baseado no histórico)
        let totalMinutes = 0;
        realWatchHistory.forEach(movieId => {
            const movie = this.movies.find(m => m.id === movieId);
            if (movie && movie.duration) {
                // Converter duração (ex: "2h 30min") para minutos
                const hours = movie.duration.match(/(\d+)h/);
                const minutes = movie.duration.match(/(\d+)min/);
                totalMinutes += (hours ? parseInt(hours[1]) * 60 : 0) + (minutes ? parseInt(minutes[1]) : 0);
            }
        });
        
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        const timeText = totalHours > 0 ? `${totalHours}h ${remainingMinutes}min` : `${remainingMinutes}min`;
        
        // Séries assistidas (baseado em histórico real)
        const watchedSeries = this.series.filter(s => this.watchProgress[s.id]);
        
        // Atualizar estatísticas
        const totalWatchedEl = document.getElementById('totalWatched');
        const totalFavoritesEl = document.getElementById('totalFavorites');
        const totalSeriesEl = document.getElementById('totalSeries');
        const totalHoursEl = document.getElementById('totalHours');
        
        if (totalWatchedEl) totalWatchedEl.textContent = totalWatched;
        if (totalFavoritesEl) totalFavoritesEl.textContent = totalFavorites;
        if (totalSeriesEl) totalSeriesEl.textContent = watchedSeries.length;
        if (totalHoursEl) totalHoursEl.textContent = totalWatched > 0 ? timeText : '0min';
        
        // Atualizar informações do usuário
        if (typeof cineboxAuth !== 'undefined' && cineboxAuth.currentUser) {
            const profileName = document.getElementById('profileName');
            const profileEmail = document.getElementById('profileEmail');
            const profileImage = document.getElementById('profileImage');
            
            if (profileName) profileName.textContent = cineboxAuth.currentUser.displayName || 'Usuário';
            if (profileEmail) profileEmail.textContent = cineboxAuth.currentUser.email || '';
            if (profileImage) profileImage.src = cineboxAuth.currentUser.photoURL || 'https://i.pravatar.cc/120';
        }
    }

    loadContinueWatching() {
        // Sistema "Continuar Assistindo" nível Netflix/Prime
        // Só mostrar filmes que foram realmente iniciados mas não terminados
        const continueWatchingMovies = Object.keys(this.watchProgress)
            .filter(movieId => {
                const progress = this.watchProgress[movieId];
                // Mostrar se: assistiu entre 5% e 95% (não terminado)
                return progress && progress.progress >= 5 && progress.progress < 95;
            })
            .map(movieId => {
                const movie = this.movies.find(m => m.id === movieId);
                if (movie) {
                    // Adicionar dados de progresso ao objeto do filme
                    return {
                        ...movie,
                        watchProgress: this.watchProgress[movieId].progress,
                        lastWatched: this.watchProgress[movieId].lastWatched
                    };
                }
                return null;
            })
            .filter(movie => movie)
            // Ordenar por mais recente
            .sort((a, b) => new Date(b.lastWatched) - new Date(a.lastWatched))
            .slice(0, 6);
            
        const section = document.getElementById('continueWatchingSection');
        if (!section) return;
        
        if (continueWatchingMovies.length > 0) {
            section.style.display = 'block';
            this.renderContinueWatching('continueWatchingList', continueWatchingMovies);
        } else {
            section.style.display = 'none';
        }
    }
    
    renderContinueWatching(containerId, movies) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = movies.map(movie => `
            <div class="movie-card" onclick="cineboxAdapted.playMovie('${movie.id}')">
                <div class="movie-poster" style="background-image: url(${movie.poster})">
                    <div class="movie-overlay">
                        <button class="play-btn">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                    <!-- Barra de progresso visual (como Netflix) -->
                    <div class="movie-progress-bar" style="width: ${movie.watchProgress}%"></div>
                </div>
                <div class="movie-info">
                    <div class="movie-title">${movie.title}</div>
                    <div class="movie-meta">
                        <span>${movie.year || '2024'}</span>
                        <span>${movie.watchProgress}% assistido</span>
                    </div>
                    <div class="movie-description">${(movie.description || '').substring(0, 100)}...</div>
                </div>
            </div>
        `).join('');
    }

    renderMoviesGrid(containerId, movies) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = movies.map(movie => this.createMovieCard(movie)).join('');
    }

    playMovie(movieId) {
        const movie = this.movies.find(m => m.id === movieId) || this.series.find(s => s.id === movieId);
        if (!movie) return;

        // Usar mecânica original se disponível
        if (typeof cinebox !== 'undefined' && cinebox.openMoviePlayer) {
            cinebox.openMoviePlayer(movieId);
            return;
        }

        // Player próprio
        this.openPlayer(movie);
    }

    openPlayer(movie) {
        const modal = document.getElementById('playerModal');
        const player = document.getElementById('moviePlayer');
        const title = document.getElementById('playerTitle');
        const year = document.getElementById('playerYear');
        const duration = document.getElementById('playerDuration');
        const rating = document.getElementById('playerRating');
        const description = document.getElementById('playerDescription');

        title.textContent = movie.title;
        year.textContent = movie.year || '2024';
        duration.textContent = movie.duration || '2h';
        rating.textContent = `★ ${movie.rating || '8.0'}`;
        description.textContent = movie.description || 'Descrição não disponível';

        // Set video source
        if (movie.embedUrl) {
            player.src = movie.embedUrl;
        } else {
            player.src = 'data:text/html,<html><body style="background:#141414;color:#fff;display:flex;align-items:center;justify-content:center;font-family:Poppins;font-size:18px;"><div style="text-align:center;"><h2>🎬 Em Breve</h2><p>Este conteúdo estará disponível em breve!</p></div></body></html>';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Update favorite button in player
        const addToFavoritesBtn = document.getElementById('addToFavoritesBtn');
        if (addToFavoritesBtn) {
            const isFavorite = this.favorites.includes(movie.id);
            addToFavoritesBtn.innerHTML = isFavorite ? 
                '<i class="fas fa-heart"></i> Remover dos Favoritos' : 
                '<i class="far fa-heart"></i> Adicionar aos Favoritos';
            
            addToFavoritesBtn.onclick = () => {
                this.toggleFavorite(movie.id);
                // Update button text
                const newIsFavorite = this.favorites.includes(movie.id);
                addToFavoritesBtn.innerHTML = newIsFavorite ? 
                    '<i class="fas fa-heart"></i> Remover dos Favoritos' : 
                    '<i class="far fa-heart"></i> Adicionar aos Favoritos';
            };
        }

        // Save watch progress
        this.saveWatchProgress(movie.id);
    }

    closePlayer() {
        const modal = document.getElementById('playerModal');
        const player = document.getElementById('moviePlayer');
        
        modal.classList.remove('active');
        player.src = '';
        document.body.style.overflow = 'auto';
    }

    toggleFavorite(movieId) {
        const index = this.favorites.indexOf(movieId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showToast('Removido dos favoritos', 'success');
        } else {
            this.favorites.push(movieId);
            this.showToast('Adicionado aos favoritos', 'success');
        }
        
        localStorage.setItem('cinebox_favorites', JSON.stringify(this.favorites));
        
        // Update UI if needed
        if (this.currentMovie && this.currentMovie.id === movieId) {
            const addToListBtn = document.getElementById('addToListBtn');
            if (addToListBtn) {
                const isFavorite = this.favorites.includes(movieId);
                addToListBtn.innerHTML = isFavorite ? 
                    '<i class="fas fa-check"></i> Na Minha Lista' : 
                    '<i class="fas fa-plus"></i> Minha Lista';
            }
        }
        
        // Refresh favorites page if active
        if (this.currentPage === 'favorites') {
            this.loadFavoritesPage();
        }
    }

    saveWatchProgress(movieId, options = {}) {
        const movie = this.movies.find(m => m.id === movieId) || this.series.find(s => s.id === movieId);
        
        // Sistema de rastreamento REAL nível Netflix/Prime
        const existingProgress = this.watchProgress[movieId] || {};
        
        this.watchProgress[movieId] = {
            timestamp: Date.now(),
            lastWatched: new Date().toISOString(),
            progress: options.progress || existingProgress.progress || 0,
            watched: options.watched || false,
            duration: movie ? movie.duration : null,
            title: movie ? movie.title : 'Desconhecido',
            poster: movie ? movie.poster : null,
            startedAt: existingProgress.startedAt || Date.now(),
            timesWatched: (existingProgress.timesWatched || 0) + 1,
            totalTimeWatched: (existingProgress.totalTimeWatched || 0)
        };
        
        localStorage.setItem('cinebox_progress', JSON.stringify(this.watchProgress));
        
        // Sincronizar com Firebase se disponível
        if (typeof cineboxAuth !== 'undefined' && cineboxAuth.currentUser && firebaseAuth.isReady) {
            this.syncProgressToFirebase(movieId);
        }
    }
    
    // Sincronizar progresso com Firebase (nível Netflix)
    async syncProgressToFirebase(movieId) {
        try {
            if (firebaseAuth.isReady && cineboxAuth.currentUser) {
                const userRef = db.collection('users').doc(cineboxAuth.currentUser.uid);
                await userRef.collection('watchProgress').doc(movieId).set({
                    ...this.watchProgress[movieId],
                    userId: cineboxAuth.currentUser.uid,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            }
        } catch (error) {
            console.log('Sincronização offline - dados salvos localmente');
        }
    }
    
    // Marcar filme como assistido completamente
    markAsWatched(movieId) {
        this.saveWatchProgress(movieId, {
            progress: 100,
            watched: true
        });
        this.showToast('Marcado como assistido', 'success');
    }
    
    // Atualizar progresso do player em tempo real
    updatePlaybackProgress(movieId, currentTime, duration) {
        const progressPercent = (currentTime / duration) * 100;
        
        // Só salvar se assistiu mais de 5%
        if (progressPercent >= 5) {
            const existingProgress = this.watchProgress[movieId] || {};
            
            this.watchProgress[movieId] = {
                ...existingProgress,
                timestamp: Date.now(),
                progress: Math.floor(progressPercent),
                currentTime: currentTime,
                duration: duration,
                // Marcar como assistido se passou de 90%
                watched: progressPercent >= 90 ? true : (existingProgress.watched || false)
            };
            
            // Salvar a cada 10 segundos (não em todo frame)
            if (!this._lastSave || Date.now() - this._lastSave > 10000) {
                localStorage.setItem('cinebox_progress', JSON.stringify(this.watchProgress));
                this._lastSave = Date.now();
            }
        }
    }

    handleSearch(query) {
        if (!query.trim()) return;
        
        const results = this.movies.filter(movie =>
            movie.title.toLowerCase().includes(query.toLowerCase()) ||
            (movie.description && movie.description.toLowerCase().includes(query.toLowerCase()))
        );
        
        if (results.length > 0) {
            this.navigateToPage('movies');
            setTimeout(() => {
                this.renderMoviesGrid('allMoviesGrid', results);
            }, 100);
        } else {
            this.showToast('Nenhum resultado encontrado', 'warning');
        }
    }

    applyFilters() {
        const genreFilter = document.getElementById('genreFilter').value;
        const yearFilter = document.getElementById('yearFilter').value;
        
        let filteredMovies = [...this.movies];
        
        if (genreFilter) {
            filteredMovies = filteredMovies.filter(movie => movie.genre === genreFilter);
        }
        
        if (yearFilter) {
            filteredMovies = filteredMovies.filter(movie => movie.year == yearFilter);
        }
        
        this.renderMoviesGrid('allMoviesGrid', filteredMovies);
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const icon = toast.querySelector('.toast-icon');
        const messageEl = toast.querySelector('.toast-message');
        
        // Set icon based on type
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle'
        };
        
        icon.className = `toast-icon ${icons[type] || icons.success}`;
        messageEl.textContent = message;
        toast.className = `toast ${type}`;
        
        // Show toast
        toast.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Sincronizar progresso entre dispositivos
    async syncWatchProgress() {
        try {
            const user = localStorage.getItem('cinebox_user');
            if (!user || typeof db === 'undefined') return;

            const userData = JSON.parse(user);
            const userId = userData.email;

            // Salvar progresso local no Firestore
            await db.collection('userProgress').doc(userId).set({
                watchProgress: this.watchProgress,
                lastSync: new Date().toISOString()
            }, { merge: true });

            console.log('✅ Progresso sincronizado com Firestore');

        } catch (error) {
            console.log('⚠️ Erro ao sincronizar progresso:', error);
        }
    }

    // Carregar progresso do Firestore ao fazer login
    async loadWatchProgressFromFirestore() {
        try {
            const user = localStorage.getItem('cinebox_user');
            if (!user || typeof db === 'undefined') return;

            const userData = JSON.parse(user);
            const userId = userData.email;

            const doc = await db.collection('userProgress').doc(userId).get();
            
            if (doc.exists) {
                const data = doc.data();
                // Mesclar com progresso local (manter o mais recente)
                this.watchProgress = { ...this.watchProgress, ...data.watchProgress };
                localStorage.setItem('cinebox_progress', JSON.stringify(this.watchProgress));
                console.log('✅ Progresso carregado do Firestore');
                
                // Recarregar seção continuar assistindo
                this.loadContinueWatching();
            }

        } catch (error) {
            console.log('⚠️ Erro ao carregar progresso:', error);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cineboxAdapted = new CineBoxAdapted();
});

// Global functions for compatibility
function playMovie(movieId) {
    if (window.cineboxAdapted) {
        cineboxAdapted.playMovie(movieId);
    }
}
