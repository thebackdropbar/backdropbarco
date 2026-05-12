const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { orderNumber, customerEmail, customerName, itemName, itemVariant, itemQty, pickup, ret, total } = JSON.parse(event.body);

    const firstName = customerName ? customerName.split(' ')[0] : 'there';

    // ── Email to CUSTOMER ──────────────────────────────────────────────
    const customerHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0ebe4;font-family:'Helvetica Neue',Arial,sans-serif;font-weight:300;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebe4;padding:32px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

  <tr><td style="background:#3a2e28;padding:32px 40px;text-align:center;border-radius:14px 14px 0 0;">
    <div style="font-family:Georgia,serif;font-size:28px;font-weight:300;color:#fdf8f3;letter-spacing:0.04em;">the backdrop bar</div>
    <div style="width:36px;height:1px;background:rgba(201,180,154,0.5);margin:12px auto;"></div>
    <div style="font-size:10px;letter-spacing:0.24em;text-transform:uppercase;color:#c9b49a;">Cancellation Confirmation</div>
  </td></tr>

  <tr><td style="background:#fdf8f3;padding:36px 40px 28px;text-align:center;">
    <div style="font-size:26px;margin-bottom:10px;">🤍</div>
    <div style="font-family:Georgia,serif;font-size:24px;font-weight:300;color:#3a2e28;margin-bottom:10px;">Your reservation has been cancelled, ${firstName}.</div>
    <div style="font-size:13px;color:#7a6a60;line-height:1.8;max-width:400px;margin:0 auto;">
      We're sorry to see you go. Your cancellation has been processed and a refund will be issued in accordance with our cancellation policy.
    </div>
  </td></tr>

  <tr><td style="background:#fdf8f3;padding:0 40px 28px;">
    <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#a99589;margin-bottom:12px;">Cancelled Reservation</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:white;border:1px solid rgba(201,180,154,0.25);border-radius:10px;overflow:hidden;">
      <tr><td style="padding:14px 24px;border-bottom:1px solid rgba(201,180,154,0.15);">
        <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#a99589;margin-bottom:3px;">Order Number</div>
        <div style="font-size:14px;color:#3a2e28;">${orderNumber}</div>
      </td></tr>
      <tr><td style="padding:14px 24px;border-bottom:1px solid rgba(201,180,154,0.15);">
        <div style="font-family:Georgia,serif;font-size:15px;color:#3a2e28;margin-bottom:3px;">${itemName}</div>
        <div style="font-size:11px;color:#a99589;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">${itemVariant} · Qty ${itemQty}</div>
        <div style="font-size:12px;color:#7a6a60;line-height:1.8;">
          <strong style="color:#3a2e28;">Needed:</strong> ${pickup}<br>
          <strong style="color:#3a2e28;">Return:</strong> ${ret}
        </div>
      </td></tr>
      <tr><td style="padding:14px 24px;">
        <table width="100%"><tr>
          <td style="font-size:13px;color:#7a6a60;">Original Order Total</td>
          <td style="text-align:right;font-size:13px;color:#3a2e28;">$${parseFloat(total).toFixed(2)}</td>
        </tr></table>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="background:#fdf8f3;padding:0 40px 28px;">
    <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#a99589;margin-bottom:12px;">Refund Policy</div>
    <div style="font-size:12px;color:#7a6a60;line-height:2;padding:16px 20px;background:#f5ede1;border-radius:10px;">
      <span style="color:#3a2e28;font-weight:400;">10+ days before event</span> — Full refund<br>
      <span style="color:#3a2e28;font-weight:400;">2–10 days before event</span> — 50% refund<br>
      <span style="color:#3a2e28;font-weight:400;">Within 48 hours</span> — No refund<br><br>
      <span style="font-size:11px;">Refunds are typically processed within 5–10 business days and will appear on your original payment method.</span>
    </div>
  </td></tr>

  <tr><td style="background:#fdf8f3;padding:0 40px 36px;">
    <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#a99589;margin-bottom:12px;">Questions?</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:white;border:1px solid rgba(201,180,154,0.25);border-radius:10px;">
      <tr>
        <td style="width:50%;text-align:center;padding:16px 8px;">
          <div style="font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#a99589;margin-bottom:6px;">Email</div>
          <a href="mailto:info@backdropbarco.com" style="font-size:12px;color:#3a2e28;text-decoration:none;">info@backdropbarco.com</a>
        </td>
        <td style="width:1px;background:rgba(201,180,154,0.25);"></td>
        <td style="width:50%;text-align:center;padding:16px 8px;">
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
      © 2026 The Backdrop Bar. All rights reserved.
    </div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    // ── Email to OWNER ─────────────────────────────────────────────────
    const ownerHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0ebe4;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebe4;padding:32px 0;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
  <tr><td style="background:#3a2e28;padding:28px 36px;text-align:center;border-radius:14px 14px 0 0;">
    <div style="font-family:Georgia,serif;font-size:22px;color:#fdf8f3;">the backdrop bar</div>
    <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#c9b49a;margin-top:8px;">Reservation Cancelled</div>
  </td></tr>
  <tr><td style="background:#fdf8f3;padding:32px 36px;">
    <div style="font-family:Georgia,serif;font-size:20px;color:#3a2e28;margin-bottom:16px;">A customer has cancelled their reservation</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ede1;border-radius:10px;margin-bottom:20px;">
      <tr><td style="padding:14px 20px;border-bottom:1px solid rgba(201,180,154,0.2);">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.16em;color:#a99589;margin-bottom:3px;">Order Number</div>
        <div style="font-size:14px;color:#3a2e28;">${orderNumber}</div>
      </td></tr>
      <tr><td style="padding:14px 20px;border-bottom:1px solid rgba(201,180,154,0.2);">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.16em;color:#a99589;margin-bottom:3px;">Customer</div>
        <div style="font-size:14px;color:#3a2e28;">${customerName}</div>
        <div style="font-size:12px;color:#7a6a60;margin-top:2px;"><a href="mailto:${customerEmail}" style="color:#7a6a60;">${customerEmail}</a></div>
      </td></tr>
      <tr><td style="padding:14px 20px;border-bottom:1px solid rgba(201,180,154,0.2);">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.16em;color:#a99589;margin-bottom:3px;">Item</div>
        <div style="font-size:14px;color:#3a2e28;">${itemName}</div>
        <div style="font-size:12px;color:#7a6a60;">${itemVariant} · Qty ${itemQty}</div>
      </td></tr>
      <tr><td style="padding:14px 20px;border-bottom:1px solid rgba(201,180,154,0.2);">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.16em;color:#a99589;margin-bottom:6px;">Dates</div>
        <div style="font-size:13px;color:#7a6a60;line-height:1.8;">
          <strong style="color:#3a2e28;">Needed:</strong> ${pickup}<br>
          <strong style="color:#3a2e28;">Return:</strong> ${ret}
        </div>
      </td></tr>
      <tr><td style="padding:14px 20px;">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.16em;color:#a99589;margin-bottom:3px;">Order Total</div>
        <div style="font-size:14px;color:#3a2e28;">$${parseFloat(total).toFixed(2)}</div>
      </td></tr>
    </table>
    <div style="font-size:12px;color:#7a6a60;line-height:1.7;">Please process any applicable refund via the Stripe dashboard and verify the cancellation policy applies correctly.</div>
  </td></tr>
  <tr><td style="background:#3a2e28;padding:20px 36px;text-align:center;border-radius:0 0 14px 14px;">
    <div style="font-size:10px;color:#a99589;">The Backdrop Bar · info@backdropbarco.com</div>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    const sendEmail = (payload) => new Promise((resolve, reject) => {
      const body = JSON.stringify(payload);
      const req = https.request({
        hostname: 'api.resend.com',
        path: '/emails',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });

    // Send both emails
    const [customerResult, ownerResult] = await Promise.all([
      sendEmail({
        from: 'The Backdrop Bar <info@backdropbarco.com>',
        to: [customerEmail],
        subject: `Cancellation Confirmed — ${orderNumber}`,
        html: customerHtml
      }),
      sendEmail({
        from: 'The Backdrop Bar <info@backdropbarco.com>',
        to: ['info@backdropbarco.com'],
        reply_to: customerEmail,
        subject: `Reservation Cancelled — ${orderNumber}`,
        html: ownerHtml
      })
    ]);

    if (customerResult.status >= 400) throw new Error(`Customer email error: ${customerResult.body}`);
    if (ownerResult.status >= 400) throw new Error(`Owner email error: ${ownerResult.body}`);

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
