// Script untuk membuat ikon-ikon PWA
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Ukuran ikon yang diperlukan
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Fungsi untuk membuat ikon
function generateIcons() {
    try {
        sizes.forEach(size => {
            // Buat canvas dengan ukuran ikon
            const canvas = createCanvas(size, size);
            const ctx = canvas.getContext('2d');
            
            // Buat background persegi dengan sudut membulat
            ctx.fillStyle = '#7749F8';
            const radius = size * 0.2; // Radius sudut = 20% dari ukuran ikon
            
            // Gambar persegi dengan sudut membulat
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(size - radius, 0);
            ctx.quadraticCurveTo(size, 0, size, radius);
            ctx.lineTo(size, size - radius);
            ctx.quadraticCurveTo(size, size, size - radius, size);
            ctx.lineTo(radius, size);
            ctx.quadraticCurveTo(0, size, 0, size - radius);
            ctx.lineTo(0, radius);
            ctx.quadraticCurveTo(0, 0, radius, 0);
            ctx.closePath();
            ctx.fill();
            
            // Tambahkan emoji ke tengah ikon
            const fontSize = size * 0.5; // Ukuran font = 50% dari ukuran ikon
            ctx.font = `${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            ctx.fillText('💊', size/2, size/2);
            
            // Simpan ikon sebagai PNG
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(path.join(__dirname, `icon-${size}x${size}.png`), buffer);
            
            console.log(`Icon ${size}x${size} created successfully!`);
        });
        
        console.log('All icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
    }
}

generateIcons(); 