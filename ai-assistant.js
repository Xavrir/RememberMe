// AI Assistant menggunakan Meta Llama 3.3 8B Instruct via OpenRouter API
const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'meta-llama/llama-3.3-8b-instruct:free';

class AIAssistant {
    constructor() {
        this.apiKey = OPENROUTER_API_KEY;
        this.isLoading = false;
        this.messageHistory = [];
    }
    
    // Menambahkan pesan ke riwayat percakapan
    addMessage(role, content) {
        this.messageHistory.push({
            role: role, // 'user', 'assistant' atau 'system'
            content: content
        });
        
        // Simpan riwayat percakapan ke localStorage
        localStorage.setItem('chatHistory', JSON.stringify(this.messageHistory));
    }
    
    // Mendapatkan riwayat percakapan dari localStorage
    loadMessageHistory() {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            this.messageHistory = JSON.parse(savedHistory);
        }
    }
    
    // Menghapus riwayat chat
    clearHistory() {
        this.messageHistory = [];
        localStorage.removeItem('chatHistory');
        
        // Tambahkan kembali system prompt
        const systemPrompt = {
            role: 'system',
            content: `Kamu adalah asisten kesehatan bernama RememberMe AI yang membantu pengguna dengan informasi tentang kesehatan dan pengobatan. 
            Kamu harus selalu menjawab dengan sopan, ringkas, dan dalam bahasa Indonesia.
            Jika ada pertanyaan tentang obat atau kondisi medis serius, ingatkan pengguna untuk berkonsultasi dengan dokter.
            Selalu jelaskan bahwa kamu adalah AI dan bukan pengganti konsultasi medis profesional.`
        };
        
        this.messageHistory.push(systemPrompt);
        localStorage.setItem('chatHistory', JSON.stringify(this.messageHistory));
    }
    
    // Format pesan untuk API OpenRouter
    formatMessages() {
        return {
            model: MODEL_NAME,
            messages: this.messageHistory,
            stream: false
        };
    }
    
    // Mengirim pesan ke API OpenRouter dan mendapatkan respons
    async sendMessage(userMessage) {
        try {
            this.isLoading = true;
            
            // Tambahkan pesan pengguna ke riwayat
            this.addMessage('user', userMessage);
            
            // Persiapkan data untuk API
            const requestData = this.formatMessages();
            
            console.log('Sending request to OpenRouter API:', JSON.stringify(requestData, null, 2));
            
            // Coba kirim permintaan langsung (ini akan gagal karena CORS)
            try {
                const response = await fetch(OPENROUTER_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`,
                        'HTTP-Referer': window.location.origin || 'https://rememberm.me',
                        'X-Title': 'RememberMe Health Assistant'
                    },
                    body: JSON.stringify(requestData)
                });
                
                // Jika sukses, proses respons
                const data = await response.json();
                const aiResponse = data.choices[0]?.message?.content || 'Maaf, saya tidak dapat memproses permintaan Anda.';
                this.addMessage('assistant', aiResponse);
                this.isLoading = false;
                return aiResponse;
            } catch (error) {
                console.log('Error with direct API call:', error.message);
                // Jika gagal, gunakan fallback untuk demo
                return this.simulateResponse(userMessage);
            }
            
        } catch (error) {
            console.error('Error communicating with Llama API:', error);
            this.isLoading = false;
            return this.fallbackResponse(userMessage);
        }
    }
    
    // Simulasi respons untuk demo saat API tidak bisa diakses karena CORS
    async simulateResponse(userMessage) {
        // Tunggu sebentar untuk mensimulasikan panggilan API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Pola respons sederhana berdasarkan kata kunci
        const lowercaseMessage = userMessage.toLowerCase();
        let response = '';
        
        if (lowercaseMessage.includes('sakit kepala') || lowercaseMessage.includes('pusing')) {
            response = "Sakit kepala bisa disebabkan oleh banyak hal seperti stres, kurang tidur, dehidrasi, atau masalah kesehatan lainnya. Untuk sakit kepala ringan, Anda bisa istirahat cukup, minum air putih yang banyak, dan jika diperlukan gunakan obat pereda nyeri seperti paracetamol sesuai dosis. Jika sakit kepala sangat parah atau terus menerus, sebaiknya konsultasikan dengan dokter.";
        } else if (lowercaseMessage.includes('demam') || lowercaseMessage.includes('panas')) {
            response = "Demam biasanya merupakan tanda tubuh sedang melawan infeksi. Beristirahatlah, minum banyak cairan, dan gunakan paracetamol untuk menurunkan demam jika suhu di atas 38°C. Jika demam berlangsung lebih dari 3 hari atau disertai gejala parah lainnya, segera konsultasikan dengan dokter.";
        } else if (lowercaseMessage.includes('paracetamol') || lowercaseMessage.includes('obat sakit kepala')) {
            response = "Paracetamol adalah obat pereda nyeri dan penurun demam yang umum digunakan. Dosis dewasa biasanya 500mg-1000mg per 4-6 jam, maksimal 4000mg per hari. Selalu ikuti petunjuk dosis pada kemasan atau dari dokter. Jangan melebihi dosis yang dianjurkan karena dapat membahayakan hati.";
        } else if (lowercaseMessage.includes('tekanan darah') || lowercaseMessage.includes('hipertensi')) {
            response = "Tekanan darah normal umumnya di bawah 120/80 mmHg. Tekanan darah tinggi (hipertensi) adalah kondisi serius yang bisa dikelola dengan pola makan sehat rendah garam, olahraga teratur, menghindari stres, dan jika diperlukan, obat-obatan yang diresepkan dokter. Penting untuk memeriksa tekanan darah secara rutin, terutama jika Anda memiliki faktor risiko.";
        } else if (lowercaseMessage.includes('minum obat') || lowercaseMessage.includes('cara minum')) {
            response = "Cara minum obat yang benar adalah: 1) Ikuti dosis dan jadwal yang dianjurkan dokter atau tertera pada kemasan, 2) Perhatikan apakah harus diminum sebelum, sesudah, atau saat makan, 3) Minum dengan segelas air putih, 4) Jangan mengunyah obat kecuali diarahkan demikian, 5) Jangan skip dosis atau berhenti minum tanpa konsultasi dokter. Jika ada efek samping yang mengganggu, konsultasikan dengan dokter.";
        } else {
            response = "Sebagai asisten kesehatan AI, saya dapat memberikan informasi umum tentang kesehatan dan obat-obatan. Namun perlu diingat bahwa saya bukan pengganti konsultasi dengan profesional medis. Jika Anda memiliki masalah kesehatan spesifik, sebaiknya konsultasikan dengan dokter untuk penanganan yang tepat.";
        }
        
        // Tambahkan respons ke riwayat
        this.addMessage('assistant', response);
        this.isLoading = false;
        return response;
    }
    
    // Respons alternatif jika API gagal
    fallbackResponse(userMessage) {
        const responses = [
            "Maaf, saya sedang mengalami masalah koneksi dengan server. Mohon coba lagi nanti.",
            "Sepertinya ada masalah teknis saat ini. Silakan coba lagi dalam beberapa saat.",
            "Saya tidak dapat terhubung ke server saat ini. Ini mungkin karena masalah jaringan atau server sedang sibuk.",
            "Mohon maaf, terjadi kesalahan teknis. Sebagai alternatif, Anda bisa mencari informasi kesehatan dari sumber terpercaya seperti website Kementerian Kesehatan.",
            "Sistem sedang mengalami gangguan. Mohon bersabar dan coba lagi nanti."
        ];
        
        // Pilih respons acak
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Tambahkan respons ke riwayat
        this.addMessage('assistant', randomResponse);
        
        return randomResponse;
    }
    
    // Inisialisasi asisten dengan konteks dasar tentang kesehatan
    async initialize() {
        // Hapus cache lama yang mungkin memiliki model ID yang salah
        sessionStorage.clear();
        
        // Muat riwayat percakapan jika ada
        this.loadMessageHistory();
        
        // Jika belum ada riwayat, berikan konteks awal
        if (this.messageHistory.length === 0) {
            this.clearHistory(); // Ini akan menambahkan system prompt
        }
        
        return true;
    }
}

// Ekspor untuk digunakan di file lain
window.AIAssistant = AIAssistant; 