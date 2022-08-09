import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Navbar from '../components/navbar';

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
  ],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC',
    }),
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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
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
