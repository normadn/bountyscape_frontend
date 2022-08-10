import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { Chain, configureChains, createClient, WagmiConfig, chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import Navbar from '../components/navbar';
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import '../styles/progressBar.css'; //styles of nprogress

const evmosTestChain: Chain = {
  id: 9000,
  name: 'Evmos Testnet',
  network: 'evmos testnet ',
  nativeCurrency: {
    decimals: 18,
    name: 'TEVMOS',
    symbol: 'TEVMOS',
  },
  rpcUrls: {
    default: 'https://eth.bd.evmos.dev:8545	',
  },
  blockExplorers: {
    default: { name: 'EvmosDev', url: 'https://evm.evmos.dev' },
  },
  testnet: true,
}

const { chains, provider, webSocketProvider } = configureChains(
  [
    evmosTestChain,
    chain.goerli,
  ],
  [
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Bountyscape',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());  


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div data-theme="bumblebee">
      <Head>
        <title>Bountyscape</title>
        <meta
          name="description"
          content="Bountyscape"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Navbar/>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
    
  );
}

export default MyApp;
