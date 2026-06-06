import React from 'react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
          <h1 className="text-4xl font-bold text-destructive mb-4">Oops! Bir şeyler ters gitti.</h1>
          <p className="text-lg text-muted-foreground mb-6">Beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.</p>
          <div className="flex gap-4">
            <Button onClick={() => window.location.reload()}>
              Sayfayı Yenile
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Ana Sayfaya Dön
            </Button>
          </div>
          {import.meta.env.DEV && (
            <details className="mt-8 p-4 bg-secondary rounded-lg text-left w-full max-w-2xl">
              <summary className="cursor-pointer font-medium">Hata Detayları</summary>
              <pre className="mt-2 text-sm text-destructive-foreground bg-destructive/20 p-2 rounded overflow-auto">
                {this.state.error?.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;