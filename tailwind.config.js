/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // 1. YOUR CUSTOM COLOR PALETTE
      colors: {
        black: '#000000',
        alabaster: '#FAFAFA',
        shark: {
          light: '#27272A',
          dark: '#1F1F23'
        },
        amaranth: 'E11D48',
        jumbo: '#71747A',
        'lightning-yellow': '#FBBF24',
        woodsmoke: {
          light: '#18181B',
          dark: '#0B0B0D',
        },
        santasGray: '#A1A1AA',
        paleSky: '#71747A',
        iron: {
          dark: '#D4D4D8',
          light: '#E4E4E7',
        },
        anakiwa: '#8db6ff',

        // 2. MAPPING TO YOUR EXISTING SEMANTIC NAMES
        // This ensures your Sidebar/Chat don't break, but use your new palette
        sidebar: {
          bg: '#0B0B0D',       // Mapped to WoodsmokeDark
          border: '#27272A',   // Kept standard zinc-800 for now, or use woodsmoke.light
        },
        strip: {
          bg: '#18181B',       // Mapped to WoodsmokeLight
        },
        icon: {
          base: '#A1A1AA',     // Mapped to SantasGray
          active: '#FAFAFA',   // Mapped to Alabaster
          bg: '#3F3F46',       
          hover: '#52525B',    
        }
      },
      
      // CUSTOM COLOR
      backgroundImage: {
        // Name it whatever you want (e.g., 'custom-blue')
        'custom-blue': 'linear-gradient(to top right, #8DB6FF, #C9CEFF)',
      },
      
      // 3. YOUR CUSTOM FONTS
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
        geistMono: ['Geist Mono', 'monospace'],
        sans: ['Geist', 'sans-serif'], // Sets Geist as default font
      },

      // 4. YOUR SPECIFIC TEXT STYLES (Size + Line Height)
      // Usage: className="text-reg-14"
      fontSize: {
        'reg-14': ['14px', { lineHeight: '19.6px', fontWeight: '400' }],
        'reg-16': ['16px', { lineHeight: '20px', fontWeight: '400' }],
        'med-14': ['14px', { lineHeight: '19.6px', fontWeight: '500' }], // Mono usually
        'med-16': ['16px', { lineHeight: '22.4px', fontWeight: '500' }],
      },

      boxShadow: {
        'glow': '0 0 10px rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}