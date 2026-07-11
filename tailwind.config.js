/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brandBg: '#FFFFFF',
        brandText: '#1E1E1E',
        brandSubtext: '#666666',
        brandGold: '#B08D57',
        brandSoft: '#F8F8F8',
        brandBorder: '#EEEEEE'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        soft: '0 14px 40px rgba(30, 30, 30, 0.08)'
      }
    }
  },
  plugins: []
};

