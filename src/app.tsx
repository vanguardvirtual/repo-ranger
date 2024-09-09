import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from '@pages/Homepage';
import ErrorBoundary from '@components/HOC/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 0,
    },
    mutations: {
      retry: 0,
    },
  },
});

export function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Homepage />,
    },
  ]);

  return (
    <>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ErrorBoundary>
    </>
  );
}
