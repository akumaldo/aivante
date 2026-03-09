export const config = {
  runtime: 'edge',
};

interface LeadPayload {
  nome: string;
  email: string;
  empresa: string;
  area: string;
  maturidade: string;
  resumo: string;
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'akumaldo@gmail.com';

  if (!resendApiKey) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let lead: LeadPayload;
  try {
    lead = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!lead.nome || !lead.email) {
    return new Response(JSON.stringify({ error: 'Missing required fields: nome, email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1a1a1a; padding: 24px; border-radius: 12px; border: 1px solid #C8A45E;">
        <h1 style="color: #C8A45E; margin: 0 0 20px 0; font-size: 22px;">Novo Lead AIPF</h1>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #999; padding: 8px 0; width: 120px; vertical-align: top;">Nome:</td>
            <td style="color: #f2ede6; padding: 8px 0;">${lead.nome}</td>
          </tr>
          <tr>
            <td style="color: #999; padding: 8px 0; vertical-align: top;">Email:</td>
            <td style="color: #f2ede6; padding: 8px 0;"><a href="mailto:${lead.email}" style="color: #C8A45E;">${lead.email}</a></td>
          </tr>
          <tr>
            <td style="color: #999; padding: 8px 0; vertical-align: top;">Empresa:</td>
            <td style="color: #f2ede6; padding: 8px 0;">${lead.empresa || 'Não informado'}</td>
          </tr>
          <tr>
            <td style="color: #999; padding: 8px 0; vertical-align: top;">Área:</td>
            <td style="color: #f2ede6; padding: 8px 0;">${lead.area || 'Não informado'}</td>
          </tr>
          <tr>
            <td style="color: #999; padding: 8px 0; vertical-align: top;">Maturidade:</td>
            <td style="color: #f2ede6; padding: 8px 0;">${lead.maturidade || 'Não informado'}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #333;">
          <h2 style="color: #C8A45E; font-size: 16px; margin: 0 0 8px 0;">Resumo da Conversa</h2>
          <p style="color: #f2ede6; line-height: 1.6; margin: 0;">${lead.resumo || 'Sem resumo disponível'}</p>
        </div>

        <div style="margin-top: 20px; padding-top: 12px; border-top: 1px solid #333; color: #666; font-size: 12px;">
          Recebido em ${timestamp}
        </div>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AIPF <onboarding@resend.dev>',
        to: [notificationEmail],
        subject: `Novo Lead AIPF — ${lead.nome}${lead.empresa ? ` (${lead.empresa})` : ''}`,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return new Response(JSON.stringify({ error: 'Failed to send email', details: errorData }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
