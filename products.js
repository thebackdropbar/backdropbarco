// ── The Backdrop Bar — Product Catalogue
// Add new products here. Each key matches the ?product= URL param.
// Images: put files in a /photos/ folder in your repo and update the images array.

const PRODUCTS = {

  // ── FLOWER WALLS ──────────────────────────────────────────
  'red-rose-wall': {
    id:       'red-rose-wall',
    title:    'Red Rose Flower Wall',
    price:    500,
    category: 'Flower Walls',
    size:     '8ft × 8ft',
    images:   ['photos/red-rose-wall.jpg'],
    section:  'backdrops'
  },

  'blush-pink-wall': {
    id:       'blush-pink-wall',
    title:    'Blush Pink Flower Wall',
    price:    500,
    category: 'Flower Walls',
    size:     '8ft × 8ft',
    images:   ['photos/blush-pink-wall.jpg'],
    section:  'backdrops'
  },

  'baby-blue-wall': {
    id:       'baby-blue-wall',
    title:    'Baby Blue Flower Wall',
    price:    500,
    category: 'Flower Walls',
    size:     '8ft × 8ft',
    images:   ['photos/baby-blue-wall.jpg'],
    section:  'backdrops'
  },

  'garden-mix-wall': {
    id:       'garden-mix-wall',
    title:    'Garden Mix Flower Wall',
    price:    500,
    category: 'Flower Walls',
    size:     '8ft × 8ft',
    images:   ['photos/garden-mix-wall.jpg'],
    section:  'backdrops'
  },

  'white-blossom-wall': {
    id:       'white-blossom-wall',
    title:    'White Blossom Flower Wall',
    price:    500,
    category: 'Flower Walls',
    size:     '8ft × 8ft',
    images:   ['photos/white-blossom-wall.jpg'],
    section:  'backdrops'
  },

  // ── NEON SIGNS ────────────────────────────────────────────
  'oh-baby-neon': {
    id:       'oh-baby-neon',
    title:    '"Oh Baby!" Neon Sign',
    price:    100,
    category: 'Neon Signs',
    size:     'TBD',
    images:   ['photos/oh-baby-neon.jpg'],
    section:  'neon'
  },

  'will-you-marry-me-neon': {
    id:       'will-you-marry-me-neon',
    title:    '"Will You Marry Me?" Neon Sign',
    price:    100,
    category: 'Neon Signs',
    size:     'TBD',
    images:   ['photos/will-you-marry-me-neon.jpg'],
    section:  'neon'
  }

};

// Used by product.html to load the correct product from URL param
function getProduct(id) {
  return PRODUCTS[id] || null;
}
