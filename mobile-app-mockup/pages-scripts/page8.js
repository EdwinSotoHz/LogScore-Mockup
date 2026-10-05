(function () {
    'use strict';

    const { Navigation, initTabs, initAccordion, initSwitchToggles, showToast } = window.App;

    /* ─── Tabs superiores (Vista Diaria / Mensual) ─── */
    initTabs('.mode-tabs', {
        onChange: (mode, tab) => {
        }
    });

    /* ─── Acordeón de variables ─── */
    initAccordion('.var-head');

    /* ─── Toggles de hábitos ─── */
    initSwitchToggles('.switch', 'on');

    /* ─── Botones de acción con feedback toast ─── */
    document.querySelectorAll('.btn-action').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // No expandir/contraer el acordeón
            const actionText = btn.textContent.trim();

            showToast(document.querySelector('.content'), `
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#93C5FD" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12l5 5L20 7"/>
                </svg>
                ${actionText}
            `, 1600);
        });
    });

})();