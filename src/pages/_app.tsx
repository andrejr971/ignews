import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import { Provider as NextProvider } from 'next-auth/client';

import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextProvider>
  );
}

export default MyApp
