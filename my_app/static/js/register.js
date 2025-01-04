document.addEventListener('DOMContentLoaded', function () {
    const modals = {
        privacyModal: document.getElementById('privacyModal'),
        termsModal: document.getElementById('termsModal')
    };
    const links = {
        privacyLink: document.getElementById('privacyLink'),
        termsLink: document.getElementById('termsLink')
    };
    const openModal = (modal) => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };
    const closeModal = (modal) => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        const checkbox = modal.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.checked = false;
    };
    Object.entries(links).forEach(([key, link]) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalKey = key.replace('Link', 'Modal');
            openModal(modals[modalKey]);
        });
    });
    Object.values(modals).forEach(modal => {
        const cancelButton = modal.querySelector('.btn-cancel');
        const acceptButton = modal.querySelector('.btn-accept');
        const checkbox = modal.querySelector('input[type="checkbox"]');
        cancelButton.addEventListener('click', () => closeModal(modal));
        acceptButton.addEventListener('click', () => {
            if (checkbox && checkbox.checked) {
                closeModal(modal);
            } else {
                alert('Please confirm that you have read and accepted the agreement.');
            }
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });
});
