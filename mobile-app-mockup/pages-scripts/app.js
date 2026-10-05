(function (global) {
    'use strict';

    /* ─── Navegación entre pantallas ─── */
    const Navigation = {
        goTo(screen) {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({ action: 'navigate', screen }, '*');
            } else {
                // Fallback para prototipo standalone
                const map = {
                    1: 'page1.html', 2: 'page2.html', 3: 'page3.html',
                    4: 'page4.html', 5: 'page5.html', 6: 'page6.html',
                    7: 'page7.html', 8: 'page8.html'
                };
                if (map[screen]) window.location.href = map[screen];
            }
        }
    };

    /* ─── Persistencia ─── */
    const Store = {
        get(key) {
            try {
                const raw = sessionStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            } catch (e) { return null; }
        },
        set(key, value) {
            try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* noop */ }
        },
        merge(key, partial) {
            const current = this.get(key) || {};
            this.set(key, Object.assign({}, current, partial));
        }
    };

    /* ─── Tabs (modo chat / escanear, etc.) ─── */
    function initTabs(selector, options = {}) {
        const {
            tabSelector = '.mode-tab',
            activeClass = 'active',
            activeAttr = 'aria-selected',
            onChange = null
        } = options;

        const container = document.querySelector(selector);
        if (!container) return;

        const tabs = container.querySelectorAll(tabSelector);
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.classList.remove(activeClass);
                    if (activeAttr) t.setAttribute(activeAttr, 'false');
                });
                tab.classList.add(activeClass);
                if (activeAttr) tab.setAttribute(activeAttr, 'true');
                if (onChange) onChange(tab.dataset.mode, tab);
            });
        });
    }

    /* ─── Animar barras de progreso (ancho %) ─── */
    function animateBars(items) {
        items.forEach(({ el, pct, delay = 0, onDone = null }) => {
            if (!el) return;
            setTimeout(() => {
                el.style.width = pct + '%';
                if (onDone) setTimeout(onDone, 1000);
            }, delay);
        });
    }

    /* ─── Toast temporal (feedback visual) ─── */
    function showToast(parentEl, html, duration = 1800) {
        if (!parentEl) return;
        const toast = document.createElement('div');
        toast.style.cssText = `
            position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
            background:rgba(15,23,42,0.92); color:#fff; padding:12px 20px;
            border-radius:14px; font-size:12px; font-weight:800; letter-spacing:0.3px;
            box-shadow:0 20px 40px -10px rgba(0,0,0,0.5);
            display:flex; align-items:center; gap:8px;
            animation: fadeUp 0.3s ease;
            z-index:100;
        `;
        toast.innerHTML = html;
        parentEl.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /* ─── Bind de botones "back" hacia una pantalla ─── */
    function bindBack(selector, targetScreen) {
        const btn = document.querySelector(selector);
        if (!btn) return;
        btn.addEventListener('click', () => Navigation.goTo(targetScreen));
    }

    /* ─── Export ─── */
    global.App = {
        Navigation,
        Store,
        initTabs,
        animateBars,
        showToast,
        bindBack,
        // NUEVOS:
        initAccordion,
        initSwitchToggles,
        slugify,
        initWithFeedback
    };

})(window);


/* ─── Acordeón (expandir / contraer tarjeta) ─── */
function initAccordion(headSelector, options = {}) {
    const {
        cardClass = 'expanded',
        ignoreSelector = '.switch, .btn-action'
    } = options;

    document.querySelectorAll(headSelector).forEach(head => {
        head.addEventListener('click', (e) => {
            // Si el click fue sobre un elemento interactivo dentro, ignorar
            if (e.target.closest(ignoreSelector)) return;
            const card = head.closest('.var-card') || head.parentElement;
            if (card) card.classList.toggle(cardClass);
        });
    });
}

/* ─── Toggles simples (para switches dentro de acordeones) ─── */
function initSwitchToggles(selector = '.switch', onClass = 'on') {
    document.querySelectorAll(selector).forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita activar el acordeón padre
            toggle.classList.toggle(onClass);
            toggle.setAttribute('aria-pressed', toggle.classList.contains(onClass) ? 'true' : 'false');
        });
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    });
}

/* ─── Slugify (para construir URLs amigables) ─── */
function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

/* ─── Botón con estado "loading → success → reset" ─── */
function initWithFeedback(btn, options = {}) {
    const {
        loadingHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.2-8.6"/></svg> Generando...',
        successHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg> Listo',
        loadingMs = 1600,
        successMs = 1800,
        onComplete = null
    } = options;

    const original = btn.innerHTML;

    btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btn.disabled = true;
        btn.innerHTML = loadingHTML;
        ensureSpinKeyframes();

        setTimeout(() => {
            btn.innerHTML = successHTML;
            setTimeout(() => {
                btn.innerHTML = original;
                btn.disabled = false;
                if (onComplete) onComplete();
            }, successMs);
        }, loadingMs);
    });
}

function ensureSpinKeyframes() {
    if (document.getElementById('spinStyle')) return;
    const s = document.createElement('style');
    s.id = 'spinStyle';
    s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(s);
}