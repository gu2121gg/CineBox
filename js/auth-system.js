// Helper para toast messages
function showToast(message, type = 'success') {
    if (typeof cineboxAdapted !== 'undefined') {
        cineboxAdapted.showToast(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// Sistema de Autenticação Avançado - CineBox
class CineBoxAuth {
    constructor() {
        this.currentUser = null;
        this.userPreferences = {};
        this.watchHistory = [];
        this.init();
    }

    init() {
        this.createAuthModals();
        this.setupEventListeners();
        this.loadUserData();
    }

    createAuthModals() {
        // Modal de Login
        const loginModal = document.createElement('div');
        loginModal.className = 'auth-modal';
        loginModal.id = 'loginModal';
        loginModal.innerHTML = `
            <div class="auth-modal-content">
                <button class="close-auth-modal" onclick="cineboxAuth.closeModal('loginModal')">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="auth-header">
                    <h2>Entrar no CineBox</h2>
                    <p>Acesse sua conta para continuar assistindo</p>
                </div>
                
                <form class="auth-form" id="loginForm">
                    <div class="form-group">
                        <label for="loginEmail">Email</label>
                        <input type="email" id="loginEmail" required>
                        <i class="fas fa-envelope form-icon"></i>
                    </div>
                    
                    <div class="form-group">
                        <label for="loginPassword">Senha</label>
                        <input type="password" id="loginPassword" required>
                        <i class="fas fa-lock form-icon"></i>
                        <button type="button" class="toggle-password" onclick="cineboxAuth.togglePassword('loginPassword')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    
                    <div class="form-options">
                        <label class="checkbox-container">
                            <input type="checkbox" id="rememberMe">
                            <span class="checkmark"></span>
                            Lembrar de mim
                        </label>
                        <a href="#" onclick="cineboxAuth.showForgotPassword()">Esqueceu a senha?</a>
                    </div>
                    
                    <button type="submit" class="btn-auth btn-primary" id="loginBtn">
                        <i class="fas fa-sign-in-alt"></i>
                        Entrar
                    </button>
                    
                    <div class="auth-divider">
                        <span>ou</span>
                    </div>
                    
                    <button type="button" class="btn-auth btn-google" onclick="cineboxAuth.signInWithGoogle()">
                        <i class="fab fa-google"></i>
                        Continuar com Google
                    </button>
                    
                    <div class="auth-footer">
                        <p>Não tem uma conta? <a href="#" onclick="cineboxAuth.switchToRegister()">Cadastre-se</a></p>
                    </div>
                </form>
            </div>
        `;
        
        // Modal de Registro
        const registerModal = document.createElement('div');
        registerModal.className = 'auth-modal';
        registerModal.id = 'registerModal';
        registerModal.innerHTML = `
            <div class="auth-modal-content">
                <button class="close-auth-modal" onclick="cineboxAuth.closeModal('registerModal')">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="auth-header">
                    <h2>Criar Conta</h2>
                    <p>Junte-se ao CineBox e descubra milhares de filmes</p>
                </div>
                
                <form class="auth-form" id="registerForm">
                    <div class="form-group">
                        <label for="registerName">Nome Completo</label>
                        <input type="text" id="registerName" required>
                        <i class="fas fa-user form-icon"></i>
                    </div>
                    
                    <div class="form-group">
                        <label for="registerEmail">Email</label>
                        <input type="email" id="registerEmail" required>
                        <i class="fas fa-envelope form-icon"></i>
                    </div>
                    
                    <div class="form-group">
                        <label for="registerPassword">Senha</label>
                        <input type="password" id="registerPassword" required minlength="6">
                        <i class="fas fa-lock form-icon"></i>
                        <button type="button" class="toggle-password" onclick="cineboxAuth.togglePassword('registerPassword')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    
                    <div class="form-group">
                        <label for="confirmPassword">Confirmar Senha</label>
                        <input type="password" id="confirmPassword" required minlength="6">
                        <i class="fas fa-lock form-icon"></i>
                    </div>
                    
                    <div class="form-options">
                        <label class="checkbox-container">
                            <input type="checkbox" id="agreeTerms" required>
                            <span class="checkmark"></span>
                            Aceito os <a href="#" onclick="cineboxAuth.showTerms()">Termos de Uso</a>
                        </label>
                    </div>
                    
                    <button type="submit" class="btn-auth btn-primary" id="registerBtn">
                        <i class="fas fa-user-plus"></i>
                        Criar Conta
                    </button>
                    
                    <div class="auth-divider">
                        <span>ou</span>
                    </div>
                    
                    <button type="button" class="btn-auth btn-google" onclick="cineboxAuth.signInWithGoogle()">
                        <i class="fab fa-google"></i>
                        Continuar com Google
                    </button>
                    
                    <div class="auth-footer">
                        <p>Já tem uma conta? <a href="#" onclick="cineboxAuth.switchToLogin()">Entrar</a></p>
                    </div>
                </form>
            </div>
        `;

        // Modal de Recuperação de Senha
        const forgotModal = document.createElement('div');
        forgotModal.className = 'auth-modal';
        forgotModal.id = 'forgotModal';
        forgotModal.innerHTML = `
            <div class="auth-modal-content">
                <button class="close-auth-modal" onclick="cineboxAuth.closeModal('forgotModal')">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="auth-header">
                    <h2>Recuperar Senha</h2>
                    <p>Digite seu email para receber o link de recuperação</p>
                </div>
                
                <form class="auth-form" id="forgotForm">
                    <div class="form-group">
                        <label for="forgotEmail">Email</label>
                        <input type="email" id="forgotEmail" required>
                        <i class="fas fa-envelope form-icon"></i>
                    </div>
                    
                    <button type="submit" class="btn-auth btn-primary" id="forgotBtn">
                        <i class="fas fa-paper-plane"></i>
                        Enviar Link
                    </button>
                    
                    <div class="auth-footer">
                        <p><a href="#" onclick="cineboxAuth.switchToLogin()">Voltar ao Login</a></p>
                    </div>
                </form>
            </div>
        `;

        // Adicionar modais ao DOM
        document.body.appendChild(loginModal);
        document.body.appendChild(registerModal);
        document.body.appendChild(forgotModal);
    }

    setupEventListeners() {
        // Login Form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Register Form
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Forgot Password Form
        document.getElementById('forgotForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Fechar modal clicando fora
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('auth-modal')) {
                this.closeModal(e.target.id);
            }
        });
    }

    // Mostrar modal de login
    showLogin() {
        document.getElementById('loginModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Mostrar modal de registro
    showRegister() {
        document.getElementById('registerModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Mostrar modal de recuperação
    showForgotPassword() {
        this.closeModal('loginModal');
        document.getElementById('forgotModal').classList.add('active');
    }

    // Alternar entre login e registro
    switchToRegister() {
        this.closeModal('loginModal');
        this.showRegister();
    }

    switchToLogin() {
        this.closeModal('registerModal');
        this.closeModal('forgotModal');
        this.showLogin();
    }

    // Fechar modal
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Se não há usuário logado, mostrar tela de boas-vindas novamente
        if (!this.currentUser && typeof loginScreen !== 'undefined') {
            setTimeout(() => {
                const initialScreen = document.getElementById('initialLoginScreen');
                if (initialScreen && !loginScreen.hasValidSession()) {
                    initialScreen.style.display = 'flex';
                }
            }, 300);
        }
    }

    // Toggle password visibility
    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const button = input.nextElementSibling;
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    // Handle Login
    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const loginBtn = document.getElementById('loginBtn');

        this.setLoading(loginBtn, true);

        try {
            if (firebaseAuth.isReady) {
                // Login com Firebase
                const user = await firebaseAuth.signIn(email, password);
                await this.onUserLogin(user);
                
                if (rememberMe) {
                    localStorage.setItem('cinebox_remember', 'true');
                }
            } else {
                // Firebase não disponível
                throw new Error('Sistema de autenticação não disponível. Tente novamente mais tarde.');
            }

            this.closeModal('loginModal');
            showToast('Login realizado com sucesso!', 'success');
            
            // Notificar tela de login inicial
            if (typeof loginScreen !== 'undefined') {
                loginScreen.onLoginSuccess();
            }
            
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            this.setLoading(loginBtn, false);
        }
    }

    // Handle Register
    async handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const registerBtn = document.getElementById('registerBtn');

        // Validações
        if (password !== confirmPassword) {
            showToast('As senhas não coincidem', 'error');
            return;
        }

        this.setLoading(registerBtn, true);

        try {
            if (firebaseAuth.isReady) {
                // Registro com Firebase
                const user = await firebaseAuth.signUp(email, password, name);
                await this.onUserLogin(user);
            } else {
                // Firebase não disponível
                throw new Error('Sistema de registro não disponível. Tente novamente mais tarde.');
            }

            this.closeModal('registerModal');
            showToast('Conta criada com sucesso!', 'success');
            
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            this.setLoading(registerBtn, false);
        }
    }

    // Handle Forgot Password
    async handleForgotPassword() {
        const email = document.getElementById('forgotEmail').value;
        const forgotBtn = document.getElementById('forgotBtn');

        this.setLoading(forgotBtn, true);

        try {
            if (firebaseAuth.isReady) {
                await firebaseAuth.resetPassword(email);
                showToast('Link de recuperação enviado para seu email!', 'success');
            } else {
                // Demo mode
                showToast('Em modo demo - Link seria enviado para: ' + email, 'success');
            }
            
            this.closeModal('forgotModal');
            
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            this.setLoading(forgotBtn, false);
        }
    }

    // Login com Google
    async signInWithGoogle() {
        try {
            if (firebaseAuth.isReady) {
                const provider = new firebase.auth.GoogleAuthProvider();
                const result = await auth.signInWithPopup(provider);
                await this.onUserLogin(result.user);
                this.closeModal('loginModal');
                this.closeModal('registerModal');
                showToast('Login com Google realizado!', 'success');
            } else {
                showToast('Login com Google não disponível em modo demo', 'warning');
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    // Logout
    async logout() {
        try {
            if (firebaseAuth.isReady) {
                await firebaseAuth.signOut();
            } else {
                this.currentUser = null;
                this.updateUI();
            }
            
            localStorage.removeItem('cinebox_remember');
            localStorage.removeItem('cinebox_user');
            localStorage.removeItem('cinebox_visited'); // Reset para mostrar tela de boas-vindas
            showToast('Logout realizado com sucesso!', 'success');
            
            // Mostrar tela de boas-vindas novamente após logout
            setTimeout(() => {
                if (typeof loginScreen !== 'undefined') {
                    loginScreen.showLoginScreen();
                }
            }, 1000);
            
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    // Quando usuário faz login
    async onUserLogin(user) {
        this.currentUser = {
            uid: user.uid || 'demo_' + Date.now(),
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=E50914&color=fff`
        };

        // Salvar dados do usuário
        localStorage.setItem('cinebox_user', JSON.stringify(this.currentUser));
        
        // Carregar dados do usuário
        await this.loadUserPreferences();
        
        this.updateUI();
    }

    // Carregar preferências do usuário
    async loadUserPreferences() {
        try {
            if (firebaseAuth.isReady && this.currentUser) {
                // Carregar do Firestore
                try {
                    const userDoc = await db.collection('users').doc(this.currentUser.uid).get();
                    if (userDoc.exists) {
                        this.userPreferences = userDoc.data();
                        // Salvar no localStorage como backup
                        localStorage.setItem(`cinebox_prefs_${this.currentUser.uid}`, JSON.stringify(this.userPreferences));
                    } else {
                        // Criar documento do usuário
                        await this.createUserProfile();
                    }
                } catch (firestoreError) {
                    // Firestore offline - usar localStorage
                    console.log('Firestore offline - usando dados locais');
                    const saved = localStorage.getItem(`cinebox_prefs_${this.currentUser.uid}`);
                    this.userPreferences = saved ? JSON.parse(saved) : this.getDefaultPreferences();
                }
            } else {
                // Carregar do localStorage
                const saved = localStorage.getItem(`cinebox_prefs_${this.currentUser.uid}`);
                this.userPreferences = saved ? JSON.parse(saved) : this.getDefaultPreferences();
            }
        } catch (error) {
            console.log('Usando preferências padrão');
            this.userPreferences = this.getDefaultPreferences();
        }
    }

    // Criar perfil do usuário
    async createUserProfile() {
        const defaultPrefs = this.getDefaultPreferences();
        
        try {
            if (firebaseAuth.isReady) {
                await db.collection('users').doc(this.currentUser.uid).set({
                    ...defaultPrefs,
                    email: this.currentUser.email,
                    displayName: this.currentUser.displayName,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            this.userPreferences = defaultPrefs;
            // Salvar no localStorage como backup
            localStorage.setItem(`cinebox_prefs_${this.currentUser.uid}`, JSON.stringify(defaultPrefs));
        } catch (error) {
            console.log('Firestore offline - usando dados locais');
            this.userPreferences = defaultPrefs;
            // Salvar no localStorage
            localStorage.setItem(`cinebox_prefs_${this.currentUser.uid}`, JSON.stringify(defaultPrefs));
        }
    }

    // Preferências padrão
    getDefaultPreferences() {
        return {
            theme: 'dark',
            language: 'pt-BR',
            autoplay: true,
            notifications: true,
            quality: 'auto',
            favorites: [],
            watchHistory: [],
            watchLater: [],
            customLists: []
        };
    }

    // Atualizar UI baseado no estado do usuário
    updateUI() {
        const userAvatar = document.getElementById('userAvatar');
        const userDropdown = document.getElementById('userDropdown');
        
        if (!userAvatar || !userDropdown) return;
        
        if (this.currentUser) {
            // Usuário logado
            userAvatar.src = this.currentUser.photoURL;
            userAvatar.alt = this.currentUser.displayName;
            
            // Atualizar dropdown
            userDropdown.innerHTML = `
                <div class="user-info">
                    <img src="${this.currentUser.photoURL}" alt="${this.currentUser.displayName}">
                    <div>
                        <div class="user-name">${this.currentUser.displayName}</div>
                        <div class="user-email">${this.currentUser.email}</div>
                    </div>
                </div>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item" onclick="cineboxAdapted.navigateToPage('profile'); event.preventDefault();">
                    <i class="fas fa-user"></i> Meu Perfil
                </a>
                <a href="#" class="dropdown-item" onclick="cineboxAdapted.navigateToPage('favorites'); event.preventDefault();">
                    <i class="fas fa-heart"></i> Minha Lista
                </a>
                <a href="#" class="dropdown-item" onclick="cineboxAuth.showSettings(); event.preventDefault();">
                    <i class="fas fa-cog"></i> Configurações
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item" onclick="cineboxAuth.logout(); event.preventDefault();">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </a>
            `;
        } else {
            // Usuário não logado
            userAvatar.src = 'https://ui-avatars.com/api/?name=Guest&background=666&color=fff';
            userDropdown.innerHTML = `
                <a href="#" class="dropdown-item" onclick="cineboxAuth.showLogin(); event.preventDefault();">
                    <i class="fas fa-sign-in-alt"></i> Entrar
                </a>
                <a href="#" class="dropdown-item" onclick="cineboxAuth.showRegister(); event.preventDefault();">
                    <i class="fas fa-user-plus"></i> Criar Conta
                </a>
            `;
        }
    }

    // Demo login (fallback) - Removido por segurança

    // Demo register removido por segurança

    // Carregar dados do usuário
    loadUserData() {
        const savedUser = localStorage.getItem('cinebox_user');
        const rememberMe = localStorage.getItem('cinebox_remember');
        
        if (savedUser && rememberMe) {
            this.currentUser = JSON.parse(savedUser);
            // Aguardar DOM carregar antes de atualizar UI
            setTimeout(() => this.updateUI(), 100);
        } else {
            // Sem usuário logado - atualizar UI para mostrar opções de login
            setTimeout(() => this.updateUI(), 100);
        }
    }

    // Set loading state
    setLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
        } else {
            button.disabled = false;
            // Restaurar texto original baseado no ID do botão
            const originalTexts = {
                'loginBtn': '<i class="fas fa-sign-in-alt"></i> Entrar',
                'registerBtn': '<i class="fas fa-user-plus"></i> Criar Conta',
                'forgotBtn': '<i class="fas fa-paper-plane"></i> Enviar Link'
            };
            button.innerHTML = originalTexts[button.id] || button.innerHTML;
        }
    }

    // Mostrar configurações
    showSettings() {
        showToast('Configurações em desenvolvimento!', 'warning');
    }

    // Mostrar termos
    showTerms() {
        showToast('Termos de uso em desenvolvimento!', 'warning');
    }
}

// Inicializar sistema de autenticação
const cineboxAuth = new CineBoxAuth();
