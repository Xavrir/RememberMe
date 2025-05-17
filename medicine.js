// Konstanta untuk nama local storage
const MEDICINE_STORAGE_KEY = 'rememberMeMedicines';
const USER_STORAGE_KEY = 'rememberMeUser';

// Data awal jika tidak ada data tersimpan
const initialMedicineData = {
    "morning": {
        time: "08:00 AM",
        title: "Morning Medicine",
        medicines: [
            { id: 1, name: "Paracetamol", dosage: "1 tablet", taken: false }
        ]
    },
    "afternoon": {
        time: "02:00 PM",
        title: "Afternoon Medicine",
        medicines: [
            { id: 2, name: "Vitamin C", dosage: "1 tablet", taken: false }
        ]
    },
    "evening": {
        time: "08:00 PM",
        title: "Evening Medicine",
        medicines: []
    }
};

// Fungsi untuk mendapatkan data obat dari local storage
function getMedicineData() {
    const data = localStorage.getItem(MEDICINE_STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    // Jika tidak ada data, gunakan data awal
    localStorage.setItem(MEDICINE_STORAGE_KEY, JSON.stringify(initialMedicineData));
    return initialMedicineData;
}

// Fungsi untuk menyimpan data obat ke local storage
function saveMedicineData(data) {
    localStorage.setItem(MEDICINE_STORAGE_KEY, JSON.stringify(data));
}

// Fungsi untuk menampilkan daftar obat
function renderMedicineList() {
    const medicineData = getMedicineData();
    const medicineListContainer = document.getElementById('medicineList');
    
    // Kosongkan container
    medicineListContainer.innerHTML = '';
    
    // Mendapatkan waktu sekarang untuk menentukan status (Now/Later)
    const now = new Date();
    const currentHour = now.getHours();
    
    // Render tiap kelompok waktu obat
    Object.keys(medicineData).forEach((timeOfDay, index) => {
        const timeData = medicineData[timeOfDay];
        let status = "Later";
        
        // Logika sederhana untuk status Now/Later
        if (timeOfDay === "morning" && currentHour >= 6 && currentHour < 12) {
            status = "Now";
        } else if (timeOfDay === "afternoon" && currentHour >= 12 && currentHour < 18) {
            status = "Now";
        } else if (timeOfDay === "evening" && (currentHour >= 18 || currentHour < 6)) {
            status = "Now";
        }
        
        // Buat container untuk kelompok waktu
        const timeGroup = document.createElement('div');
        timeGroup.className = `medicine-list-item transform hover:scale-[1.02] transition-transform animate-slide-up`;
        if (index > 0) {
            timeGroup.style.animationDelay = `${index * 0.1}s`;
        }
        
        // Buat header untuk kelompok waktu
        timeGroup.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="medicine-time-label">${timeData.title}</h3>
                    <p class="medicine-time">${timeData.time}</p>
                </div>
                <span class="medicine-status ${status === 'Later' ? 'later' : ''}">${status}</span>
            </div>
            <div class="space-y-3" id="${timeOfDay}-medicines">
                ${timeData.medicines.length === 0 ? 
                '<p class="text-gray-400 text-sm">Tidak ada obat untuk waktu ini</p>' : ''}
            </div>
        `;
        
        medicineListContainer.appendChild(timeGroup);
        
        // Container untuk obat dalam kelompok waktu
        const medicinesContainer = document.getElementById(`${timeOfDay}-medicines`);
        
        // Render tiap obat
        timeData.medicines.forEach(medicine => {
            const medicineItem = document.createElement('div');
            medicineItem.className = 'medicine-item';
            medicineItem.innerHTML = `
                <div class="medicine-icon">
                    💊
                </div>
                <div class="flex-1">
                    <h4 class="medicine-name">${medicine.name}</h4>
                    <p class="medicine-dosage">${medicine.dosage}</p>
                </div>
                <button class="medicine-check ${medicine.taken ? 'active' : ''}" 
                        data-id="${medicine.id}" 
                        data-time="${timeOfDay}" 
                        onclick="toggleMedicine(this)">
                </button>
            `;
            medicinesContainer.appendChild(medicineItem);
        });
    });
}

// Fungsi untuk toggle status obat (diambil/belum)
function toggleMedicine(button) {
    const medicineId = parseInt(button.getAttribute('data-id'));
    const timeOfDay = button.getAttribute('data-time');
    
    // Dapatkan data dan update status
    const medicineData = getMedicineData();
    const medicine = medicineData[timeOfDay].medicines.find(m => m.id === medicineId);
    
    if (medicine) {
        medicine.taken = !medicine.taken;
        button.classList.toggle('active');
        
        // Simpan perubahan
        saveMedicineData(medicineData);
        updateProgress();
    }
}

// Update chart progress
function updateProgress() {
    const medicineData = getMedicineData();
    let totalMedicines = 0;
    let takenMedicines = 0;
    
    // Hitung total dan yang sudah diambil
    Object.values(medicineData).forEach(timeData => {
        timeData.medicines.forEach(medicine => {
            totalMedicines++;
            if (medicine.taken) takenMedicines++;
        });
    });
    
    // Hitung persentase
    const percentage = totalMedicines > 0 ? Math.round((takenMedicines / totalMedicines) * 100) : 0;
    
    // Update chart (jika ada)
    if (window.weeklyProgress) {
        // Dapatkan data hari ini (index 6 untuk hari Minggu)
        const today = new Date().getDay();
        const chartIndex = today === 0 ? 6 : today - 1; // Convert to 0-6 (Mon-Sun)
        
        window.weeklyProgress.data.datasets[0].data[chartIndex] = percentage;
        window.weeklyProgress.update();
    }
}

// Fungsi untuk navigasi tanggal
function updateDateDisplay() {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('currentDate').textContent = currentDate.toLocaleDateString('en-US', options);
}

function changeDate(days) {
    currentDate.setDate(currentDate.getDate() + days);
    updateDateDisplay();
    // Di implementasi nyata, kita akan memuat data obat untuk tanggal tersebut
}

// Inisialisasi chart (harus dipanggil setelah DOM di-load)
function initWeeklyProgressChart() {
    const ctx = document.getElementById('weeklyProgress').getContext('2d');
    window.weeklyProgress = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Medicine Taken',
                data: [100, 90, 95, 85, 88, 92, 0],
                borderColor: '#7749F8',
                backgroundColor: 'rgba(119, 73, 248, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        color: '#9CA3AF'
                    },
                    grid: {
                        color: 'rgba(156, 163, 175, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#9CA3AF'
                    },
                    grid: {
                        color: 'rgba(156, 163, 175, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Update progress berdasarkan data saat ini
    updateProgress();
}

// Inisialisasi pada saat DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Set tanggal saat ini
    window.currentDate = new Date();
    
    // Update tampilan tanggal
    updateDateDisplay();
    
    // Inisialisasi chart
    initWeeklyProgressChart();
    
    // Render daftar obat
    renderMedicineList();
    
    // Cek apakah ada parameter added=true pada URL (redirect dari add-medicine.html)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('added') === 'true') {
        // Tampilkan notifikasi sukses
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = 'Medicine added successfully!';
            toast.classList.remove('hidden');
            
            // Sembunyikan toast setelah 3 detik
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
            
            // Hapus parameter dari URL tanpa reload
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}); 