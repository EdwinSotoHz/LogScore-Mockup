(function () {
    'use strict';

    const { Navigation, Store, initHelpTooltip, initSingleSelect, initToggles, readTogglesState } = window.LS;

    let selected2FA = 'sms';

    /* ─── Inicialización ─── */
    initHelpTooltip();

    /* ─── Selección de método 2FA ─── */
    initSingleSelect('#twoFASelector', {
        itemSelector: '.radio-card',
        selectedClass: 'selected',
        activeAttr: 'aria-checked',
        onSelect: (card) => {
            selected2FA = card ? card.dataset['2fa'] : null;
        }
    });

    /* ─── Toggles de permisos ─── */
    initToggles('#permList', {
        itemSelector: '.perm-card',
        onClass: 'on',
        activeAttr: 'aria-pressed'
    });

    /* ─── Guardar y continuar al paso 3 ─── */
    document.getElementById('confirmBtn').addEventListener('click', () => {
        const permissions = readTogglesState('#permList', {
            itemSelector: '.perm-card',
            onClass: 'on',
            keyAttr: 'data-perm'
        });

        Store.set('ls_security', {
            twoFA: selected2FA,
            permissions
        });

        Navigation.goTo(3);
    });

    /* ─── Botón atrás ─── */
    document.getElementById('backBtn').addEventListener('click', () => {
        Navigation.goTo(1);
    });

})();