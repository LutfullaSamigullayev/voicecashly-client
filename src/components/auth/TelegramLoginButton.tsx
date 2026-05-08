import { useEffect, useRef } from 'react';
import type { TelegramAuthData } from '@/types';

interface TelegramLoginButtonProps {
  botUsername: string;
  onAuth: (user: TelegramAuthData) => void;
  size?: 'large' | 'medium' | 'small';
  requestAccess?: boolean;
}

declare global {
  interface Window {
    onTelegramAuthCallback?: (user: TelegramAuthData) => void;
  }
}

export function TelegramLoginButton({
  botUsername,
  onAuth,
  size = 'large',
  requestAccess = true,
}: TelegramLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.onTelegramAuthCallback = (user) => {
      console.log('[TG widget] onAuth fired', user);
      onAuth(user);
    };
    console.log('[TG widget] callback registered for', botUsername);

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.onload = () => console.log('[TG widget] script loaded');
    script.onerror = (e) => console.error('[TG widget] script failed', e);
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', size);
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-onauth', 'onTelegramAuthCallback(user)');
    if (requestAccess) script.setAttribute('data-request-access', 'write');

    const container = containerRef.current;
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
    }

    return () => {
      window.onTelegramAuthCallback = undefined;
      if (container) container.innerHTML = '';
    };
  }, [botUsername, size, requestAccess, onAuth]);

  return <div ref={containerRef} className="flex justify-center" />;
}
