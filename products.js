// ── The Backdrop Bar — Product Catalogue
const PRODUCTS = {

  // ── FLOWER WALLS ──────────────────────────────────────────
  'red-rose-wall': {
    id: 'red-rose-wall', buyPrice: 1500, title: 'Red Rose Flower Wall (8×8 ft)', price: 275,
    category: 'Flower Walls', size: '8ft × 8ft', damageHold: 100,
    type: 'backdrop', images: ['photos/red-rose-wall.jpg'], section: 'backdrops'
  },
  'blush-pink-wall': {
    id: 'blush-pink-wall', buyPrice: 1500, title: 'Blush Pink Flower Wall (8×8 ft)', price: 275,
    category: 'Flower Walls', size: '8ft × 8ft', damageHold: 100,
    type: 'backdrop', images: ['photos/blush-pink-wall.jpg'], section: 'backdrops'
  },
  'baby-blue-wall': {
    id: 'baby-blue-wall', buyPrice: 1500, title: 'Baby Blue Flower Wall (8×8 ft)', price: 275,
    category: 'Flower Walls', size: '8ft × 8ft', damageHold: 100,
    type: 'backdrop', images: ['photos/baby-blue-wall.jpg'], section: 'backdrops'
  },
  'garden-mix-wall': {
    id: 'garden-mix-wall', buyPrice: 1500, title: 'Garden Mix Flower Wall (8×8 ft)', price: 275,
    category: 'Flower Walls', size: '8ft × 8ft', damageHold: 100,
    type: 'backdrop', images: ['photos/garden-mix-wall.jpg'], section: 'backdrops'
  },
  'white-blossom-wall': {
    id: 'white-blossom-wall', buyPrice: 1500, title: 'White Blossom Flower Wall (8×8 ft)', price: 275,
    category: 'Flower Walls', size: '8ft × 8ft', damageHold: 100,
    type: 'backdrop', images: ['photos/white-blossom-wall.jpg'], section: 'backdrops'
  },

  // ── NEON SIGNS ────────────────────────────────────────────
  'oh-baby-neon': {
    id: 'oh-baby-neon', title: '"Oh Baby!" Neon Sign', price: 50,
    category: 'Neon Signs', size: 'TBD', damageHold: 50,
    type: 'neon', images: ['photos/oh-baby-neon.jpg'], section: 'neon',
    addonOnly: true // can only be added with a backdrop
  },
  'will-you-marry-me-neon': {
    id: 'will-you-marry-me-neon', title: '"Will You Marry Me?" Neon Sign', price: 50,
    category: 'Neon Signs', size: 'TBD', damageHold: 50,
    type: 'neon', images: ['photos/will-you-marry-me-neon.jpg'], section: 'neon',
    addonOnly: true
  }

};

function getProduct(id) { return PRODUCTS[id] || null; }
