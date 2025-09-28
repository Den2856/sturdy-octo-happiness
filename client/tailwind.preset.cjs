/** @type {import('tailwindcss').Config} */
module.exports = {
  // вариант А: через отдельный пресет
  presets: [require('../tailwind.preset.cjs')],
  // вариант Б (если хочешь напрямую): presets: [require('../tailwind.config.js')],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  // можно добавлять локальные расширения, если нужно
  theme: { extend: {} },
};
