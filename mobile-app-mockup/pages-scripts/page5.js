(function () {
    'use strict';

    const { Navigation, initTabs, showToast } = window.App;

    /* ─── Referencias ─── */
    const chatView = document.getElementById('chatView');
    const scanView = document.getElementById('scanView');
    const chatScroll = document.getElementById('chatScroll');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');

    const captureBtn = document.getElementById('captureBtn');
    const ocrResult = document.getElementById('ocrResult');
    const retakeBtn = document.getElementById('retakeBtn');
    const confirmBtn = document.getElementById('confirmBtn');

    /* ─── Tabs de modo ─── */
    initTabs('.mode-tabs', {
        onChange: (mode) => {
            const isChat = mode === 'chat';
            chatView.classList.toggle('hidden', !isChat);
            scanView.classList.toggle('hidden', isChat);
            if (mode === 'scan') ocrResult.classList.remove('show');
        }
    });

    /* ─── Respuestas IA predefinidas ─── */
    const botReplies = {
        si: {
            text: 'Entiendo. Escanea el ticket y extraigo monto y categoría al instante.',
            quick: [
                { label: 'Abrir cámara', value: 'scan' },
                { label: 'Lo escribo yo', value: 'manual' }
            ]
        },
        no: {
            text: '¡Excelente! Eso suma puntos en tu LogScore. ¿Quieres registrar otro ingreso?',
            quick: [
                { label: 'Sí, agregar', value: 'income' },
                { label: 'Terminar por hoy', value: 'end' }
            ]
        },
        manual: {
            text: 'Perfecto. Puedes escribir el monto y una nota breve. ¿Cuánto gastaste?',
            quick: [
                { label: '$100 o menos', value: 'low' },
                { label: '$100 - $500', value: 'mid' },
                { label: 'Más de $500', value: 'high' }
            ]
        },
        income: {
            text: 'Registrado. Tu balance semanal se actualizará automáticamente. ¿Algo más?',
            quick: [{ label: 'No, gracias', value: 'end' }]
        },
        end: {
            text: 'Perfecto, Alex. Nos vemos mañana. Tu racha va en 8 días.',
            quick: []
        },
        default: {
            text: 'Anotado. Puedo analizarlo con tu historial si quieres un resumen.',
            quick: [
                { label: 'Resumir mi mes', value: 'income' },
                { label: 'Terminar', value: 'end' }
            ]
        }
    };

    const BOT_AVATAR_SVG = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3l1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5L12 3z"/>
        </svg>`;

    /* ─── Helpers de render de mensajes ─── */
    function scrollToBottom() {
        chatScroll.scrollTop = chatScroll.scrollHeight;
    }

    function appendUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'msg user';
        msg.innerHTML = `
            <div class="msg-avatar user">AR</div>
            <div class="bubble">${text}</div>
        `;
        chatScroll.appendChild(msg);
        scrollToBottom();
    }

    function appendBotTyping() {
        const msg = document.createElement('div');
        msg.className = 'msg bot';
        msg.id = 'botTyping';
        msg.innerHTML = `
            <div class="msg-avatar bot">${BOT_AVATAR_SVG}</div>
            <div class="bubble">
                <span class="typing"><span></span><span></span><span></span></span>
            </div>
        `;
        chatScroll.appendChild(msg);
        scrollToBottom();
    }

    function replaceTypingWithMessage(text, quickReplies) {
        const typing = document.getElementById('botTyping');
        if (!typing) return;
        typing.remove();

        const msg = document.createElement('div');
        msg.className = 'msg bot';
        let html = `
            <div class="msg-avatar bot">${BOT_AVATAR_SVG}</div>
            <div class="bubble">${text}`;
        if (quickReplies && quickReplies.length) {
            html += `<div class="quick-replies">`;
            quickReplies.forEach(qr => {
                html += `<button class="qr" data-r="${qr.value}">${qr.label}</button>`;
            });
            html += `</div>`;
        }
        html += `</div>`;
        msg.innerHTML = html;
        chatScroll.appendChild(msg);
        scrollToBottom();
        bindQuickReplies(msg);
    }

    /* ─── Flujo de conversación ─── */
    function handleUserReply(value) {
        if (value === 'scan') {
            document.querySelector('.mode-tab[data-mode="scan"]').click();
            return;
        }
        appendBotTyping();
        setTimeout(() => {
            const reply = botReplies[value] || botReplies.default;
            replaceTypingWithMessage(reply.text, reply.quick);
        }, 800);
    }

    function bindQuickReplies(scope) {
        (scope || document).querySelectorAll('.qr').forEach(btn => {
            if (btn.dataset.bound) return;
            btn.dataset.bound = '1';
            btn.addEventListener('click', () => {
                const val = btn.dataset.r;
                appendUserMessage(btn.textContent);
                const wrap = btn.closest('.quick-replies');
                if (wrap) wrap.remove();
                setTimeout(() => handleUserReply(val), 300);
            });
        });
    }

    bindQuickReplies();

    /* ─── Envío manual ─── */
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        appendUserMessage(text);
        chatInput.value = '';
        appendBotTyping();
        setTimeout(() => {
            replaceTypingWithMessage(botReplies.default.text, botReplies.default.quick);
        }, 900);
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    /* ═══════════════════════════════════════════════════════════
       ESCÁNER OCR
       ═══════════════════════════════════════════════════════════ */

    captureBtn.addEventListener('click', () => {
        // Flash visual
        captureBtn.style.background = '#EBF3FF';
        setTimeout(() => { captureBtn.style.background = '#FFFFFF'; }, 180);
        setTimeout(() => ocrResult.classList.add('show'), 400);
    });

    retakeBtn.addEventListener('click', () => {
        ocrResult.classList.remove('show');
    });

    confirmBtn.addEventListener('click', () => {
        ocrResult.classList.remove('show');
        const frame = scanView.querySelector('.camera-frame');
        showToast(frame, `
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12l5 5L20 7"/>
            </svg>
            Gasto registrado · +5 pts
        `);
    });

    /* ─── Botón cerrar (X) → volver al dashboard ─── */
    document.getElementById('backBtn').addEventListener('click', () => {
        Navigation.goTo(4);
    });

})();