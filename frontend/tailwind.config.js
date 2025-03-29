/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ Importante para que index.css aplique bien
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fbbf24",   // Amarillo tipo Mercado Pago
        secondary: "#2563eb", // Azul moderno
        success: "#16a34a",   // Verde elegante
        danger: "#dc2626",    // Rojo alerta
        neutral: "#f3f4f6",   // Fondo gris claro
      },
    },
  },
  plugins: [],
};
