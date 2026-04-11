exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Basic rate limiting signal — reject if no origin (direct script hits)
  const origin = event.headers['origin'] || event.headers['referer'] || '';
  const allowed = process.env.ALLOWED_ORIGIN || '';
  if (allowed && !origin.startsWith(allowed)) {
    return { statusCode: 403, body: 'Forbidden' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Bad Request' };
  }

  // Honeypot: if this hidden field has a value a bot filled it in
  if (data._hp) {
    return { statusCode: 200, body: JSON.stringify({ status: 'ok' }) };
  }

  // Sanity check: timestamp must be recent (within 30 minutes)
  const ts = new Date(data.ts).getTime();
  if (isNaN(ts) || Date.now() - ts > 30 * 60 * 1000) {
    return { statusCode: 400, body: 'Stale submission' };
  }

  const sheetUrl = process.env.SHEET_URL;
  if (!sheetUrl) {
    return { statusCode: 500, body: 'Server misconfigured' };
  }

  const resp = await fetch(sheetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    redirect: 'follow'
  });

  if (!resp.ok) {
    return { statusCode: 502, body: 'Upstream error' };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'ok' })
  };
};
