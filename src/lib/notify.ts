import { prisma } from './prisma';
import { sendEmail, emailTemplate } from './email';
import type { NotificationType } from '@prisma/client';

export async function notify(opts: {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
  sendEmailAlso?: boolean;
}) {
  // Always create in-app
  const n = await prisma.notification.create({
    data: {
      userId: opts.userId,
      type: opts.type,
      title: opts.title,
      body: opts.body,
      link: opts.link,
    },
  });

  // Optionally send email
  if (opts.sendEmailAlso) {
    const user = await prisma.user.findUnique({ where: { id: opts.userId } });
    if (user?.email) {
      const url = opts.link ? `${process.env.NEXT_PUBLIC_APP_URL}${opts.link}` : undefined;
      sendEmail({
        to: user.email,
        subject: opts.title,
        html: emailTemplate({
          title: opts.title,
          body: opts.body || opts.title,
          ctaUrl: url,
          ctaLabel: 'Open Venture Builders',
        }),
      }).catch((e) => console.error('[email] send failed:', e));
    }
  }
  return n;
}
