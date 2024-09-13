import { ErrorInfo } from 'preact';
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <section className="bg-white h-screen flex items-center">
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">Page Error</h1>
              <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
                Something went wrong please check-back later.
              </p>
              <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">We are already working to solve the problem. </p>
              <div className="flex justify-center gap-2 mt-8">
                <a href="/" className="btn">
                  Back To Homepage
                </a>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
