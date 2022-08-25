import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import {
  RainbowKitProvider,
  getDefaultWallets,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import {
  Chain,
  configureChains,
  createClient,
  WagmiConfig,
  chain,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Router from "next/router";
import NProgress from "nprogress"; //nprogress module
import "../styles/progressBar.css"; //styles of nprogress

const evmosTestChain: Chain = {
  id: 9000,
  name: "Evmos Testnet",
  network: "evmos testnet ",
  iconUrl: "https://assets.coingecko.com/coins/images/24023/large/evmos.png",
  nativeCurrency: {
    decimals: 18,
    name: "TEVMOS",
    symbol: "TEVMOS",
  },
  rpcUrls: {
    default: "https://eth.bd.evmos.dev:8545	",
  },
  blockExplorers: {
    default: { name: "EvmosDev", url: "https://evm.evmos.dev" },
  },
  testnet: true,
};

const evmosChain: Chain = {
  id: 9001,
  name: "Evmos",
  network: "evmos mainnet ",
  iconUrl: "https://assets.coingecko.com/coins/images/24023/large/evmos.png",
  nativeCurrency: {
    decimals: 18,
    name: "EVMOS",
    symbol: "EVMOS",
  },
  rpcUrls: {
    default: "https://eth.bd.evmos.org:8545	",
  },
  blockExplorers: {
    default: { name: "Evmos", url: "https://evm.evmos.org" },
  },
  testnet: false,
};

const { chains, provider, webSocketProvider } = configureChains(
  [evmosChain, evmosTestChain, chain.goerli],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Bountyscape",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div data-theme="bumblebee">
      <Head>
        <title>Bountyscape</title>
        <meta name="description" content="Bountyscape" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={lightTheme({
            accentColor: "#E0A82E",
            accentColorForeground: "white",
            fontStack: "system",
          })}
        >
          <Navbar />
          <Component {...pageProps} />
          {/* <Footer/> */}
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default MyApp;
