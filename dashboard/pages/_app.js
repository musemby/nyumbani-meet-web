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

import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';

export const GlobalLoader = () => {
  const [spinning, setSpinning] = useState(true);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let ptg = 0;
    const interval = setInterval(() => {
      ptg += 5;
      setPercent(ptg);
      if (ptg >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setSpinning(false);
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Hide the initial loader div
    const initialLoader = document.getElementById('globalLoader');
    if (initialLoader) {
      initialLoader.style.display = 'none';
    }
  }, []);

  return (
    <Spin spinning={spinning} percent={percent} fullscreen />
  );
};


export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // Simulate minimum loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
      clearTimeout(timer);
    };
  }, [router]);
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
          {loading && <GlobalLoader />}
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
