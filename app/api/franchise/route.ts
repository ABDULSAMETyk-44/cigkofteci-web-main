import { NextRequest, NextResponse } from 'next/server';
import { getDB, newId } from '@/lib/db';
import { createNotification } from '@/lib/notify';
import { requireAdmin } from '@/lib/authGuard';
import type { FranchiseApplication } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, city, investmentBudget, experience, message } = body ?? {};

    if (
      !name || typeof name !== 'string' ||
      !email || typeof email !== 'string' ||
      !phone || typeof phone !== 'string' ||
      !city || typeof city !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Lütfen ad soyad, e-posta, telefon ve şehir bilgilerini girin.' },
        { status: 400 }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json({ error: 'Lütfen geçerli bir e-posta adresi girin.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const application: FranchiseApplication = {
      id: newId(),
      name: name.slice(0, 120).trim(),
      email: email.slice(0, 160).trim(),
      phone: phone.slice(0, 40).trim(),
      city: city.slice(0, 100).trim(),
      investmentBudget:
        investmentBudget && typeof investmentBudget === 'string' ? investmentBudget.slice(0, 60) : 'Belirtilmedi',
      experience: experience && typeof experience === 'string' ? experience.slice(0, 60) : 'Belirtilmedi',
      message: message && typeof message === 'string' ? message.slice(0, 2000).trim() : '',
      status: 'yeni',
      createdAt: now,
    };

    const db = await getDB();
    db.data.franchiseApplications.unshift(application);
    await db.write();

    await createNotification({
      type: 'bayilik',
      refId: application.id,
      title: 'Yeni Bayilik Başvurusu',
      message: `${application.name} (${application.city}) bayilik başvurusunda bulundu.`,
      emailSubject: `🤝 Yeni Bayilik Başvurusu — ${application.name}`,
      emailHtml: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="color:#ea580c;">🤝 Yeni Bayilik Başvurusu</h2>
          <p><b>Ad Soyad:</b> ${application.name}</p>
          <p><b>E-posta:</b> ${application.email}</p>
          <p><b>Telefon:</b> ${application.phone}</p>
          <p><b>Şehir:</b> ${application.city}</p>
          <p><b>Yatırım Bütçesi:</b> ${application.investmentBudget}</p>
          <p><b>Sektör Deneyimi:</b> ${application.experience}</p>
          ${application.message ? `<p><b>Mesaj:</b></p><p style="background:#f9fafb;padding:12px;border-radius:8px;">${application.message}</p>` : ''}
          <p style="color:#6b7280;font-size:12px;">Başvuru zamanı: ${new Date(application.createdAt).toLocaleString('tr-TR')}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (err) {
    console.error('[api/franchise][POST]', err);
    return NextResponse.json({ error: 'Başvuru gönderilirken bir hata oluştu.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const db = await getDB();
  return NextResponse.json({ applications: db.data.franchiseApplications });
}
