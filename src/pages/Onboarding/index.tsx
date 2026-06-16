import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Send, Check, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceWaveform } from './VoiceWaveform';
import { TelegramPreview } from './TelegramPreview';

const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME ?? 'VoiceCashlyBot';

type StepState = 'done' | 'active' | 'todo';
type Step = { title: string; desc: string; state: StepState };

export default function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const steps: Step[] = [
    {
      title: t('onboarding.step1'),
      desc: t('onboarding.step1_desc'),
      state: 'done',
    },
    {
      title: t('onboarding.step2'),
      desc: t('onboarding.step2_desc'),
      state: 'active',
    },
    {
      title: t('onboarding.step3'),
      desc: t('onboarding.step3_desc'),
      state: 'todo',
    },
  ];

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      {/* LEFT — content */}
      <div className="flex flex-col px-8 py-12 md:px-16">
        {/* Brand row */}
        <div className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="" className="h-7 w-7" />
            <span className="text-[15px] font-semibold tracking-tight">
              VoiceCashly
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="h-1.5 w-1.5 rounded-full bg-income"
              style={{ boxShadow: '0 0 0 3px hsl(var(--income) / 0.18)' }}
            />
            {t('onboarding.bot_online')}
          </div>
        </div>

        {/* Title */}
        <div className="mb-10">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {t('onboarding.eyebrow')}
          </div>
          <h1
            className="mb-5 text-balance text-[44px] font-normal leading-[1.05] tracking-[-0.04em] md:text-[56px]"
            style={{
              fontFamily:
                "'DM Serif Display', 'Source Serif 4', Georgia, serif",
            }}
          >
            {t('onboarding.title_line1')}
            <br />
            <span className="italic text-primary">
              {t('onboarding.title_line2')}
            </span>
          </h1>
          <p className="mb-8 max-w-[460px] text-base leading-[1.55] text-muted-foreground">
            {t('onboarding.subtitle')}
          </p>

          {/* Voice waveform card */}
          <div className="flex max-w-[520px] items-center gap-5 rounded-[14px] border border-border bg-secondary px-5 py-4">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
              style={{ animation: 'onboarding-mic-pulse 2s infinite' }}
            >
              <Mic className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t('onboarding.voice_live')}
              </div>
              <VoiceWaveform />
            </div>
            <div className="tabular font-mono text-xs text-primary">0:04</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute bottom-[22px] left-[19px] top-[22px] w-0.5"
            style={{
              background:
                'linear-gradient(to bottom, hsl(var(--primary)) 0%, hsl(var(--primary)) 40%, hsl(var(--border)) 40%, hsl(var(--border)) 100%)',
            }}
          />
          {steps.map((s, i) => (
            <div
              key={i}
              className={`relative grid grid-cols-[40px_1fr] items-start gap-5 ${
                i < steps.length - 1 ? 'mb-7' : ''
              }`}
            >
              <StepDot index={i + 1} state={s.state} />
              <div className="pt-1.5">
                <div
                  className={`mb-1 text-[17px] font-semibold tracking-tight ${
                    s.state === 'todo'
                      ? 'text-muted-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {s.title}
                </div>
                <div className="max-w-[380px] text-[13.5px] leading-[1.5] text-muted-foreground">
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-auto flex flex-wrap gap-3 pt-14">
          <Button asChild size="lg" className="gap-2.5 px-6">
            <a
              href={`https://t.me/${BOT_USERNAME}`}
              target="_blank"
              rel="noreferrer"
            >
              <Send className="h-4 w-4" />
              {t('onboarding.open_telegram')}
            </a>
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/')}>
            {t('onboarding.later')}
          </Button>
        </div>
      </div>

      {/* RIGHT — Telegram preview (desktop only) */}
      <div className="hidden lg:block">
        <TelegramPreview />
      </div>

      <style>{`
        @keyframes onboarding-mic-pulse {
          0%   { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.4); }
          70%  { box-shadow: 0 0 0 12px hsl(var(--primary) / 0); }
          100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0); }
        }
      `}</style>
    </div>
  );
}

function StepDot({ index, state }: { index: number; state: StepState }) {
  const base =
    'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold tabular';

  if (state === 'done') {
    return (
      <div
        className={`${base} border-primary bg-primary text-primary-foreground`}
      >
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </div>
    );
  }

  if (state === 'active') {
    return (
      <div
        className={`${base} border-primary bg-card text-primary`}
        style={{ boxShadow: '0 0 0 6px hsl(var(--primary) / 0.12)' }}
      >
        {index}
      </div>
    );
  }

  return (
    <div className={`${base} border-border bg-card text-muted-foreground`}>
      {index}
    </div>
  );
}
