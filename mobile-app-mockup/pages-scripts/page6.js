(function () {
    'use strict';

    const { Navigation, animateBars } = window.App;

    /* ─── Animar barras al cargar ─── */
    window.addEventListener('load', () => {
        animateBars([
            {
                el: document.getElementById('heroFill'),
                pct: 100,
                delay: 200,
                onDone: () => document.getElementById('heroBadge').classList.add('show')
            },
            { el: document.getElementById('antFill'), pct: 60, delay: 400 },
            { el: document.getElementById('stressFill'), pct: 64, delay: 600 }
        ]);
    });

    /* ─── Volver al dashboard ─── */
    document.getElementById('backBtn').addEventListener('click', () => {
        Navigation.goTo(4);
    });

})();