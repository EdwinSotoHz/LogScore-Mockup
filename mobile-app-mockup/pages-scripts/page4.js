(function () {
    'use strict';

    const { Store } = window.App;

    const profile = Store.get('ls_profile');
    const greetingName = document.querySelector('.greeting .name');
    if (profile && profile.name && greetingName) {
        greetingName.textContent = 'Hola, ' + profile.name;
    }

})();