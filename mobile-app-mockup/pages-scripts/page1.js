(function () {
    'use strict';

    const { Navigation, Store, initHelpTooltip, initSingleSelect } = window.LS;

    let selectedGoal = null;
    const startBtn = document.getElementById('startBtn');

    /* ─── Inicialización ─── */
    initHelpTooltip();

    /* ─── Selección de objetivo principal (radio) ─── */
    initSingleSelect('#goalChips', {
        itemSelector: '.chip',
        selectedClass: 'selected',
        activeAttr: 'aria-checked',
        onSelect: (chip) => {
            selectedGoal = chip ? chip.dataset.goal : null;
            startBtn.disabled = !selectedGoal;
        }
    });

    /* ─── Continuar al paso 2 ─── */
    startBtn.addEventListener('click', () => {
        if (!selectedGoal) return;
        Store.merge('ls_profile', { goal: selectedGoal });
        Navigation.goTo(2);
    });

    /* ─── Botón atrás (deshabilitado en paso 1) ─── */
    const backBtn = document.getElementById('backBtn');
    if (backBtn) backBtn.disabled = true;

})();