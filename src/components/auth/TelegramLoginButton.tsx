import { useEffect, useRef } from 'react';

interface TelegramLoginButtonProps {
  botUsername: string;
  authUrl: string;
  size?: 'large' | 'medium' | 'small';
  requestAccess?: boolean;
}

export function TelegramLoginButton({
  botUsername,
  authUrl,
  size = 'large',
  requestAccess = true,
}: TelegramLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', size);
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-auth-url', authUrl);
    if (requestAccess) script.setAttribute('data-request-access', 'write');

    const container = containerRef.current;
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [botUsername, size, requestAccess, authUrl]);

  return <div ref={containerRef} className="flex justify-center" />;
}
