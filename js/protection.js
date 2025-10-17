// Sistema de Proteção Anti-DevTools - CineBox
// Bloqueia F12, Ctrl+Shift+I, Ctrl+U, etc.

(function() {
    'use strict';

    // Detectar se DevTools está aberto
    let devtoolsOpen = false;
    const threshold = 160;

    // Verificar tamanho da janela (DevTools aumenta a diferença)
    const checkDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                blockAccess();
            }
        }
    };

    // Bloquear acesso à página
    function blockAccess() {
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #141414;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                color: white;
                font-family: 'Poppins', sans-serif;
                z-index: 999999;
            ">
                <div style="text-align: center;">
                    <i class="fas fa-shield-alt" style="font-size: 5rem; color: #E50914; margin-bottom: 2rem;"></i>
                    <h1 style="font-size: 3rem; margin-bottom: 1rem; color: #E50914;">ACESSO NEGADO</h1>
                    <p style="font-size: 1.5rem; color: #b3b3b3;">Ferramentas de desenvolvedor não são permitidas.</p>
                    <p style="font-size: 1rem; color: #666; margin-top: 2rem;">Esta página será fechada em 3 segundos...</p>
                </div>
            </div>
        `;
        
        // Fechar a aba após 3 segundos
        setTimeout(() => {
            window.location.href = 'about:blank';
            window.close();
        }, 3000);
    }

    // Bloquear atalhos de teclado
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            blockAccess();
            return false;
        }
        
        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            blockAccess();
            return false;
        }
        
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            blockAccess();
            return false;
        }
        
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            blockAccess();
            return false;
        }
        
        // Ctrl+Shift+C (Inspect)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            blockAccess();
            return false;
        }
    });

    // Bloquear botão direito do mouse
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Bloquear Ctrl+S (Salvar página)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
    });

    // Detectar DevTools aberto constantemente
    setInterval(checkDevTools, 1000);

    // Debug detection - técnica avançada
    let devtools = {
        isOpen: false,
        orientation: undefined
    };

    const checkElement = new Image();
    Object.defineProperty(checkElement, 'id', {
        get: function() {
            devtools.isOpen = true;
            blockAccess();
        }
    });

    setInterval(function() {
        devtools.isOpen = false;
        console.log(checkElement);
        console.clear();
    }, 1000);

    // Desabilitar arrastar elementos
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Bloquear seleção de texto
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            return false;
        }
    });

    // Proteção contra console.log de terceiros
    const noop = () => {};
    const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'clear', 'count', 'countReset', 'assert', 'profile', 'profileEnd', 'time', 'timeLog', 'timeEnd', 'timeStamp', 'context', 'memory'];
    
    const consoleMethods = {};
    methods.forEach(method => {
        consoleMethods[method] = console[method];
        console[method] = noop;
    });

    // Desabilitar debugger
    setInterval(() => {
        (function() {
            return false;
        })['constructor']('debugger')();
    }, 50);

    console.log('%c⚠️ ATENÇÃO', 'color: #E50914; font-size: 50px; font-weight: bold;');
    console.log('%cNÃO cole códigos aqui!', 'color: white; font-size: 20px;');
    console.log('%cVocê pode ser hackeado.', 'color: #E50914; font-size: 16px;');

})();

// Proteção adicional - Detectar se está sendo executado em iframe
if (window.self !== window.top) {
    window.top.location = window.self.location;
}

// Detectar print screen
document.addEventListener('keyup', function(e) {
    if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('Print screen desabilitado!');
    }
});

// Desabilitar console completamente
Object.defineProperty(console, '_commandLineAPI', {
    get: function() {
        throw 'Acesso negado';
    }
});

console.log('🔒 Sistema de Proteção Ativo');
