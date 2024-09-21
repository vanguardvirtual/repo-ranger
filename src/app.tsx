import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from '@pages/Homepage';
import ErrorBoundary from '@components/HOC/ErrorBoundary';
import Errorpage from '@pages/Errorpage';

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
    {
      path: '*',
      element: <Errorpage />,
    },
  ]);

  return (
    <>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>{<RouterProvider router={router} />}</QueryClientProvider>
      </ErrorBoundary>
    </>
  );
}
