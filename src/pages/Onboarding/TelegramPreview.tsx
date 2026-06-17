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
              <div className="text-[11px] text-[#7E8A99]">
                {t('onboarding.bot_subtitle')}
              </div>
            </div>
            <MoreVertical className="h-5 w-5 text-white" />
          </div>

          {/* chat body */}
          <div
            className="flex-1 overflow-hidden px-3.5 py-5"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 30%, rgba(84,169,235,0.05) 0%, transparent 50%)',
            }}
          >
            <div className="mb-4 text-center text-[11px] text-[#7E8A99]">
              {t('onboarding.chat_today')}
            </div>

            <TgBubble side="in" time="14:20">
              {t('onboarding.chat_greeting')}
            </TgBubble>

            <VoiceBubble />

            <TgBubble side="in" time="14:22">
              <div>✓ {t('onboarding.chat_saved')}</div>
              <div className="mt-2 rounded-[10px] border-l-[3px] border-[#54a9eb] bg-white/[0.06] px-3 py-2.5 text-[13px]">
                <div className="mb-0.5 text-[11px] uppercase tracking-wide text-[#9DB2C7]">
                  {t('onboarding.chat_expense')}
                </div>
                <div className="text-base font-semibold">35 000 so'm</div>
                <div className="mt-0.5 text-xs text-[#9DB2C7]">
                  🚕 {t('onboarding.chat_cat_transport')} ·{' '}
                  {t('onboarding.chat_today')}
                </div>
              </div>
            </TgBubble>

            <TgBubble side="out" time="14:22" status>
              {t('onboarding.chat_user_msg')}
            </TgBubble>

            <TgBubble side="in" time="14:22">
              ✓{' '}
              {t('onboarding.chat_saved_short', {
                amount: '80 000',
                cat: t('onboarding.chat_cat_food'),
              })}
            </TgBubble>

            {/* typing */}
            <div className="mt-1 flex justify-start">
              <div className="flex gap-1 rounded-[14px] rounded-bl-[4px] bg-[#182533] px-3.5 py-2.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-[#7E8A99]"
                    style={{
                      animation: `tg-dot 1.2s ${i * 0.2}s infinite ease-in-out`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* input bar */}
          <div className="flex items-center gap-2 bg-[#212D3B] px-3 py-2.5">
            <Plus className="h-5 w-5 text-[#7E8A99]" />
            <div className="flex-1 rounded-full bg-[#182533] px-3.5 py-1.5 text-[13px] text-[#7E8A99]">
              {t('onboarding.chat_input_placeholder')}
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#54a9eb]"
              style={{ animation: 'tg-pulse 2s infinite' }}
            >
              <Mic className="h-[18px] w-[18px] text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* footer caption */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-[11px] text-white/60">
        @{BOT_USERNAME}
      </div>
    </div>
  );
}