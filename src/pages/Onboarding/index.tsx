import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME ?? 'VoiceCashlyBot';

export default function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const steps = [
    {
      icon: Bot,
      title: t('onboarding.step1'),
      desc: t('onboarding.step1_desc'),
      action: (
        <Button asChild variant="outline" size="sm">
          <a href={`https://t.me/${BOT_USERNAME}`} target="_blank" rel="noreferrer">
            {t('onboarding.open_bot')}
          </a>
        </Button>
      ),
    },
    {
      icon: MessageSquare,
      title: t('onboarding.step2'),
      desc: t('onboarding.step2_desc'),
    },
    {
      icon: ArrowRight,
      title: t('onboarding.step3'),
      desc: t('onboarding.step3_desc'),
    },
  ];

  return (
    <div className="mx-auto max-w-xl space-y-6 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-medium">{t('onboarding.title')}</h1>
      </div>
      <div className="space-y-3">
        {steps.map((s, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
              {s.action}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Button onClick={() => navigate('/')}>{t('onboarding.start')}</Button>
      </div>
    </div>
  );
}
