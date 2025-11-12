import {
  ArrowRight,
  Bitcoin,
  CircleDollarSign,
  Coins,
  Globe,
  History,
  Shield,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: Wallet,
      label: 'Web3 Wallet Integration',
      description: 'Connect your MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet instantly',
      color: 'text-primary',
    },
    {
      icon: TrendingUp,
      label: 'Real-Time Prices',
      description: 'Live ETH/USD and ETH/EUR conversion rates updated every 30 seconds via CoinGecko API',
      color: 'text-accent',
    },
    {
      icon: History,
      label: 'Transaction History',
      description: 'View your complete transaction history for Mainnet and Sepolia testnet via Etherscan',
      color: 'text-info',
    },
    {
      icon: CircleDollarSign,
      label: 'Send ETH',
      description: 'Kraken-style trading interface with form validation, quick amount buttons, and network warnings',
      color: 'text-success',
    },
    {
      icon: Shield,
      label: 'Secure & Safe',
      description: 'Built with TypeScript, validated inputs, CSP headers, and testnet-first approach',
      color: 'text-warning',
    },
    {
      icon: Globe,
      label: 'Multi-Chain Support',
      description: 'Works with Ethereum Mainnet and Sepolia testnet - easily add more networks',
      color: 'text-secondary',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start py-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="text-center space-y-4 px-4">
        <img src="/logo.png" alt="CryptoBroz" className="w-full max-w-xl mx-auto mt-10 mb-20" />

        <p className="text-base md:text-lg font-inter text-base-content/70 max-w-2xl mx-auto">
          A crypto platform with wallet integration, real-time price tracking, and transaction management
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/send"
          className="relative h-14 px-8 font-inter font-bold uppercase tracking-wider text-base overflow-hidden rounded-lg transition-all group inline-flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-accent opacity-100 group-hover:opacity-90 transition-opacity"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-accent via-purple-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 text-white drop-shadow-lg">Send ETH Now</span>
        </Link>
        <Link
          href="/portfolio"
          className="relative h-14 px-8 font-inter font-bold uppercase tracking-wider text-base overflow-hidden rounded-lg transition-all group inline-flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 group-hover:from-primary/40 group-hover:to-accent/40 transition-all"></div>
          <span className="relative z-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            View Portfolio
          </span>
        </Link>
      </div>

      {/* Features Grid */}
      <div className="w-full px-4">
        <h2 className="text-xl md:text-2xl font-inter font-bold text-center mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          What Can You Do?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.label}
                className="bg-neutral rounded-lg p-4 shadow-lg hover:shadow-xl transition-all group border-l-4 border-transparent hover:border-primary"
              >
                <div className="flex items-start gap-3">
                  <div className="transition-transform group-hover:scale-110">
                    <Icon className={`w-8 h-8 ${feature.color}`} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-inter font-bold text-sm mb-1">{feature.label}</h3>
                    <p className="text-xs font-inter text-base-content/70 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="w-full px-4 pb-8">
        <div className="bg-neutral rounded-lg p-6 shadow-lg">
          <h2 className="text-xl md:text-2xl font-inter font-bold text-center mb-4 text-white">Getting Started</h2>

          <div className="space-y-4 font-inter text-base-content/80">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-bold text-base mb-1">Connect Your Wallet</h3>
                <p className="text-sm leading-relaxed">
                  Click the <span className="text-accent font-semibold">"Connect Wallet"</span> button in the top right
                  corner. Choose from MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 bg-accent text-neutral rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-bold text-base mb-1">Get Testnet ETH</h3>
                <p className="text-sm leading-relaxed mb-2">
                  Before using the app, we recommend switching to{' '}
                  <span className="text-info font-semibold">Sepolia Testnet</span> to test safely. Get free testnet ETH
                  from Google Cloud's faucet:
                </p>
                <a
                  href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm font-semibold"
                >
                  Get Sepolia ETH <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-xs text-base-content/60 mt-1">
                  Note: Testnet tokens have no real value and are for testing purposes only.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 bg-success text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-bold text-base mb-1">Explore the App</h3>
                <p className="text-sm leading-relaxed">
                  View your <span className="text-primary font-semibold">Portfolio</span> to see balances, prices, and
                  transaction history. Use the <span className="text-success font-semibold">Send ETH</span> page to
                  transfer funds with real-time price conversion.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-warning/10 border border-warning/30 rounded-lg">
            <p className="text-sm font-inter text-center">
              <span className="font-bold text-warning">⚠️ Important:</span> Always test on Sepolia testnet before using
              Mainnet with real ETH!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
