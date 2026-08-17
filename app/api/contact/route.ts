import { NextRequest, NextResponse } from 'next/server';
import { getDB, newId } from '@/lib/db';
import { createNotification } from '@/lib/notify';
import { requireAdmin } from '@/lib/authGuard';
import type { ContactMessage } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body ?? {};

    if (
      !name || typeof name !== 'string' ||
      !email || typeof email !== 'string' ||
      !message || typeof message !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Lütfen ad soyad, e-posta ve mesaj alanlarını doldurun.' },
        { status: 400 }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json({ error: 'Lütfen geçerli bir e-posta adresi girin.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const contactMessage: ContactMessage = {
      id: newId(),
      name: name.slice(0, 120).trim(),
      email: email.slice(0, 160).trim(),
      phone: phone && typeof phone === 'string' ? phone.slice(0, 40).trim() : '',
      subject: subject && typeof subject === 'string' ? subject.slice(0, 160).trim() : 'Genel',
      message: message.slice(0, 2000).trim(),
      status: 'yeni',
      createdAt: now,
    };

    const db = await getDB();
    db.data.contactMessages.unshift(contactMessage);
    await db.write();

    await createNotification({
      type: 'mesaj',
      refId: contactMessage.id,
      title: 'Yeni İletişim Mesajı',
      message: `${contactMessage.name}: "${contactMessage.subject}" konulu yeni bir mesaj gönderdi.`,
      emailSubject: `✉️ Yeni İletişim Mesajı — ${contactMessage.name}`,
      emailHtml: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="color:#7c3aed;">✉️ Yeni İletişim Mesajı</h2>
          <p><b>Ad Soyad:</b> ${contactMessage.name}</p>
          <p><b>E-posta:</b> ${contactMessage.email}</p>
          ${contactMessage.phone ? `<p><b>Telefon:</b> ${contactMessage.phone}</p>` : ''}
          <p><b>Konu:</b> ${contactMessage.subject}</p>
          <p><b>Mesaj:</b></p>
          <p style="background:#f9fafb;padding:12px;border-radius:8px;">${contactMessage.message}</p>
          <p style="color:#6b7280;font-size:12px;">Gönderim zamanı: ${new Date(contactMessage.createdAt).toLocaleString('tr-TR')}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: contactMessage }, { status: 201 });
  } catch (err) {
    console.error('[api/contact][POST]', err);
    return NextResponse.json({ error: 'Mesaj gönderilirken bir hata oluştu.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const db = await getDB();
  return NextResponse.json({ messages: db.data.contactMessages });
}
