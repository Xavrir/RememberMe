// PWA Installer Script
let deferredPrompt;
const installPWAButton = document.getElementById('installPWA');
const pwaInstallSection = document.getElementById('pwaInstallSection');

// Deteksi apakah browser mendukung instal PWA
window.addEventListener('beforeinstallprompt', (e) => {
  // Mencegah Chrome 67 dan yang lebih baru menampilkan prompt instalasi otomatis
  e.preventDefault();
  
  // Simpan event untuk dipicu nanti
  deferredPrompt = e;
  
  // Perbarui UI untuk menampilkan tombol instal
  if (installPWAButton && pwaInstallSection) {
    pwaInstallSection.classList.remove('hidden');
    
    installPWAButton.addEventListener('click', async () => {
      // Sembunyikan tombol instal karena tidak lagi relevan
      pwaInstallSection.classList.add('hidden');
      
      // Tampilkan prompt instalasi
      deferredPrompt.prompt();
      
      // Tunggu pengguna merespons prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      // Bersihkan deferredPrompt variabel karena tidak bisa digunakan lagi
      deferredPrompt = null;
      
      // Log hasil pilihan pengguna
      console.log(`User ${outcome === 'accepted' ? 'menerima' : 'menolak'} instalasi PWA`);
      
      // Jika pengguna menerima instalasi, sembunyikan tombol
      if (outcome === 'accepted') {
        if (installPWAButton) {
          installPWAButton.classList.add('hidden');
        }
      }
    });
  }
});

// Deteksi jika aplikasi telah diinstal
window.addEventListener('appinstalled', () => {
  // Log event
  console.log('PWA telah diinstal!');
  
  // Sembunyikan tombol instalasi
  if (pwaInstallSection) {
    pwaInstallSection.classList.add('hidden');
  }
  
  // Opsional: kirim analytics
  if (typeof gtag === 'function') {
    gtag('event', 'pwa_install', {
      'event_category': 'pwa',
      'event_label': 'installed'
    });
  }
});

// Cek apakah aplikasi berjalan dalam mode standalone (sudah diinstal)
function isPWAInstalled() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  );
}

// Sembunyikan tombol instalasi jika aplikasi sudah diinstal
if (isPWAInstalled()) {
  if (pwaInstallSection) {
    pwaInstallSection.classList.add('hidden');
  }
  
  console.log('Aplikasi berjalan dalam mode standalone / sudah terinstal');
}

// Jika user berada dalam iOS Safari, tampilkan instruksi instalasi khusus
function isIOSSafari() {
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  
  return isIOS && isSafari;
}

// Deteksi iOS dan tampilkan petunjuk instalasi khusus jika diperlukan
window.addEventListener('DOMContentLoaded', () => {
  if (isIOSSafari() && !isPWAInstalled()) {
    const iOSInstallMessage = document.createElement('div');
    iOSInstallMessage.classList.add('ios-install-message');
    iOSInstallMessage.innerHTML = `
      <div class="toast bg-blue-500 text-white p-4 rounded-lg fixed bottom-8 left-1/2 transform -translate-x-1/2 shadow-lg z-50">
        <p>📱 Untuk install: ketuk <strong>Share</strong> <span>&#x25B2;</span> lalu pilih <strong>"Add to Home Screen"</strong></p>
        <button class="text-white ml-2 bg-blue-600 px-2 py-1 rounded" onclick="this.parentElement.remove()">✕</button>
      </div>
    `;
    
    // Tambahkan petunjuk setelah beberapa detik
    setTimeout(() => {
      document.body.appendChild(iOSInstallMessage);
    }, 3000);
  }
}); 