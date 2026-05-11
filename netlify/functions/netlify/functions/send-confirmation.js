const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const {
      customerEmail, customerName, orderNumber,
      items, subtotal, tax, total,
      address, phone
    } = JSON.parse(event.body);

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding:14px 24px;border-bottom:1px solid rgba(201,180,154,0.15);">
          <div style="font-family:Georgia,serif;font-size:15px;color:#3a2e28;margin-bottom:3px;">${item.title}</div>
          <div style="font-size:11px;color:#a99589;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">${item.variant} · Qty ${item.qty}</div>
          <div style="font-size:12px;color:#7a6a60;line-height:1.8;">
            <strong style="color:#3a2e28;">Needed:</strong> ${item.pickup}<br>
            <strong style="color:#3a2e28;">Return:</strong> ${item.ret}<br>
            <strong style="color:#3a2e28;">Duration:</strong> ${item.duration}
          </div>
        </td>
      </tr>`).join('');

    const manageUrl = `https://backdropbarco.com/manage.html?order=${orderNumber}`;

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0ebe4;font-family:'Helvetica Neue',Arial,sans-serif;font-weight:300;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebe4;padding:32px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

  <tr><td style="background:#3a2e28;padding:32px 40px;text-align:center;border-radius:14px 14px 0 0;">
    <div style="font-family:Georgia,serif;font-size:28px;font-weight:300;color:#fdf8f3;letter-spacing:0.04em;">the backdrop bar</div>
    <div style="width:36px;height:1px;background:rgba(201,180,154,0.5);margin:12px auto;"></div>
    <div style="font-size:10px;letter-spacing:0.24em;text-transform:uppercase;color:#c9b49a;">Booking Confirmation</div>
  </td></tr>

  <tr><td style="background:#fdf8f3;padding:36px 40px 28px;text-align:center;">
    <div style="font-size:26px;margin-bottom:10px;">✨</div>
    <div style="font-family:Georgia,serif;font-size:24px;font-weight:300;color:#3a2e28;margin-bottom:10px;">You're all set, ${customerName.split(' ')[0]}!</div>
    <div style="font-size:13px;color:#7a6a60;line-height:1.8;max-width:400px;margin:0 auto;">
      Thank you for your booking. Your reservation is confirmed and your full payment has been processed. We can't wait to be part of your special day.
    </div>
  </td></tr>

  <tr><td style="background:#fdf8f3;padding:0 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ede1;border-radius:10px;overflow:hidden;">
      <tr><td style="padding:14px 24px;border-bottom:1px solid rgba(201,180,154,0.2);">
        <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#a99589;margin-bottom:3px;">Order Number</div>
        <div style="font-size:14px;color:#3a2e28;font-weight:400;">${orderNumber}</div>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="background:#fdf8f3;padding:0 40px 28px;">
    <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#a99589;margin-bottom:12px;">Your Rental</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:white;border:1px solid rgba(201,180,154,0.25);border-radius:10px;overflow:hidden;">
      ${itemsHtml}
    </table>
  </td></tr>

  <tr><td style="background:#fdf8f3;padding:0 40px 28px;">
    <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#a99589;margin-bottom:12px;">Payment Summary</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:white;border:1px solid rgba(201,180,154,0.25);border-radius:10px;overflow:hidden;">
      <tr><td style="padding:12px 24px;border-bottom:1px solid rgba(201,180,154,0.15);">
        <table width="100%"><tr>
          <td style="font-size:13px;color:#7a6a60;">Subtotal</td>
          <td style="text-align:right;font-size:13px;color:#3a2e28;">$${subtotal}</td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:12px 24px;border-bottom:1px solid rgba(201,180,154,0.15);">
        <table width="100%"><tr>
          <td style="font-size:13px;color:#7a6a60;">CA Sales Tax (9.875%)</td>
          <td style="text-align:right;font-size:13px;color:#3a2e28;">$${tax}</td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:12px 24px;border-bottom:1px solid rgba(201,180,154,0.2);">
        <table width="100%"><tr>
          <td style="font-size:14px;font-weight:400;color:#3a2e28;">Order Total</td>
          <td style="text-align:right;font-size:14px;font-weight:400;color:#3a2e28;">$${total}</td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:14px 24px;background:#f5ede1;">
        <table width="100%"><tr>
          <td style="font-size:12px;color:#7a6a60;">Total Charged Today</td>
          <td style="text-align:right;font-size:17px;font-weight:400;color:#3a2e28;">$${total}</td>
        </tr></table>
      </td></tr>
    </table>
    <div style="font-size:11px;color:#a99589;margin-top:8px;line-height:1.7;padding:10px 14px;background:#f5ede1;border-radius:8px;">
      A <strong style="color:#7a6a60;">$175.00 damage hold</strong> has been pre-authorized on your card. This is not a charge — it will be released within 5–7 days after your items are returned in good condition.
    </div>
  </td></tr>

  <tr><td style="background:#fdf8f3;padding:0 40px 28px;">
    <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#a99589;margin-bottom:12px;">Delivery Details</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:white;border:1px solid rgba(201,180,154,0.25);border-radius:10px;">
      <tr><td style="padding:18px 24px;font-size:12px;color:#7a6a60;line-height:2;">
        <strong style="color:#3a2e28;display:block;margin-bottom:4px;">${customerName}</strong>
        ${address}<br>${phone}<br>${customerEmail}
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="background:#fdf8f3;padding:0 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#f5ede1,#ecddd0);border-radius:10px;">
      <tr><td style="padding:22px 26px;">
        <div style="font-family:Georgia,serif;font-size:17px;font-weight:300;color:#3a2e28;margin-bottom:7px;">Need to adjust your reservation?</div>
        <div style="font-size:12px;color:#7a6a60;line-height:1.7;margin-bottom:16px;">You can request changes to your rental dates up to 48 hours before your event.</div>
        <a href="${manageUrl}" style="display:inline-block;padding:11px 26px;background:#3a2e28;color:#fdf8f3;text-decoration:none;border-radius:8px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;">Manage My Reservation</a>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="background:#fdf8f3;padding:0 40px 28px;">
    <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#a99589;margin-bottom:12px;">Cancellation Policy</div>
    <div style="font-size:12px;color:#7a6a60;line-height:2;">
      <span style="color:#3a2e28;font-weight:400;">5+ days before event</span> — Full refund<br>
      <span style="color:#3a2e28;font-weight:400;">2–4 days before event</span> — 50% refund<br>
      <span style="color:#3a2e28;font-weight:400;">Within 48 hours</span> — No refund
    </div>
  </td></tr>

  <tr><td style="background:#fdf8f3;padding:0 40px 36px;">
    <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#a99589;margin-bottom:12px;">Questions? We're Here</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:white;border:1px solid rgba(201,180,154,0.25);border-radius:10px;">
      <tr>
        <td style="width:33%;text-align:center;padding:16px 8px;">
          <div style="font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#a99589;margin-bottom:6px;">Email</div>
          <a href="mailto:info@backdropbarco.com" style="font-size:12px;color:#3a2e28;text-decoration:none;">info@backdropbarco.com</a>
        </td>
        <td style="width:1px;background:rgba(201,180,154,0.25);"></td>
        <td style="width:33%;text-align:center;padding:16px 8px;">
          <div style="font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#a99589;margin-bottom:6px;">Call or Text</div>
          <div style="font-size:12px;color:#3a2e28;">Coming Soon</div>
        </td>
        <td style="width:1px;background:rgba(201,180,154,0.25);"></td>
        <td style="width:33%;text-align:center;padding:16px 8px;">
          <div style="font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#a99589;margin-bottom:6px;">Instagram</div>
          <a href="https://instagram.com/thebackdropbar" style="font-size:12px;color:#3a2e28;text-decoration:none;">@thebackdropbar</a>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="background:#3a2e28;padding:26px 40px;text-align:center;border-radius:0 0 14px 14px;">
    <div style="font-family:Georgia,serif;font-size:20px;font-weight:300;color:#fdf8f3;margin-bottom:6px;">the backdrop bar</div>
    <div style="font-size:10px;color:#a99589;letter-spacing:0.1em;margin-bottom:12px;">Bay Area, California · backdropbarco.com</div>
    <div style="font-size:9px;color:rgba(201,180,154,0.5);line-height:1.7;">
      You received this email because you placed an order at backdropbarco.com.<br>
      © 2026 The Backdrop Bar. All rights reserved.
    </div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    const resendPayload = JSON.stringify({
      from: 'The Backdrop Bar <info@backdropbarco.com>',
      to: [customerEmail],
      bcc: ['info@backdropbarco.com'],
      subject: `✨ Booking Confirmed — ${orderNumber}`,
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
          'Content-Length': Buffer.byteLength(resendPayload)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      });
      req.on('error', reject);
      req.write(resendPayload);
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
