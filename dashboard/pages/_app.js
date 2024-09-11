import '../styles/globals.css'

import DashboardLayout from '../src/components/DashboardLayout'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { SnackbarProvider } from 'notistack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      cacheTime: 1000 * 60 * 60,
    },
  },
})

export default function App({ Component, pageProps }) {
  const router = useRouter()
  return (
    <>
    <Head>
      <link rel="icon" href="/images/favicon.ico" />
      <title>Nyumbani</title>
    </Head>
      <SnackbarProvider
        preventDuplicate
        autoHideDuration={2500}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <QueryClientProvider client={queryClient}>
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
          {!router.pathname.startsWith('/login') ? (
            <DashboardLayout>
              <Component {...pageProps} />
            </DashboardLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </QueryClientProvider>
      </SnackbarProvider>
    </>
  )
}
