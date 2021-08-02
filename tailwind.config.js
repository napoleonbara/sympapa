module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: theme => ({
         'fiche-perso-1': "url('/images/fiche1.png')",
         'fiche-perso-2': "url('/images/fiche2.png')",
      })
    },
    inset: {
      'line-1': "62px",
      'line-2': "96px",
      'line-3': "130px",
      'line-4': "164px",
      'col-1': "55px",
      'col-2': "564px",
      'col-3': "610px",
      'col-4': "764px",

      'x-cell-1': "362px",
      'x-cell-2': "428px",
      'x-cell-3': "498px",

      'y-cell-1': "86px",
      'y-cell-2': "152px",
      
      'y-attributes': "249px", 
      'x-precision': "92px",
      'x-astuce': "189px",
      'x-discretion': "286px",
      'x-persuasion': "383px",
      'x-agilite': "480px",
      'x-volonte': "575px",
      'x-force': "673px",
      'x-vigilance': "768px",

      "x-thalers": "584px",
      "y-thalers": "993px",

      "x-shillings": "584px",
      "y-shillings": "1013px",

      "x-ortegs": "584px",
      "y-ortegs": "1033px",

      "x-age": "62px",
      "y-age": "62px",

      "x-taille": "137px",
      "y-taille": "62px",

      "x-poids": "238px",
      "y-poids": "62px",

      "x-image": "327px",
      "y-image": "57px",

      "x-apparence": "61px",
      "y-apparence": "96px",

      "x-historique": "61px",
      "y-historique": "209px",

      "x-objectifs": "61px",
      "y-objectifs": "339px",
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
