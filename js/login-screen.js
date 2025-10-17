// Tela de Login Inicial - CineBox
class LoginScreen {
    constructor() {
        this.isFirstVisit = !localStorage.getItem('cinebox_visited');
        this.init();
    }

    init() {
        // Aguardar Firebase verificar autenticação antes de decidir
        setTimeout(() => {
            // Se Firebase está pronto, ele vai gerenciar o estado
            if (typeof firebaseAuth !== 'undefined' && firebaseAuth.isReady) {
                // Firebase está gerenciando - aguardar onAuthStateChanged
                return;
            }
            
            // Firebase não disponível - verificar sessão local
            if (this.isFirstVisit || !this.hasValidSession()) {
                this.showLoginScreen();
            } else {
                this.showMainApp();
            }
        }, 500); // Aguardar Firebase inicializar
    }

    hasValidSession() {
        const user = localStorage.getItem('cinebox_user');
        const remember = localStorage.getItem('cinebox_remember');
        const visited = localStorage.getItem('cinebox_visited');
        return (user && remember) || visited === 'true';
    }

    showLoginScreen() {
        // Esconder conteúdo principal
        const mainContent = document.querySelector('.main-content');
        const header = document.querySelector('.header');
        
        if (mainContent) mainContent.style.display = 'none';
        if (header) header.style.display = 'none';

        // Criar tela de login
        this.createLoginScreen();
    }

    showMainApp() {
        // Mostrar conteúdo principal
        const mainContent = document.querySelector('.main-content');
        const header = document.querySelector('.header');
        
        if (mainContent) mainContent.style.display = 'block';
        if (header) header.style.display = 'block';

        // Remover tela de login se existir
        const loginScreen = document.getElementById('initialLoginScreen');
        if (loginScreen) {
            loginScreen.remove();
        }

        // Marcar como visitado
        localStorage.setItem('cinebox_visited', 'true');
    }

    createLoginScreen() {
        const loginScreen = document.createElement('div');
        loginScreen.id = 'initialLoginScreen';
        loginScreen.className = 'initial-login-screen';
        
        loginScreen.innerHTML = `
            <div class="login-screen-bg">
                <video autoplay muted loop>
                    <source src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/video-tv-0819.m4v" type="video/mp4">
                </video>
                <div class="login-screen-overlay"></div>
            </div>
            
            <div class="login-screen-content">
                <div class="login-screen-header">
                    <div class="login-screen-logo">
                        <span class="logo-cine">CINE</span><span class="logo-box">BOX</span>
                    </div>
                </div>
                
                <div class="login-screen-main">
                    <div class="welcome-content">
                        <h1>Bem-vindo ao CineBox</h1>
                        <p>Sua plataforma de streaming premium com milhares de filmes e séries</p>
                        
                        <div class="features-grid">
                            <div class="feature-item">
                                <i class="fas fa-play-circle"></i>
                                <span>Filmes em HD</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-tv"></i>
                                <span>Séries Exclusivas</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-mobile-alt"></i>
                                <span>Assista em Qualquer Lugar</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-download"></i>
                                <span>Download Offline</span>
                            </div>
                        </div>
                        
                        <div class="login-screen-actions">
                            <button class="btn-welcome btn-primary" onclick="loginScreen.showLoginModal()">
                                <i class="fas fa-sign-in-alt"></i>
                                Entrar
                            </button>
                            <button class="btn-welcome btn-secondary" onclick="loginScreen.showRegisterModal()">
                                <i class="fas fa-user-plus"></i>
                                Criar Conta
                            </button>
                            <button class="btn-welcome btn-guest" onclick="loginScreen.continueAsGuest()">
                                <i class="fas fa-user"></i>
                                Continuar como Visitante
                            </button>
                        </div>
                        
                    </div>
                </div>
                
                <div class="login-screen-footer">
                    <p>&copy; 2024 CineBox. Todos os direitos reservados.</p>
                </div>
            </div>
        `;

        document.body.appendChild(loginScreen);
        this.addLoginScreenStyles();
    }

    addLoginScreenStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .initial-login-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9998;
                display: flex;
                flex-direction: column;
            }

            .login-screen-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            .login-screen-bg video {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .login-screen-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(229,9,20,0.3) 100%);
            }

            .login-screen-content {
                position: relative;
                z-index: 2;
                display: flex;
                flex-direction: column;
                height: 100%;
                color: white;
            }

            .login-screen-header {
                padding: 2rem;
                display: flex;
                justify-content: center;
            }

            .login-screen-logo {
                font-family: 'Poppins', sans-serif;
                font-size: 3rem;
                font-weight: 800;
                letter-spacing: 2px;
            }

            .logo-cine {
                color: white;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }

            .logo-box {
                color: var(--primary-color);
                text-shadow: 0 0 20px rgba(229, 9, 20, 0.5);
            }

            .login-screen-main {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }

            .welcome-content {
                text-align: center;
                max-width: 600px;
            }

            .welcome-content h1 {
                font-size: 3.5rem;
                font-weight: 700;
                margin-bottom: 1rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            }

            .welcome-content p {
                font-size: 1.3rem;
                margin-bottom: 3rem;
                color: rgba(255,255,255,0.9);
                text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            }

            .features-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
                margin-bottom: 3rem;
            }

            .feature-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                font-size: 1.1rem;
                font-weight: 500;
            }

            .feature-item i {
                font-size: 2rem;
                color: var(--primary-color);
            }

            .login-screen-actions {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-bottom: 3rem;
            }

            .btn-welcome {
                padding: 1rem 2rem;
                border: none;
                border-radius: 8px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }

            .btn-welcome.btn-primary {
                background: var(--primary-color);
                color: white;
            }

            .btn-welcome.btn-primary:hover {
                background: var(--primary-hover);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(229, 9, 20, 0.4);
            }

            .btn-welcome.btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            .btn-welcome.btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }

            .btn-welcome.btn-guest {
                background: transparent;
                color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            .btn-welcome.btn-guest:hover {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }

            .demo-accounts {
                background: rgba(0, 0, 0, 0.5);
                padding: 2rem;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .demo-accounts h4 {
                margin-bottom: 1.5rem;
                color: var(--primary-color);
                font-size: 1.2rem;
            }

            .demo-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }

            .demo-account {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .demo-account:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: var(--primary-color);
                transform: translateY(-2px);
            }

            .demo-account i {
                font-size: 1.5rem;
                color: var(--primary-color);
            }

            .demo-account strong {
                display: block;
                margin-bottom: 0.25rem;
            }

            .demo-account small {
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.9rem;
            }

            .login-screen-footer {
                padding: 2rem;
                text-align: center;
                color: rgba(255, 255, 255, 0.6);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            @media (max-width: 768px) {
                .login-screen-logo {
                    font-size: 2rem;
                }

                .welcome-content h1 {
                    font-size: 2.5rem;
                }

                .welcome-content p {
                    font-size: 1.1rem;
                }

                .features-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }

                .demo-grid {
                    grid-template-columns: 1fr;
                }

                .login-screen-main {
                    padding: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    showLoginModal() {
        // Esconder temporariamente a tela de boas-vindas
        const loginScreen = document.getElementById('initialLoginScreen');
        if (loginScreen) {
            loginScreen.style.display = 'none';
        }
        
        if (typeof cineboxAuth !== 'undefined') {
            cineboxAuth.showLogin();
            
            // Quando o modal fechar, mostrar a tela de boas-vindas novamente
            this.setupModalCloseListener('loginModal');
        }
    }

    showRegisterModal() {
        // Esconder temporariamente a tela de boas-vindas
        const loginScreen = document.getElementById('initialLoginScreen');
        if (loginScreen) {
            loginScreen.style.display = 'none';
        }
        
        if (typeof cineboxAuth !== 'undefined') {
            cineboxAuth.showRegister();
            
            // Quando o modal fechar, mostrar a tela de boas-vindas novamente
            this.setupModalCloseListener('registerModal');
        }
    }

    setupModalCloseListener(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Observer para detectar quando o modal é fechado
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (!target.classList.contains('active')) {
                        // Modal foi fechado, mostrar tela de boas-vindas novamente
                        const loginScreen = document.getElementById('initialLoginScreen');
                        if (loginScreen && !this.hasValidSession()) {
                            loginScreen.style.display = 'flex';
                        }
                        observer.disconnect();
                    }
                }
            });
        });

        observer.observe(modal, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    continueAsGuest() {
        // Criar usuário visitante
        const guestUser = {
            uid: 'guest_' + Date.now(),
            email: 'visitante@cinebox.com',
            displayName: 'Visitante',
            photoURL: 'https://ui-avatars.com/api/?name=Visitante&background=666&color=fff'
        };

        localStorage.setItem('cinebox_user', JSON.stringify(guestUser));
        localStorage.setItem('cinebox_visited', 'true');

        if (typeof cineboxAuth !== 'undefined') {
            cineboxAuth.currentUser = guestUser;
            cineboxAuth.updateUI();
        }

        this.showMainApp();
        
        if (typeof cineboxAdapted !== 'undefined') {
            cineboxAdapted.showToast('Bem-vindo, Visitante!', 'success');
        }
    }

    // Função loginDemo removida por segurança

    // Método para ser chamado quando o login for bem-sucedido
    onLoginSuccess() {
        // Marcar como visitado para não mostrar a tela novamente
        localStorage.setItem('cinebox_visited', 'true');
        this.showMainApp();
    }

    // Método público para mostrar a tela de login (usado no logout)
    showLoginScreen() {
        const mainContent = document.querySelector('.main-content');
        const header = document.querySelector('.header');
        
        if (mainContent) mainContent.style.display = 'none';
        if (header) header.style.display = 'none';

        // Remover tela existente se houver
        const existingScreen = document.getElementById('initialLoginScreen');
        if (existingScreen) {
            existingScreen.remove();
        }

        // Criar nova tela de login
        this.createLoginScreen();
    }
}

// Inicializar tela de login quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.loginScreen = new LoginScreen();
});
