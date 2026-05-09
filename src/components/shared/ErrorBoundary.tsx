import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-full bg-destructive/10 p-3 text-destructive">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-lg font-medium">Nimadir noto'g'ri ketdi</h1>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {this.state.error?.message ?? 'Kutilmagan xatolik yuz berdi.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={this.handleReset}>
            Qayta urinish
          </Button>
          <Button onClick={this.handleReload}>
            <RefreshCw className="h-4 w-4" />
            Sahifani yangilash
          </Button>
        </div>
      </div>
    );
  }
}
