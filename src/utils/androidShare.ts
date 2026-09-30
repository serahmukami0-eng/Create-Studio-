/**
 * Native Android Share Utility
 * Leverages navigator.share on Android mobile devices with fallbacks to WhatsApp or clipboard.
 */

export interface ShareOptions {
  title: string;
  text: string;
  url?: string;
}

export async function shareToAndroidOrWeb(options: ShareOptions): Promise<'shared' | 'copied' | 'whatsapp'> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url || window.location.href,
      });
      return 'shared';
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Native share failed, falling back:', err);
      }
    }
  }

  // Fallback 1: Clipboard
  try {
    await navigator.clipboard.writeText(options.text);
    return 'copied';
  } catch (err) {
    // Fallback 2: WhatsApp Web / Direct Intent
    const encoded = encodeURIComponent(options.text);
    window.location.href = `https://wa.me/?text=${encoded}`;
    return 'whatsapp';
  }
}
