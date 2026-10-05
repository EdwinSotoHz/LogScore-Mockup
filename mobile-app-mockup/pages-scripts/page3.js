(function () {
    'use strict';

    const { Navigation, Store, initHelpTooltip, initSelectPlaceholder } = window.LS;

    /* ─── Elementos ─── */
    const occupationSelect = document.getElementById('occupation');
    const incomeSelect = document.getElementById('income');
    const debtBubbles = document.querySelectorAll('#debtBubbles .bubble');
    const problemCards = document.querySelectorAll('#problemCards .multi-card');
    const finishBtn = document.getElementById('finishBtn');

    let currentDebt = null;
    let selectedProblems = [];

    /* ─── Inicialización ─── */
    initHelpTooltip();
    initSelectPlaceholder();

    /* ─── Selectores de contexto ─── */
    [occupationSelect, incomeSelect].forEach(select => {
        select.addEventListener('change', checkCompletion);
    });

    /* ─── Burbujas de deuda (selección única) ─── */
    debtBubbles.forEach(bubble => {
        bubble.addEventListener('click', () => {
            debtBubbles.forEach(b => b.classList.remove('selected'));
            bubble.classList.add('selected');
            currentDebt = bubble.dataset.debt;
            checkCompletion();
        });
    });

    /* ─── Tarjetas de problemáticas (máx 2) ─── */
    problemCards.forEach(card => {
        card.addEventListener('click', () => {
            const problem = card.dataset.problem;
            const isSelected = card.classList.contains('selected');

            if (isSelected) {
                card.classList.remove('selected');
                selectedProblems = selectedProblems.filter(p => p !== problem);
            } else {
                if (selectedProblems.length < 2) {
                    card.classList.add('selected');
                    selectedProblems.push(problem);
                }
            }

            // Deshabilitar no seleccionadas si ya hay 2
            problemCards.forEach(c => {
                if (!c.classList.contains('selected')) {
                    c.classList.toggle('disabled', selectedProblems.length >= 2);
                }
            });

            checkCompletion();
        });
    });

    /* ─── Validación para habilitar el botón final ─── */
    function checkCompletion() {
        const hasOccupation = occupationSelect.value !== '';
        const hasIncome = incomeSelect.value !== '';
        const hasDebt = currentDebt !== null;
        const hasProblems = selectedProblems.length > 0;

        finishBtn.disabled = !(hasOccupation && hasIncome && hasDebt && hasProblems);
    }

    /* ─── Finalizar onboarding ─── */
    finishBtn.addEventListener('click', () => {
        Store.merge('ls_profile', {
            occupation: occupationSelect.value,
            income: incomeSelect.value,
            debt: currentDebt,
            problems: selectedProblems.slice()
        });

        Navigation.goTo(4);
    });

    /* ─── Botón atrás ─── */
    document.getElementById('backBtn').addEventListener('click', () => {
        Navigation.goTo(2);
    });

})();