const https = require('https');

const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

function supabaseRequest(path, method, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = https.request({
      hostname: 'bedfyhwhkhsrxbtzpowq.supabase.co',
      path: `/rest/v1/${path}`,
      method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(payload);
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
    const { product_id, order_number, pickup_datetime, return_datetime, customer_email } = JSON.parse(event.body);

    if (!product_id || !order_number || !pickup_datetime || !return_datetime || !customer_email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    const result = await supabaseRequest('bookings', 'POST', {
      product_id,
      order_number,
      pickup_datetime,
      return_datetime,
      customer_email,
      status: 'confirmed'
    });

    if (result.status >= 400) {
      throw new Error(`Supabase error: ${result.body}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, booking: JSON.parse(result.body) })
    };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
