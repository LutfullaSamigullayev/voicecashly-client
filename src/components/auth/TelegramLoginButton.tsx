interface TelegramLoginButtonProps {
  botId: string;
  authUrl: string;
  label: string;
}

export function TelegramLoginButton({ botId, authUrl, label }: TelegramLoginButtonProps) {
  const handleClick = () => {
    const params = new URLSearchParams({
      bot_id: botId,
      origin: window.location.origin,
      return_to: authUrl,
      request_access: 'write',
    });
    window.location.href = `https://oauth.telegram.org/auth?${params.toString()}`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#54a9eb] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#3d97e0] focus:outline-none focus:ring-2 focus:ring-[#54a9eb] focus:ring-offset-2"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
      </svg>
      {label}
    </button>
  );
}
