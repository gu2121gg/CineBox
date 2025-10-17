// Sistema de Notificações Inteligentes - CineBox

class NotificationSystem {
    constructor() {
        this.notifications = JSON.parse(localStorage.getItem('cinebox_notifications')) || [];
        this.preferences = JSON.parse(localStorage.getItem('cinebox_notification_prefs')) || this.getDefaultPreferences();
        this.init();
    }

    init() {
        this.createNotificationUI();
        this.requestPermission();
        this.checkScheduledNotifications();
        
        // Verificar notificações a cada 5 minutos
        setInterval(() => this.checkScheduledNotifications(), 5 * 60 * 1000);
    }

    getDefaultPreferences() {
        return {
            newContent: true,      // Novos filmes/séries
            recommendations: true,  // Recomendações personalizadas
            watchReminders: true,   // Lembretes de séries
            expiringContent: true,  // Conteúdo expirando
            emailDigest: true,      // Resumo semanal por email
            pushEnabled: false      // Push notifications
        };
    }

    async requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.preferences.pushEnabled = true;
                this.savePreferences();
                this.showToast('Notificações ativadas!', 'success');
            }
        }
    }

    createNotificationUI() {
        // Adicionar botão de notificações no header
        const navRight = document.querySelector('.nav-right');
        if (!navRight) return;

        const notifButton = document.createElement('div');
        notifButton.className = 'notification-button';
        notifButton.innerHTML = `
            <button class="notif-btn" onclick="notificationSystem.togglePanel()">
                <i class="fas fa-bell"></i>
                <span class="notif-badge" id="notifBadge">0</span>
            </button>
        `;
        
        navRight.insertBefore(notifButton, navRight.firstChild);

        // Criar painel de notificações
        const panel = document.createElement('div');
        panel.id = 'notificationPanel';
        panel.className = 'notification-panel';
        panel.innerHTML = `
            <div class="notif-header">
                <h3>Notificações</h3>
                <button onclick="notificationSystem.markAllRead()" class="mark-all-btn">
                    <i class="fas fa-check-double"></i> Marcar todas como lidas
                </button>
            </div>
            <div class="notif-tabs">
                <button class="notif-tab active" data-tab="all">Todas</button>
                <button class="notif-tab" data-tab="unread">Não lidas</button>
            </div>
            <div class="notif-list" id="notifList"></div>
            <div class="notif-footer">
                <button onclick="notificationSystem.showSettings()">
                    <i class="fas fa-cog"></i> Configurações
                </button>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.updateUI();
        this.addStyles();
    }

    togglePanel() {
        const panel = document.getElementById('notificationPanel');
        panel.classList.toggle('active');
        
        if (panel.classList.contains('active')) {
            this.renderNotifications('all');
        }
    }

    renderNotifications(filter = 'all') {
        const list = document.getElementById('notifList');
        let filtered = this.notifications;

        if (filter === 'unread') {
            filtered = this.notifications.filter(n => !n.read);
        }

        if (filtered.length === 0) {
            list.innerHTML = `
                <div class="notif-empty">
                    <i class="fas fa-bell-slash"></i>
                    <p>Nenhuma notificação</p>
                </div>
            `;
            return;
        }

        list.innerHTML = filtered.map(notif => `
            <div class="notif-item ${notif.read ? 'read' : 'unread'}" onclick="notificationSystem.handleClick('${notif.id}')">
                <div class="notif-icon ${notif.type}">
                    <i class="fas fa-${this.getIcon(notif.type)}"></i>
                </div>
                <div class="notif-content">
                    <div class="notif-title">${notif.title}</div>
                    <div class="notif-message">${notif.message}</div>
                    <div class="notif-time">${this.getTimeAgo(notif.timestamp)}</div>
                </div>
                ${!notif.read ? '<div class="notif-dot"></div>' : ''}
            </div>
        `).join('');

        this.updateBadge();
    }

    getIcon(type) {
        const icons = {
            'new-content': 'film',
            'recommendation': 'star',
            'reminder': 'clock',
            'expiring': 'exclamation-triangle',
            'achievement': 'trophy',
            'update': 'bell'
        };
        return icons[type] || 'bell';
    }

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Agora';
        if (minutes < 60) return `${minutes}min atrás`;
        if (hours < 24) return `${hours}h atrás`;
        return `${days}d atrás`;
    }

    addNotification(notification) {
        const newNotif = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            read: false,
            ...notification
        };

        this.notifications.unshift(newNotif);
        
        // Manter apenas últimas 50 notificações
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }

        this.save();
        this.updateUI();

        // Mostrar push notification se habilitado
        if (this.preferences.pushEnabled && Notification.permission === 'granted') {
            new Notification(newNotif.title, {
                body: newNotif.message,
                icon: '/favicon.ico',
                badge: '/badge.png',
                tag: newNotif.id
            });
        }

        // Toast notification
        this.showToast(newNotif.title, 'info');
    }

    // Notificações Inteligentes Automáticas
    
    // 1. Novos conteúdos (simular)
    notifyNewContent(movie) {
        if (!this.preferences.newContent) return;
        
        this.addNotification({
            type: 'new-content',
            title: 'Novo filme adicionado!',
            message: `${movie.title} já está disponível para assistir!`,
            action: { type: 'play', movieId: movie.id }
        });
    }

    // 2. Recomendações personalizadas
    sendRecommendations() {
        if (!this.preferences.recommendations) return;
        
        // Baseado no histórico do usuário
        if (typeof cineboxAdapted !== 'undefined') {
            const watchHistory = Object.keys(cineboxAdapted.watchProgress || {});
            if (watchHistory.length >= 3) {
                this.addNotification({
                    type: 'recommendation',
                    title: 'Recomendações para você',
                    message: 'Encontramos 5 filmes que você pode gostar!',
                    action: { type: 'navigate', page: 'home' }
                });
            }
        }
    }

    // 3. Lembrete de séries
    remindWatchingSeries() {
        if (!this.preferences.watchReminders) return;
        
        this.addNotification({
            type: 'reminder',
            title: 'Continue assistindo',
            message: 'Você parou de assistir alguns filmes. Que tal continuar?',
            action: { type: 'navigate', page: 'home' }
        });
    }

    // 4. Conteúdo expirando
    warnExpiringContent() {
        if (!this.preferences.expiringContent) return;
        
        this.addNotification({
            type: 'expiring',
            title: 'Último dia!',
            message: 'Alguns filmes serão removidos em breve. Não perca!',
            action: { type: 'navigate', page: 'movies' }
        });
    }

    // 5. Conquistas
    notifyAchievement(achievement) {
        this.addNotification({
            type: 'achievement',
            title: '🏆 Conquista desbloqueada!',
            message: achievement.message,
            action: { type: 'navigate', page: 'profile' }
        });
    }

    // Verificar notificações agendadas
    checkScheduledNotifications() {
        const lastCheck = localStorage.getItem('cinebox_last_notif_check');
        const now = Date.now();
        
        // Se passou mais de 24h, enviar recomendações
        if (!lastCheck || now - parseInt(lastCheck) > 24 * 60 * 60 * 1000) {
            this.sendRecommendations();
            localStorage.setItem('cinebox_last_notif_check', now.toString());
        }

        // Verificar séries para lembrete (se passou 3 dias)
        const lastWatch = localStorage.getItem('cinebox_last_watch');
        if (lastWatch && now - parseInt(lastWatch) > 3 * 24 * 60 * 60 * 1000) {
            this.remindWatchingSeries();
        }
    }

    handleClick(notifId) {
        const notif = this.notifications.find(n => n.id === notifId);
        if (!notif) return;

        // Marcar como lida
        notif.read = true;
        this.save();
        this.updateUI();

        // Executar ação
        if (notif.action) {
            switch (notif.action.type) {
                case 'play':
                    if (typeof cineboxAdapted !== 'undefined') {
                        cineboxAdapted.playMovie(notif.action.movieId);
                    }
                    break;
                case 'navigate':
                    if (typeof cineboxAdapted !== 'undefined') {
                        cineboxAdapted.navigateToPage(notif.action.page);
                    }
                    break;
            }
        }

        this.togglePanel();
    }

    markAllRead() {
        this.notifications.forEach(n => n.read = true);
        this.save();
        this.updateUI();
        this.showToast('Todas marcadas como lidas', 'success');
    }

    updateBadge() {
        const unread = this.notifications.filter(n => !n.read).length;
        const badge = document.getElementById('notifBadge');
        if (badge) {
            badge.textContent = unread;
            badge.style.display = unread > 0 ? 'flex' : 'none';
        }
    }

    updateUI() {
        this.updateBadge();
        const activeTab = document.querySelector('.notif-tab.active');
        if (activeTab) {
            this.renderNotifications(activeTab.dataset.tab);
        }
    }

    showSettings() {
        const modal = document.createElement('div');
        modal.className = 'notif-settings-modal';
        modal.innerHTML = `
            <div class="notif-settings-content">
                <div class="settings-header">
                    <h3>Configurações de Notificações</h3>
                    <button onclick="this.closest('.notif-settings-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="settings-list">
                    <div class="setting-item">
                        <div>
                            <strong>Novos conteúdos</strong>
                            <small>Receba avisos de novos filmes e séries</small>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${this.preferences.newContent ? 'checked' : ''} 
                                onchange="notificationSystem.updatePref('newContent', this.checked)">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div>
                            <strong>Recomendações</strong>
                            <small>Sugestões personalizadas para você</small>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${this.preferences.recommendations ? 'checked' : ''} 
                                onchange="notificationSystem.updatePref('recommendations', this.checked)">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div>
                            <strong>Lembretes</strong>
                            <small>Lembre-me de continuar assistindo</small>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${this.preferences.watchReminders ? 'checked' : ''} 
                                onchange="notificationSystem.updatePref('watchReminders', this.checked)">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div>
                            <strong>Conteúdo expirando</strong>
                            <small>Avisos de filmes sendo removidos</small>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${this.preferences.expiringContent ? 'checked' : ''} 
                                onchange="notificationSystem.updatePref('expiringContent', this.checked)">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div>
                            <strong>Resumo semanal</strong>
                            <small>Receba um email com resumo semanal</small>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${this.preferences.emailDigest ? 'checked' : ''} 
                                onchange="notificationSystem.updatePref('emailDigest', this.checked)">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div>
                            <strong>Notificações Push</strong>
                            <small>Receba notificações no navegador</small>
                        </div>
                        <button onclick="notificationSystem.requestPermission()" class="btn-small">
                            ${this.preferences.pushEnabled ? 'Ativado' : 'Ativar'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    updatePref(key, value) {
        this.preferences[key] = value;
        this.savePreferences();
        this.showToast('Preferência atualizada', 'success');
    }

    save() {
        localStorage.setItem('cinebox_notifications', JSON.stringify(this.notifications));
    }

    savePreferences() {
        localStorage.setItem('cinebox_notification_prefs', JSON.stringify(this.preferences));
    }

    showToast(message, type) {
        if (typeof showToast !== 'undefined') {
            showToast(message, type);
        }
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notification-button {
                position: relative;
                margin-right: 1rem;
            }

            .notif-btn {
                background: transparent;
                border: none;
                color: white;
                font-size: 1.3rem;
                cursor: pointer;
                padding: 0.5rem;
                position: relative;
            }

            .notif-badge {
                position: absolute;
                top: 0;
                right: 0;
                background: var(--primary-color);
                color: white;
                font-size: 0.7rem;
                min-width: 18px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                font-weight: 600;
            }

            .notification-panel {
                position: fixed;
                top: 70px;
                right: -400px;
                width: 400px;
                max-width: 90vw;
                height: calc(100vh - 70px);
                background: var(--surface);
                box-shadow: -5px 0 20px rgba(0,0,0,0.5);
                transition: right 0.3s ease;
                z-index: 1000;
                display: flex;
                flex-direction: column;
            }

            .notification-panel.active {
                right: 0;
            }

            .notif-header {
                padding: 1.5rem;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .notif-header h3 {
                margin: 0;
                font-size: 1.3rem;
            }

            .mark-all-btn {
                background: transparent;
                border: none;
                color: var(--primary-color);
                cursor: pointer;
                font-size: 0.9rem;
            }

            .notif-tabs {
                display: flex;
                gap: 0.5rem;
                padding: 1rem 1.5rem;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .notif-tab {
                background: transparent;
                border: none;
                color: rgba(255,255,255,0.6);
                padding: 0.5rem 1rem;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.3s;
            }

            .notif-tab.active {
                background: rgba(229, 9, 20, 0.2);
                color: var(--primary-color);
            }

            .notif-list {
                flex: 1;
                overflow-y: auto;
                padding: 1rem 0;
            }

            .notif-item {
                padding: 1rem 1.5rem;
                cursor: pointer;
                display: flex;
                gap: 1rem;
                align-items: flex-start;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                transition: background 0.3s;
                position: relative;
            }

            .notif-item:hover {
                background: rgba(255,255,255,0.05);
            }

            .notif-item.unread {
                background: rgba(229, 9, 20, 0.05);
            }

            .notif-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .notif-icon.new-content {
                background: rgba(76, 175, 80, 0.2);
                color: #4CAF50;
            }

            .notif-icon.recommendation {
                background: rgba(255, 193, 7, 0.2);
                color: #FFC107;
            }

            .notif-icon.reminder {
                background: rgba(33, 150, 243, 0.2);
                color: #2196F3;
            }

            .notif-icon.expiring {
                background: rgba(255, 87, 34, 0.2);
                color: #FF5722;
            }

            .notif-icon.achievement {
                background: rgba(229, 9, 20, 0.2);
                color: var(--primary-color);
            }

            .notif-content {
                flex: 1;
            }

            .notif-title {
                font-weight: 600;
                margin-bottom: 0.25rem;
            }

            .notif-message {
                font-size: 0.9rem;
                color: rgba(255,255,255,0.7);
                margin-bottom: 0.5rem;
            }

            .notif-time {
                font-size: 0.8rem;
                color: rgba(255,255,255,0.5);
            }

            .notif-dot {
                width: 8px;
                height: 8px;
                background: var(--primary-color);
                border-radius: 50%;
                position: absolute;
                top: 50%;
                right: 1rem;
                transform: translateY(-50%);
            }

            .notif-empty {
                text-align: center;
                padding: 3rem 1rem;
                color: rgba(255,255,255,0.5);
            }

            .notif-empty i {
                font-size: 3rem;
                margin-bottom: 1rem;
                opacity: 0.3;
            }

            .notif-footer {
                padding: 1rem 1.5rem;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .notif-footer button {
                width: 100%;
                padding: 0.75rem;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: white;
                border-radius: 8px;
                cursor: pointer;
            }

            .notif-settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
            }

            .notif-settings-content {
                background: var(--surface);
                width: 500px;
                max-width: 90vw;
                max-height: 80vh;
                border-radius: 12px;
                overflow: hidden;
            }

            .settings-header {
                padding: 1.5rem;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .settings-header button {
                background: transparent;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
            }

            .settings-list {
                padding: 1rem;
                overflow-y: auto;
                max-height: 60vh;
            }

            .setting-item {
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.05);
            }

            .setting-item small {
                display: block;
                color: rgba(255,255,255,0.6);
                margin-top: 0.25rem;
            }

            .switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }

            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 24px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            input:checked + .slider {
                background-color: var(--primary-color);
            }

            input:checked + .slider:before {
                transform: translateX(26px);
            }

            @media (max-width: 768px) {
                .notification-panel {
                    width: 100%;
                    right: -100%;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar sistema de notificações
const notificationSystem = new NotificationSystem();

// Exemplo de uso: adicionar notificação de teste após 5 segundos
setTimeout(() => {
    notificationSystem.addNotification({
        type: 'new-content',
        title: 'Bem-vindo ao CineBox!',
        message: 'Explore nosso catálogo de filmes e séries.',
        action: { type: 'navigate', page: 'home' }
    });
}, 5000);
