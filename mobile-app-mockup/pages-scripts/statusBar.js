class StatusBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <div class="status-bar">
        <span>${this.getAttribute('time') || '9:41'}</span>
        <span class="icons">•••  ᯤ  ▮</span>
      </div>
    `;
    }
}
customElements.define('status-bar', StatusBar);