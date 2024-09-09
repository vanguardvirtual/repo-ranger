import React from 'react';
import { IoChevronBackOutline } from 'react-icons/io5';

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <section class="bg-white h-screen flex items-center">
          <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div class="mx-auto max-w-screen-sm text-center">
              <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">Page Error</h1>
              <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">Something went wrong please check-back later.</p>
              <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">We are already working to solve the problem. </p>
              <div className="flex justify-center gap-2 mt-8">
                <a href="/" class="btn">
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
