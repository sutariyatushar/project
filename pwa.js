// PWA Lifecycle and Custom Installation Prompt Script

let deferredPrompt = null;
let newWorker = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize PWA Features
  registerServiceWorker();
  initInstallPrompt();
  detectStandaloneMode();
});

// Service Worker Registration & Update Management
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered successfully:', reg.scope);

          // Track updates
          reg.addEventListener('updatefound', () => {
            newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update available, show update toast
                showUpdateToast();
              }
            });
          });
        })
        .catch((err) => {
          console.error('[PWA] Service Worker registration failed:', err);
        });

      // Handle controllerchange (when new worker takes control)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    });
  }
}

// Custom Install Prompt Logic
function initInstallPrompt() {
  // Check if iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isSafari = /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|OPiOS|mercury/.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

  // 1. Handle standard install prompt (Android, Windows, Chrome, Edge)
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default browser banner
    e.preventDefault();
    deferredPrompt = e;
    
    // Only show custom banner if not already installed and not dismissed in current session
    if (!isStandalone && !sessionStorage.getItem('pwa_prompt_dismissed')) {
      showInstallPromptBanner();
    }
  });

  // 2. Handle iOS specific user instructions
  if (isIOS && isSafari && !isStandalone && !sessionStorage.getItem('pwa_prompt_dismissed')) {
    // Show iOS popup instructions after a slight delay
    setTimeout(showIOSInstallModal, 3000);
  }

  // 3. Track successful installation
  window.addEventListener('appinstalled', (evt) => {
    console.log('[PWA] App successfully installed!');
    hideInstallPromptBanner();
    deferredPrompt = null;
  });
}

// Create and show the install prompt banner (Android / Desktop)
function showInstallPromptBanner() {
  if (document.getElementById('pwa-prompt')) return;

  const promptHtml = `
    <div id="pwa-prompt" class="pwa-prompt-container" role="dialog" aria-labelledby="pwa-title" aria-describedby="pwa-desc">
      <img src="img/icon-192x192.png" alt="Goradka Village App Icon" class="pwa-prompt-icon">
      <div class="pwa-prompt-info">
        <h2 id="pwa-title" class="pwa-prompt-title">Goradka Village App</h2>
        <p id="pwa-desc" class="pwa-prompt-desc">Install our app for offline support and faster loading.</p>
      </div>
      <div class="pwa-prompt-actions">
        <button id="pwa-btn-install" class="pwa-btn pwa-btn-install" aria-label="Install Goradka Village application">Install</button>
        <button id="pwa-btn-close" class="pwa-btn pwa-btn-close" aria-label="Dismiss app installation prompt">Not Now</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', promptHtml);

  // Animate in
  setTimeout(() => {
    document.getElementById('pwa-prompt').classList.add('show');
  }, 100);

  // Add click events
  document.getElementById('pwa-btn-install').addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] User accepted the install prompt');
        } else {
          console.log('[PWA] User dismissed the install prompt');
        }
        hideInstallPromptBanner();
        deferredPrompt = null;
      });
    }
  });

  document.getElementById('pwa-btn-close').addEventListener('click', () => {
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    hideInstallPromptBanner();
  });
}

function hideInstallPromptBanner() {
  const banner = document.getElementById('pwa-prompt');
  if (banner) {
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 500);
  }
}

// Create and show iOS Installation Guide Modal
function showIOSInstallModal() {
  if (document.getElementById('pwa-ios-modal')) return;

  const modalHtml = `
    <div id="pwa-ios-modal" class="pwa-ios-modal" role="dialog" aria-modal="true" aria-labelledby="pwa-ios-title" aria-describedby="pwa-ios-desc">
      <div class="pwa-ios-card">
        <img src="img/icon-192x192.png" alt="Goradka App Icon" class="pwa-ios-icon">
        <h2 id="pwa-ios-title" class="pwa-ios-title">Install Goradka Village</h2>
        <p id="pwa-ios-desc" class="pwa-ios-desc">Add this app to your home screen for high performance and offline access.</p>
        
        <div class="pwa-ios-instructions">
          <div class="pwa-ios-step">
            <div class="pwa-ios-step-num" aria-hidden="true">1</div>
            <div>Tap the Share button <i class="fa-solid fa-arrow-up-from-bracket" style="color: #007aff; margin-left: 2px;" aria-hidden="true"></i> in Safari browser.</div>
          </div>
          <div class="pwa-ios-step">
            <div class="pwa-ios-step-num" aria-hidden="true">2</div>
            <div>Scroll down and select <strong>'Add to Home Screen'</strong>.</div>
          </div>
        </div>

        <button id="pwa-ios-close" class="pwa-ios-close-btn" aria-label="Dismiss iOS installation guide">Dismiss</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Animate in
  setTimeout(() => {
    document.getElementById('pwa-ios-modal').classList.add('show');
  }, 100);

  // Close modal
  document.getElementById('pwa-ios-close').addEventListener('click', () => {
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    document.getElementById('pwa-ios-modal').classList.remove('show');
    setTimeout(() => document.getElementById('pwa-ios-modal').remove(), 400);
  });
}

// Show PWA Update Notification Toast
function showUpdateToast() {
  if (document.getElementById('pwa-update-toast')) return;

  const toastHtml = `
    <div id="pwa-update-toast" class="pwa-update-toast" role="alert" aria-live="assertive">
      <div class="pwa-update-text">A new update is available for this app!</div>
      <div class="pwa-update-actions">
        <button id="pwa-update-reload" class="pwa-update-btn-reload" aria-label="Reload page to apply application update">Refresh</button>
        <button id="pwa-update-dismiss" class="pwa-update-btn-dismiss" aria-label="Dismiss application update notification">Ignore</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', toastHtml);

  // Animate in
  setTimeout(() => {
    document.getElementById('pwa-update-toast').classList.add('show');
  }, 100);

  // Reload action
  document.getElementById('pwa-update-reload').addEventListener('click', () => {
    if (newWorker) {
      newWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  });

  // Dismiss action
  document.getElementById('pwa-update-dismiss').addEventListener('click', () => {
    const toast = document.getElementById('pwa-update-toast');
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  });
}

// Check display-mode and apply helper classes for app-like styling
function detectStandaloneMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isStandalone) {
    document.body.classList.add('pwa-standalone');
    console.log('[PWA] Running in Standalone Display Mode');
  }
}

