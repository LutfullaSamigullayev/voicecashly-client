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
  const { t } = useTranslation();

  return (
    <div
      className="relative flex h-full items-center justify-center overflow-hidden p-12"
      style={{
        background:
          'linear-gradient(135deg, hsl(var(--primary-hover)), hsl(var(--primary)))',
      }}
    >
      {/* dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* phone */}
      <div className="relative z-10 h-[640px] w-[320px] rounded-[40px] bg-black p-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_30px_60px_-30px_rgba(0,0,0,0.4),inset_0_0_0_2px_rgba(255,255,255,0.06)]">
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[32px] bg-[#17212B]">
          {/* notch */}
          <div className="absolute left-1/2 top-2 z-10 h-[22px] w-[100px] -translate-x-1/2 rounded-full bg-black" />

          {/* status bar */}
          <div className="flex justify-between px-7 pb-1 pt-3 text-xs font-semibold text-white">
            <span>14:22</span>
            <span className="ml-12 tracking-widest">●●●●●</span>
          </div>

          {/* tg header */}
          <div className="flex items-center gap-3 border-b border-white/5 bg-[#212D3B] px-4 py-2.5">
            <ChevronLeft className="h-5 w-5 text-[#54a9eb]" />
            <BotAvatar />
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">VoiceCashly</div>
            </div>
            <MoreVertical className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

    </div>
  );
}