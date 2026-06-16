import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronLeft, MoreVertical, Plus, Mic, Play } from 'lucide-react';

const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME ?? 'VoiceCashlyBot';

/**
 * Telegram chat preview. Decorative — illustrates what a confirmed voice
 * transaction looks like inside the bot. Telegram brand colors are hard-coded
 * on purpose; they don't follow our theme.
 */
export function TelegramPreview() {

  return (
    <div
      className="relative flex h-full items-center justify-center overflow-hidden p-12"
      style={{
        background:
          'linear-gradient(135deg, hsl(var(--primary-hover)), hsl(var(--primary)))',
      }}
    >

    </div>
  );
}