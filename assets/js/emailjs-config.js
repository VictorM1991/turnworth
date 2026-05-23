const EMAILJS_CONFIG = {
    development: {
        publicKey: "aakFn491_u6JMjo4J",
        serviceId: "service_by50tc2",
        templateId: "template_im1mq3w"
    },
    production: {
        publicKey: "KfcBSo6qgnwWVzYgO",
        serviceId: "service_vjvzoko",
        templateId: "template_r58hpha"
    }
};

document.addEventListener('DOMContentLoaded', function () {
    // Determine current environment
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const env = isLocalhost ? 'development' : 'production';
    const currentConfig = EMAILJS_CONFIG[env];

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(currentConfig.publicKey);
    } else {
        console.error("EmailJS SDK not loaded.");
        return;
    }

    // Custom Modal Dialog Styling and Logic
    const injectModalStyles = () => {
        if (document.getElementById('turnworth-modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'turnworth-modal-styles';
        style.innerHTML = `
            .turnworth-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 23, 42, 0.45);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .turnworth-modal-overlay.active {
                opacity: 1;
                pointer-events: auto;
            }

            .turnworth-modal-card {
                background: #ffffff;
                border-radius: 20px;
                padding: 32px 24px;
                width: 90%;
                max-width: 420px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                text-align: center;
                transform: scale(0.92) translateY(15px);
                opacity: 0;
                transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
            }

            .turnworth-modal-overlay.active .turnworth-modal-card {
                transform: scale(1) translateY(0);
                opacity: 1;
            }

            .turnworth-modal-icon-wrapper {
                width: 72px;
                height: 72px;
                margin: 0 auto 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
            }

            .turnworth-modal-icon-wrapper.success {
                background: rgba(16, 185, 129, 0.1);
                color: #10B981;
            }

            .turnworth-modal-icon-wrapper.error {
                background: rgba(244, 63, 94, 0.1);
                color: #F43F5E;
            }

            .turnworth-modal-icon {
                font-size: 34px;
                font-weight: 500;
                line-height: 1;
            }

            .turnworth-modal-title {
                font-size: 22px;
                font-weight: 700;
                color: #0f172a;
                margin-bottom: 12px;
                font-family: inherit;
                text-align: center;
            }

            .turnworth-modal-message {
                font-size: 15px;
                color: #475569;
                line-height: 1.6;
                margin-bottom: 28px;
                font-family: inherit;
            }

            .turnworth-modal-btn {
                display: inline-block;
                width: 100%;
                padding: 14px 24px;
                font-size: 15px;
                font-weight: 600;
                text-align: center;
                text-decoration: none;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-family: inherit;
                transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
            }

            .turnworth-modal-btn.success {
                background: #0058E0;
                color: #ffffff;
                box-shadow: 0 4px 12px rgba(0, 88, 224, 0.2);
            }

            .turnworth-modal-btn.success:hover {
                background: #0046b3;
                box-shadow: 0 6px 16px rgba(0, 88, 224, 0.3);
            }

            .turnworth-modal-btn.error {
                background: #475569;
                color: #ffffff;
            }

            .turnworth-modal-btn.error:hover {
                background: #334155;
            }

            .turnworth-modal-btn:active {
                transform: scale(0.98);
            }
        `;
        document.head.appendChild(style);
    };

    const showTurnworthModal = (type, title, message) => {
        injectModalStyles();

        let overlay = document.getElementById('turnworth-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'turnworth-modal-overlay';
            overlay.className = 'turnworth-modal-overlay';
            document.body.appendChild(overlay);
        }

        const iconHtml = type === 'success'
            ? '<div class="turnworth-modal-icon-wrapper success"><span class="turnworth-modal-icon">✓</span></div>'
            : '<div class="turnworth-modal-icon-wrapper error"><span class="turnworth-modal-icon">✕</span></div>';

        overlay.innerHTML = `
            <div class="turnworth-modal-card">
                ${iconHtml}
                <h3 class="turnworth-modal-title">${title}</h3>
                <p class="turnworth-modal-message">${message}</p>
                <button class="turnworth-modal-btn ${type === 'success' ? 'success' : 'error'}">Continue</button>
            </div>
        `;

        // Trigger layout reflow to allow CSS transitions to start
        overlay.offsetHeight;
        overlay.classList.add('active');

        const closeBtn = overlay.querySelector('.turnworth-modal-btn');
        const closeModal = () => {
            overlay.classList.remove('active');
            setTimeout(() => {
                if (!overlay.classList.contains('active')) {
                    overlay.innerHTML = '';
                }
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closeModal();
            }
        });
    };

    // Since the contact.html form fields might be dynamically generated,
    // we attach the listener via event delegation or simply wait for the form to exist.
    // For index.html, it exists right away. For contact.html, the form wrapper exists.

    // Using event delegation on the document for dynamically generated submit buttons/forms
    document.addEventListener('submit', function (event) {
        const form = event.target;
        if (form && form.id === 'contact-form') {
            event.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            }

            emailjs.sendForm(currentConfig.serviceId, currentConfig.templateId, form)
                .then(function () {
                    showTurnworthModal('success', 'Message Sent!', 'Thank you for reaching out to us. We will get back to you shortly.');
                    form.reset();
                }, function (error) {
                    console.error('Failed to send email:', error);
                    showTurnworthModal('error', 'Sending Failed', 'Failed to send the message. Please try again later or contact us directly.');
                })
                .finally(function () {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                });
        }
    });
});
