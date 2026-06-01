const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { orderNumber, customerEmail, currentPickup, currentReturn, newPickup, newReturn } = JSON.parse(event.body);

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0ebe4;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebe4;padding:32px 0;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
  <tr><td style="background:#3a2e28;padding:28px 36px;text-align:center;border-radius:14px 14px 0 0;">
    <div style="font-family:Georgia,serif;font-size:22px;color:#fdf8f3;"><div style="text-align:center;padding:32px 0 20px;">
  <img src="https://backdropbarco.com/logo.png" alt="The Backdrop Bar Co." style="height:60px;width:auto;" />
</div></div>
    <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#c9b49a;margin-top:8px;">Reservation Change Request</div>
  </td></tr>
  <tr><td style="background:#fdf8f3;padding:32px 36px;">
    <div style="font-family:Georgia,serif;font-size:20px;color:#3a2e28;margin-bottom:16px;">A customer has requested changes</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ede1;border-radius:10px;margin-bottom:20px;">
      <tr><td style="padding:14px 20px;border-bottom:1px solid rgba(201,180,154,0.2);">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.16em;color:#a99589;margin-bottom:3px;">Order Number</div>
        <div style="font-size:14px;color:#3a2e28;">${orderNumber}</div>
      </td></tr>
      <tr><td style="padding:14px 20px;border-bottom:1px solid rgba(201,180,154,0.2);">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.16em;color:#a99589;margin-bottom:3px;">Customer Email</div>
        <div style="font-size:14px;color:#3a2e28;">${customerEmail}</div>
      </td></tr>
      <tr><td style="padding:14px 20px;border-bottom:1px solid rgba(201,180,154,0.2);">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.16em;color:#a99589;margin-bottom:6px;">Current Dates</div>
        <div style="font-size:13px;color:#7a6a60;line-height:1.8;">
          <strong style="color:#3a2e28;">Needed:</strong> ${currentPickup}<br>
          <strong style="color:#3a2e28;">Return:</strong> ${currentReturn}
        </div>
      </td></tr>
      <tr><td style="padding:14px 20px;">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.16em;color:#a99589;margin-bottom:6px;">Requested New Dates</div>
        <div style="font-size:13px;color:#7a6a60;line-height:1.8;">
          <strong style="color:#3a2e28;">New Needed:</strong> ${newPickup || '(unchanged)'}<br>
          <strong style="color:#3a2e28;">New Return:</strong> ${newReturn || '(unchanged)'}
        </div>
      </td></tr>
    </table>
    <div style="font-size:12px;color:#7a6a60;line-height:1.7;">Please reply to the customer at <a href="mailto:${customerEmail}" style="color:#3a2e28;">${customerEmail}</a> to confirm or discuss the changes.</div>
  </td></tr>
  <tr><td style="background:#3a2e28;padding:20px 36px;text-align:center;border-radius:0 0 14px 14px;">
    <div style="font-size:10px;color:#a99589;">The Backdrop Bar · info@backdropbarco.com</div>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    const payload = JSON.stringify({
      from: 'The Backdrop Bar <info@backdropbarco.com>',
      to: ['info@backdropbarco.com'],
      reply_to: customerEmail,
      subject: `Reservation Change Request — ${orderNumber}`,
      html
    });

    const result = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.resend.com',
        path: '/emails',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
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

    if (result.status >= 400) throw new Error(`Resend error: ${result.body}`);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
