(function (global) {
    'use strict';

    /* ─── Navegación entre pantallas vía postMessage ─── */
    const Navigation = {
        goTo(screen) {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({ action: 'navigate', screen }, '*');
            }
        },
        back() {
            const current = parseInt(document.body.dataset.screen || '0', 10);
            if (current > 1) this.goTo(current - 1);
        },
        next() {
            const current = parseInt(document.body.dataset.screen || '0', 10);
            this.goTo(current + 1);
        }
    };

    /* ─── Persistencia de datos en sessionStorage ─── */
    const Store = {
        get(key) {
            try {
                const raw = sessionStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                return null;
            }
        },
        set(key, value) {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
            } catch (e) { /* noop */ }
        },
        merge(key, partial) {
            const current = this.get(key) || {};
            this.set(key, Object.assign({}, current, partial));
        }
    };

    /* ─── Tooltip de ayuda (toggle + cierre al click externo) ─── */
    function initHelpTooltip() {
        const container = document.getElementById('helpContainer');
        const btn = document.getElementById('helpBtn');
        if (!container || !btn) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            container.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            container.classList.remove('active');
        });
    }

    /* ─── Selección única (radio-like) ─── */
    function initSingleSelect(selector, options = {}) {
        const {
            itemSelector = '.select-card',
            selectedClass = 'selected',
            activeAttr = 'aria-checked',
            onSelect = null
        } = options;

        const container = document.querySelector(selector);
        if (!container) return;

        const items = container.querySelectorAll(itemSelector);
        items.forEach(item => {
            item.addEventListener('click', () => {
                const isAlreadySelected = item.classList.contains(selectedClass);

                items.forEach(i => {
                    i.classList.remove(selectedClass);
                    if (activeAttr) i.setAttribute(activeAttr, 'false');
                });

                if (!isAlreadySelected) {
                    item.classList.add(selectedClass);
                    if (activeAttr) item.setAttribute(activeAttr, 'true');
                    if (onSelect) onSelect(item);
                } else {
                    if (onSelect) onSelect(null);
                }
            });
        });
    }

    /* ─── Selección múltiple con límite ─── */
    function initMultiSelect(selector, options = {}) {
        const {
            itemSelector = '.select-card',
            selectedClass = 'selected',
            disabledClass = 'disabled',
            max = Infinity,
            keyAttr = 'data-value',
            onSelect = null
        } = options;

        const container = document.querySelector(selector);
        if (!container) return;

        const items = Array.from(container.querySelectorAll(itemSelector));
        let selected = [];

        function updateState() {
            items.forEach(item => {
                const isSelected = item.classList.contains(selectedClass);
                if (!isSelected) {
                    item.classList.toggle(disabledClass, selected.length >= max);
                }
            });
            if (onSelect) onSelect(selected.slice());
        }

        items.forEach(item => {
            item.addEventListener('click', () => {
                const value = item.getAttribute(keyAttr);
                const isSelected = item.classList.contains(selectedClass);

                if (isSelected) {
                    item.classList.remove(selectedClass);
                    selected = selected.filter(v => v !== value);
                } else {
                    if (selected.length >= max) return;
                    item.classList.add(selectedClass);
                    selected.push(value);
                }

                updateState();
            });
        });

        return {
            getSelected: () => selected.slice(),
            reset: () => {
                items.forEach(i => i.classList.remove(selectedClass, disabledClass));
                selected = [];
                updateState();
            }
        };
    }

    /* ─── Toggle switch (permisos) ─── */
    function initToggles(selector, options = {}) {
        const {
            itemSelector = '.perm-card',
            onClass = 'on',
            activeAttr = 'aria-pressed',
            onChange = null
        } = options;

        const container = document.querySelector(selector);
        if (!container) return;

        container.querySelectorAll(itemSelector).forEach(card => {
            const toggle = () => {
                card.classList.toggle(onClass);
                const isOn = card.classList.contains(onClass);
                if (activeAttr) card.setAttribute(activeAttr, isOn ? 'true' : 'false');
                if (onChange) onChange(card, isOn);
            };

            card.addEventListener('click', toggle);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle();
                }
            });
        });
    }

    /* ─── Lectura de estado de toggles ─── */
    function readTogglesState(containerSelector, options = {}) {
        const { itemSelector = '.perm-card', onClass = 'on', keyAttr = 'data-perm' } = options;
        const container = document.querySelector(containerSelector);
        const state = {};
        if (!container) return state;

        container.querySelectorAll(itemSelector).forEach(card => {
            const key = card.getAttribute(keyAttr);
            if (key) state[key] = card.classList.contains(onClass);
        });
        return state;
    }

    /* ─── Validación de campos select (placeholder) ─── */
    function initSelectPlaceholder() {
        document.querySelectorAll('.select-wrap select').forEach(select => {
            const sync = () => {
                select.classList.toggle('placeholder', !select.value);
            };
            select.addEventListener('change', sync);
            sync();
        });
    }

    /* ─── Export público ─── */
    global.LS = {
        Navigation,
        Store,
        initHelpTooltip,
        initSingleSelect,
        initMultiSelect,
        initToggles,
        readTogglesState,
        initSelectPlaceholder
    };

})(window);