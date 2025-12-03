/**
 * Telegram Bot API utility functions
 * Sends messages to Telegram bot via Supabase Edge Function
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Sends a message to Telegram bot via Supabase Edge Function
 * @param text - Message text to send
 * @returns Promise<boolean> - Returns true if message was sent successfully
 */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  if (!SUPABASE_URL) {
    console.warn('Supabase URL topilmadi. Telegram xabar yuborilmaydi.');
    return false;
  }

  try {
    // Supabase Edge Function orqali Telegram xabar yuborish
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/send-telegram`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ message: text }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Telegram Edge Function xatosi:', errorData);
      return false;
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Telegram xabar yuborishda xatolik:', error);
    return false;
  }
}

/**
 * Formats registration form data into Telegram message
 */
export function formatRegistrationMessage(data: {
  fullName: string;
  age: string;
  phone: string;
  courseName: string;
}): string {
  return `
🆕 <b>Yangi ro'yxatdan o'tish</b>

👤 <b>Ism:</b> ${escapeHtml(data.fullName)}
📅 <b>Yosh:</b> ${escapeHtml(data.age)}
📱 <b>Telefon:</b> ${escapeHtml(data.phone)}
📚 <b>Kurs:</b> ${escapeHtml(data.courseName)}

⏰ <i>Vaqt: ${new Date().toLocaleString('uz-UZ')}</i>
  `.trim();
}

/**
 * Formats contact form data into Telegram message
 */
export function formatContactMessage(data: {
  name: string;
  email: string;
  message: string;
}): string {
  return `
📧 <b>Yangi xabar (Aloqa)</b>

👤 <b>Ism:</b> ${escapeHtml(data.name)}
📮 <b>Email:</b> ${escapeHtml(data.email)}
💬 <b>Xabar:</b>

${escapeHtml(data.message)}

⏰ <i>Vaqt: ${new Date().toLocaleString('uz-UZ')}</i>
  `.trim();
}

/**
 * Escapes HTML special characters for Telegram HTML parse mode
 */
function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
