import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="text-6xl font-medium">404</div>
      <p className="text-muted-foreground">Page not found</p>
      <Button asChild>
        <Link to="/">Home</Link>
      </Button>
    </div>
  );
}
