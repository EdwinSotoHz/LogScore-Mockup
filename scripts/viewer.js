const iframe = document.getElementById('appScreen');
const selector = document.getElementById('screenSelector');

const numPages = 6;
const screens = [];

for (let i = 1; i <= numPages; i++) {
    screens.push(`page${i}`);
}

const titles = [
    'Onboarding',
    'Dashboard',
    'Registro Conversacional & Escanner',
    'Dashboard',
    'Dashboard',
    'Dashboard'
];

let currentScreen = 1;

// Crear botones
screens.forEach((name, i) => {
    const btn = document.createElement('button');
    btn.className = 'screen-dot';
    btn.textContent = i + 1;
    btn.title = titles[i] || name;
    btn.onclick = () => loadScreen(i + 1);
    selector.appendChild(btn);
});

function loadScreen(n) {
    if (n < 1 || n > screens.length) return;
    currentScreen = n;
    iframe.src = `mobile-app-mockup/${screens[n - 1]}.html`;
    updateActiveDot();
}

function resetDemo() {
    loadScreen(1);
}

function updateActiveDot() {
    document.querySelectorAll('.screen-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i + 1 === currentScreen);
    });
}

// Navegación desde las pantallas (iframe)
window.addEventListener('message', (e) => {
    if (e.data && e.data.action === 'navigate') {
        loadScreen(e.data.screen);
    }
});

// Inicializar
updateActiveDot();