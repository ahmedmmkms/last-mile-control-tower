// Simple logo generator script
// This script generates placeholder logos for the PWA

const fs = require('fs');
const path = require('path');

// Create a simple SVG logo
function createLogoSVG(size, color = '#1976d2') {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${color}" rx="20"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="white"/>
  <rect x="${size/4}" y="${size/4}" width="${size/2}" height="${size/2}" fill="${color}" rx="10"/>
  <text x="${size/2}" y="${size/2 + 8}" font-family="Arial, sans-serif" font-size="${size/4}" 
        fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">LD</text>
</svg>`;
}

// Create directory if it doesn't exist
function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Generate logos
function generateLogos() {
  const publicDir = path.join(__dirname, 'public');
  createDir(publicDir);
  
  // Create different sized logos
  const sizes = [48, 72, 96, 128, 144, 152, 192, 384, 512];
  
  sizes.forEach(size => {
    const svgContent = createLogoSVG(size);
    const fileName = `logo${size}.png`; // We'll save as PNG even though it's SVG content
    
    // For simplicity, we'll save the SVG content as a PNG file
    // In a real implementation, you'd convert SVG to PNG
    fs.writeFileSync(path.join(publicDir, fileName), svgContent);
    console.log(`Generated ${fileName}`);
  });
  
  // Create favicon
  const faviconContent = createLogoSVG(16);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconContent);
  console.log('Generated favicon.ico');
  
  // Create apple touch icon
  const appleIconContent = createLogoSVG(192, '#1976d2');
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIconContent);
  console.log('Generated apple-touch-icon.png');
  
  console.log('Logo generation complete!');
}

// Run the generator
generateLogos();