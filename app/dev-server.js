import { createServer } from 'http';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
try {
  const envFile = readFileSync(resolve(__dirname, '.env.local'), 'utf-8');
  envFile.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) return;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim();
    if (key) process.env[key] = val;
  });
} catch {
  // .env.local not found, rely on existing env vars
}

const SYSTEM_PROMPT = readFileSync(resolve(__dirname, '..', 'api', 'chat.ts'), 'utf-8')
  .match(/const SYSTEM_PROMPT = `([\s\S]*?)`;/)?.[1] || '';

const PORT = 3001;

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      try {
        const { messages } = JSON.parse(body);
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'OPENROUTER_API_KEY not set. Create app/.env.local with your key.' }));
          return;
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'AIPF Chat Assistant (Dev)',
          },
          body: JSON.stringify({
            model: 'arcee-ai/trinity-large-preview:free',
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
            stream: true,
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          res.writeHead(response.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `OpenRouter error: ${response.status}`, details: errText }));
          return;
        }

        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        });

        const reader = response.body.getReader();
        const pump = async () => {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            return;
          }
          res.write(value);
          return pump();
        };
        await pump();
      } catch (err) {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
        }
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else if (req.method === 'POST' && req.url === '/api/send-email') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      try {
        const leadData = JSON.parse(body);
        const resendApiKey = process.env.RESEND_API_KEY;
        const notificationEmail = process.env.NOTIFICATION_EMAIL || 'akumaldo@gmail.com';

        if (!resendApiKey) {
          console.log('[Dev] Email would be sent (RESEND_API_KEY not set):');
          console.log(JSON.stringify(leadData, null, 2));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, dev: true }));
          return;
        }

        const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'AIPF <onboarding@resend.dev>',
            to: [notificationEmail],
            subject: `Novo Lead AIPF — ${leadData.nome}${leadData.empresa ? ` (${leadData.empresa})` : ''}`,
            html: `<pre>${JSON.stringify(leadData, null, 2)}</pre><p>Recebido em ${timestamp}</p>`,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to send email', details: errText }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => {
  console.log(`Chat API dev server running on http://localhost:${PORT}`);
  console.log('Make sure app/.env.local has OPENROUTER_API_KEY set.');
});
