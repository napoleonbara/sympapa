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
      'x-astuce': "190px",
      'x-discretion': "284px",
      'x-persuasion': "378px",
      'x-agilite': "476px",
      'x-volonte': "568px",
      'x-force': "666px",
      'x-vigilance': "758px",

      "aptitude-col-1": "32px",
      "aptitude-col-2": "304px",
      "aptitude-col-3": "556px",

      "aptitude-line-1": "336px",
      "aptitude-line-2": "478px",
      "aptitude-line-3": "613px",
      "aptitude-line-4": "749px",

      "arme-col": "90px",
      "arme-line-1": "947px",
      "arme-line-2": "987px",
      "arme-line-3": "1027px",
      "arme-line-4": "1067px",

      "armure-col-1": "565px",
      "armure-col-2": "692px",
      "armure-line": "948px",


      "equip-col": "576px",
      "equip-line-1": "100px",
      "equip-line-2": "142px",
      "equip-line-3": "184px",
      "equip-line-4": "228px",
      "equip-line-5": "270px",
      "equip-line-6": "312px",
      "equip-line-7": "354px",
      "equip-line-8": "396px",
      "equip-line-9": "438px",
      "equip-line-10": "482px",
      "equip-line-11": "526px",
      "equip-line-12": "570px",
      "equip-line-13": "612px",
      "equip-line-14": "654px",
      "equip-line-15": "696px",
      "equip-line-16": "738px",
      "equip-line-17": "780px",
      "equip-line-18": "822px",
      "equip-line-19": "864px",
      "equip-line-20": "906px",
      "equip-line-21": "948px",

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

      "artefact-line-1": "837px",
      "artefact-line-2": "900px",
      "artefact-line-3": "986px",
      "artefact-line-4": "1073px",
      "artefact-col": "61px"
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
