// PWA Installation Script
let deferredPrompt;
const installButton = document.getElementById('installPWA');

// Periksa apakah browser mendukung Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Menangani peristiwa 'beforeinstallprompt'
window.addEventListener('beforeinstallprompt', (e) => {
    // Mencegah Chrome 67 dan yang lebih baru menampilkan prompt instalasi bawaan
    e.preventDefault();
    
    // Menyimpan event agar dapat dipicu nanti
    deferredPrompt = e;
    
    // Menampilkan UI yang menunjukkan bahwa aplikasi dapat diinstal
    if (installButton) {
        installButton.style.display = 'block';
        
        installButton.addEventListener('click', () => {
            // Menampilkan prompt instalasi
            deferredPrompt.prompt();
            
            // Menunggu pengguna merespon prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Pengguna menerima prompt instalasi');
                    // Sembunyikan tombol install setelah instalasi
                    installButton.style.display = 'none';
                } else {
                    console.log('Pengguna menolak prompt instalasi');
                }
                
                // Kita sudah tidak memerlukan prompt ini lagi
                deferredPrompt = null;
            });
        });
    }
});

// Menangani peristiwa 'appinstalled'
window.addEventListener('appinstalled', (evt) => {
    console.log('Aplikasi berhasil diinstal!');
    // Logika setelah aplikasi diinstal (misalnya, mengubah UI atau menyembunyikan tombol install)
    if (installButton) {
        installButton.style.display = 'none';
    }
});

// Fungsi untuk memeriksa apakah aplikasi sudah diinstal
function isPWAInstalled() {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone ||
        document.referrer.includes('android-app://')
    );
}

// Menyembunyikan tombol install jika aplikasi sudah diinstal
if (isPWAInstalled() && installButton) {
    installButton.style.display = 'none';
} 