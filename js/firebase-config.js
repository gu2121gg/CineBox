// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD3M2upZyN8NZhoxFVzPvGizGLdJcnEgX4",
    authDomain: "cine-box-gg.firebaseapp.com",
    databaseURL: "https://cine-box-gg-default-rtdb.firebaseio.com",
    projectId: "cine-box-gg",
    storageBucket: "cine-box-gg.firebasestorage.app",
    messagingSenderId: "340114375407",
    appId: "1:340114375407:web:2bc0391a4987da84a6111a"
};

// Inicializar Firebase
let app, auth, db;
let isFirebaseReady = false;

try {
    // Verificar se Firebase está disponível
    if (typeof firebase !== 'undefined') {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        isFirebaseReady = true;
        console.log('Firebase inicializado com sucesso');
    } else {
        console.warn('Firebase SDK não carregado');
    }
} catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
}

// Classe para gerenciar autenticação
class FirebaseAuth {
    constructor() {
        this.currentUser = null;
        this.isReady = isFirebaseReady;
        
        if (this.isReady) {
            // Observar mudanças no estado de autenticação
            auth.onAuthStateChanged((user) => {
                this.currentUser = user;
                if (user) {
                    console.log('Usuário logado:', user.email);
                    
                    // Usuário já autenticado - pular tela de boas-vindas
                    if (typeof loginScreen !== 'undefined') {
                        loginScreen.onLoginSuccess();
                    }
                    
                    if (typeof cineboxAuth !== 'undefined') {
                        cineboxAuth.onUserLogin(user);
                    }
                } else {
                    console.log('Usuário deslogado');
                    if (typeof cineboxAuth !== 'undefined') {
                        cineboxAuth.currentUser = null;
                        cineboxAuth.updateUI();
                    }
                }
            });
        }
    }

    // Login com email e senha
    async signIn(email, password) {
        if (!this.isReady) throw new Error('Firebase não está disponível');
        
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            return result.user;
        } catch (error) {
            throw this.translateError(error);
        }
    }

    // Registro com email e senha
    async signUp(email, password, displayName) {
        if (!this.isReady) throw new Error('Firebase não está disponível');
        
        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            
            // Atualizar perfil com nome
            if (displayName) {
                await result.user.updateProfile({
                    displayName: displayName
                });
            }
            
            return result.user;
        } catch (error) {
            throw this.translateError(error);
        }
    }

    // Logout
    async signOut() {
        if (!this.isReady) throw new Error('Firebase não está disponível');
        
        try {
            await auth.signOut();
        } catch (error) {
            throw this.translateError(error);
        }
    }

    // Reset de senha
    async resetPassword(email) {
        if (!this.isReady) throw new Error('Firebase não está disponível');
        
        try {
            await auth.sendPasswordResetEmail(email);
        } catch (error) {
            throw this.translateError(error);
        }
    }

    // Traduzir erros para português
    translateError(error) {
        const errorMessages = {
            'auth/user-not-found': 'Usuário não encontrado',
            'auth/wrong-password': 'Senha incorreta',
            'auth/email-already-in-use': 'Este email já está em uso',
            'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres',
            'auth/invalid-email': 'Email inválido',
            'auth/user-disabled': 'Conta desabilitada',
            'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
            'auth/network-request-failed': 'Erro de conexão. Verifique sua internet'
        };

        const message = errorMessages[error.code] || error.message;
        return new Error(message);
    }
}

// Instância global do Firebase Auth
const firebaseAuth = new FirebaseAuth();
