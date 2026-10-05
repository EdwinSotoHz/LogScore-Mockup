(function () {
    'use strict';

    const { Navigation, showToast, slugify, initWithFeedback } = window.App;

    const CERT_BASE_URL = 'https://logscore.app/c/740-AX-2024/';

    /* ─── Botones "Ver" de la bóveda académica ─── */
    document.querySelectorAll('.vault-view').forEach(btn => {
        btn.addEventListener('click', () => {
            const certName = btn.dataset.cert || '';
            const url = CERT_BASE_URL + slugify(certName);

            const opened = window.open(url, '_blank', 'noopener,noreferrer');
            if (!opened) {
                // Fallback si el popup fue bloqueado
                showToast(document.body, `
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#93C5FD" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 3h7v7"/>
                        <path d="M21 3l-9 9"/>
                        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>
                    </svg>
                    Abriendo credencial: ${certName}
                `);
            }
        });
    });

    /* ─── Botón exportar con feedback ─── */
    const exportBtn = document.getElementById('exportBtn');
    initWithFeedback(exportBtn, {
        loadingHTML: `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                <path d="M21 12a9 9 0 1 1-6.2-8.6"/>
            </svg>
            Generando expediente...
        `,
        successHTML: `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12l5 5L20 7"/>
            </svg>
            Reporte enviado correctamente
        `,
        loadingMs: 1600,
        successMs: 1800
    });

    /* ─── Volver al dashboard ─── */
    document.getElementById('backBtn').addEventListener('click', () => {
        Navigation.goTo(4);
    });

})();