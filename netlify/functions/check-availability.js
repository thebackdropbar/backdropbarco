const https = require('https');

const SUPABASE_URL = 'https://bedfyhwhkhsrxbtzpowq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

// Product inventory — update quantities here as you add more items
const PRODUCT_INVENTORY = {
  'default': 1  // all products default to qty 1 until specified
};

function getQuantity(productId) {
  return PRODUCT_INVENTORY[productId] || PRODUCT_INVENTORY['default'];
}

function supabaseRequest(path, method, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'bedfyhwhkhsrxbtzpowq.supabase.co',
      path: `/rest/v1/${path}`,
      method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { product_id, pickup_datetime, return_datetime, qty_requested } = JSON.parse(event.body);

    if (!product_id || !pickup_datetime || !return_datetime) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    const qtyNeeded = parseInt(qty_requested) || 1;

    // Check how many confirmed bookings overlap with the requested dates
    const query = `bookings?product_id=eq.${encodeURIComponent(product_id)}&status=eq.confirmed&pickup_datetime=lt.${encodeURIComponent(return_datetime)}&return_datetime=gt.${encodeURIComponent(pickup_datetime)}&select=id,pickup_datetime,return_datetime`;

    const result = await supabaseRequest(query, 'GET');

    if (result.status >= 400) {
      throw new Error(`Supabase error: ${result.body}`);
    }

    const overlappingBookings = JSON.parse(result.body);
    const bookedCount = overlappingBookings.length;
    const availableQty = getQuantity(product_id);
    const available = (bookedCount + qtyNeeded) <= availableQty;

    // Also fetch ALL booked date ranges for this product so the calendar can block them
    const allBookingsResult = await supabaseRequest(
      `bookings?product_id=eq.${encodeURIComponent(product_id)}&status=eq.confirmed&select=pickup_datetime,return_datetime`,
      'GET'
    );
    const allBookings = JSON.parse(allBookingsResult.body);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        available,
        bookedCount,
        availableQty,
        bookedRanges: allBookings.map(b => ({
          pickup: b.pickup_datetime,
          return: b.return_datetime
        }))
      })
    };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
