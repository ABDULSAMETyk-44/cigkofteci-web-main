import { getDB, newId } from './db';
import { sendNotificationEmail } from './mailer';
import type { Notification, NotificationType } from './types';

interface CreateNotificationParams {
  type: NotificationType;
  refId: string;
  title: string;
  message: string;
  emailSubject?: string;
  emailHtml?: string;
}

/**
 * Hem admin panelindeki "Bildirimler" listesine bir kayıt ekler
 * hem de (SMTP tanımlıysa) site sahibine e-posta gönderir.
 */
export async function createNotification(params: CreateNotificationParams): Promise<Notification> {
  const db = await getDB();

  const notification: Notification = {
    id: newId(),
    type: params.type,
    refId: params.refId,
    title: params.title,
    message: params.message,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  db.data.notifications.unshift(notification);
  // Bildirim listesinin sonsuza kadar büyümesini engelle (son 500 kayıt yeterli).
  if (db.data.notifications.length > 500) {
    db.data.notifications.length = 500;
  }
  await db.write();

  if (params.emailSubject && params.emailHtml) {
    // E-posta gönderimi ana akışı bloklamasın / hataya düşürmesin.
    sendNotificationEmail(params.emailSubject, params.emailHtml).catch((err) => {
      console.error('[notify] E-posta gönderim hatası:', err);
    });
  }

  return notification;
}
