// Konstanta untuk nama local storage
const MEDICINE_STORAGE_KEY = 'rememberMeMedicines';
const USER_STORAGE_KEY = 'rememberMeUser';

// Fungsi untuk mendapatkan data obat dari local storage
function getMedicineData() {
    const data = localStorage.getItem(MEDICINE_STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    return null;
}

// Fungsi untuk menampilkan jadwal obat di halaman utama
function renderTodaySchedule() {
    const medicineData = getMedicineData();
    if (!medicineData) return;
    
    const scheduleContainer = document.getElementById('todaySchedule');
    if (!scheduleContainer) return;
    
    // Kosongkan container
    scheduleContainer.innerHTML = '';
    
    // Mendapatkan waktu sekarang untuk menentukan status (Now/Later)
    const now = new Date();
    const currentHour = now.getHours();
    
    // Render tiap kelompok waktu obat
    Object.keys(medicineData).forEach(timeOfDay => {
        const timeData = medicineData[timeOfDay];
        
        // Skip jika tidak ada obat untuk waktu ini
        if (timeData.medicines.length === 0) return;
        
        let status = "Later";
        
        // Logika sederhana untuk status Now/Later
        if (timeOfDay === "morning" && currentHour >= 6 && currentHour < 12) {
            status = "Now";
        } else if (timeOfDay === "afternoon" && currentHour >= 12 && currentHour < 18) {
            status = "Now";
        } else if (timeOfDay === "evening" && (currentHour >= 18 || currentHour < 6)) {
            status = "Now";
        }
        
        // Buat list item untuk setiap jadwal
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'medicine-list-item';
        scheduleItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h4 class="medicine-time-label">${timeData.title}</h4>
                    <p class="medicine-time">${timeData.time}</p>
                </div>
                <span class="medicine-status ${status === 'Later' ? 'later' : ''}">${status}</span>
            </div>
            <div style="margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem;">
                ${timeData.medicines.map(medicine => `
                    <div style="color: #D1D5DB; font-size: 0.875rem; display: flex; align-items: center;">
                        <span style="margin-right: 0.5rem;">💊</span>
                        <span>${medicine.name} - ${medicine.dosage}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        scheduleContainer.appendChild(scheduleItem);
    });
    
    // Jika tidak ada obat, tampilkan pesan
    if (scheduleContainer.children.length === 0) {
        scheduleContainer.innerHTML = `
            <div style="text-align: center; padding: 1.5rem 0;">
                <p style="color: #9CA3AF;">Belum ada jadwal obat hari ini</p>
                <a href="medicine.html" style="color: #7749F8; font-weight: 500; margin-top: 0.5rem; display: inline-block;">
                    + Tambahkan obat
                </a>
            </div>
        `;
    }
}

// Fungsi untuk menyapa user berdasarkan waktu
function setGreeting() {
    const now = new Date();
    const hour = now.getHours();
    let greeting = 'Hello';
    
    if (hour >= 5 && hour < 12) {
        greeting = 'Selamat Pagi';
    } else if (hour >= 12 && hour < 15) {
        greeting = 'Selamat Siang';
    } else if (hour >= 15 && hour < 19) {
        greeting = 'Selamat Sore';
    } else {
        greeting = 'Selamat Malam';
    }
    
    // Dapatkan nama user (jika ada)
    let userName = 'John';
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    if (userData) {
        const user = JSON.parse(userData);
        if (user.name) {
            userName = user.name;
        }
    }
    
    // Set greeting text
    const greetingElement = document.getElementById('userGreeting');
    if (greetingElement) {
        greetingElement.textContent = `${greeting}, ${userName}! 👋`;
    }
}

// Fungsi untuk menangani PWA installation
function setupPWAInstall() {
    const pwaInstallSection = document.getElementById('pwaInstallSection');
    const installButton = document.getElementById('installPWA');
    
    // Cek apakah PWA bisa diinstall
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // Tampilkan tombol install
        if (pwaInstallSection) {
            pwaInstallSection.style.display = 'block';
        }
    });
    
    // Handler untuk tombol install
    if (installButton) {
        installButton.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to install prompt: ${outcome}`);
            deferredPrompt = null;
            // Sembunyikan tombol setelah mencoba install
            pwaInstallSection.style.display = 'none';
        });
    }
}

// Inisialisasi halaman utama
document.addEventListener('DOMContentLoaded', function() {
    // Set greeting
    setGreeting();
    
    // Tampilkan jadwal obat
    renderTodaySchedule();
    
    // Setup PWA install
    setupPWAInstall();
    
    // Handler untuk navigasi ke halaman obat
    const medicineCard = document.querySelector('.quick-action-medicine');
    if (medicineCard) {
        medicineCard.addEventListener('click', function() {
            window.location.href = 'medicine.html';
        });
    }
    
    // Handler untuk navigasi ke AI Chat
    const aiChatCard = document.querySelector('.quick-action:not(.quick-action-medicine)');
    if (aiChatCard) {
        aiChatCard.addEventListener('click', function() {
            window.location.href = 'ai-chat.html';
        });
    }
}); 