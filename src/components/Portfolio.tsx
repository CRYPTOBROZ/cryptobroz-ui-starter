'use client';

import { Check, Copy, DollarSign, Euro, TrendingUp, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';

import { TransactionHistory } from './TransactionHistory';

export function Portfolio() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance, isLoading } = useBalance({
    address: address,
  });
  const [copied, setCopied] = useState(false);
  const [ethToEur, setEthToEur] = useState<number>(0);
  const [ethToUsd, setEthToUsd] = useState<number>(0);
  const [priceChange24h, setPriceChange24h] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch ETH price from API route
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('/api/prices');
        const data = await response.json();
        setEthToEur(data.ethereum.eur);
        setEthToUsd(data.ethereum.usd);
        setPriceChange24h(data.ethereum.usd_24h_change || 0);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch ETH price:', error);
        // Fallback to mock data if API fails
        setEthToEur(3250.5);
        setEthToUsd(3500.0);
        setPriceChange24h(2.5);
        setLoading(false);
      }
    };

    fetchPrice();
    // Refresh price every 30 seconds
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const ethBalance = balance ? parseFloat(formatEther(balance.value)) : 0;
  const balanceInUsd = (ethBalance * ethToUsd).toFixed(2);
  const balanceInEur = (ethBalance * ethToEur).toFixed(2);

  if (!isConnected) {
    return (
      <div className="bg-neutral shadow-lg rounded-lg max-w-4xl mx-auto p-8 text-center">
        <Wallet className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-inter font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-base-content/70 font-inter">Please connect your wallet to view your portfolio</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen relative">
      {/* Transaction History - Absolute positioned on right */}
      <div className="hidden lg:block absolute top-0 right-0 w-80 z-10">
        <TransactionHistory />
      </div>

      {/* Main Content */}
      <div className="space-y-6 pb-6 lg:pr-[21rem]">
        {/* Wallet Overview */}
        <div className="bg-neutral shadow-lg rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-inter font-bold uppercase tracking-wider bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Portfolio Overview {chain?.name && `- ${chain.name}`}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Balance Card */}
            <div className="bg-base-300 rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-6 h-6 text-accent" />
                <h3 className="font-inter font-bold uppercase tracking-wide text-sm text-base-content/70">
                  ETH Balance
                </h3>
              </div>
              {isLoading ? (
                <div className="text-2xl font-inter font-bold text-accent">Loading...</div>
              ) : (
                <div className="space-y-2">
                  <div className="text-4xl font-inter font-bold text-accent">
                    {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.0000'} ETH
                  </div>
                  <div className="text-sm font-inter text-base-content/50">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </div>
                </div>
              )}
            </div>

            {/* Network Info */}
            <div className="bg-base-300 rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="font-inter font-bold uppercase tracking-wide text-sm text-base-content/70">
                  Network Info
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-inter text-base-content/50 uppercase tracking-wide mb-1">Network</div>
                  <div className="text-lg font-inter font-bold">{chain?.name || 'Unknown'}</div>
                </div>
                <div>
                  <div className="text-xs font-inter text-base-content/50 uppercase tracking-wide mb-1">Chain ID</div>
                  <div className="text-lg font-inter font-bold">{chain?.id || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ETH Price Statistics */}
        <div className="bg-neutral shadow-lg rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-inter font-bold uppercase tracking-wider bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ETH Market Price
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* USD Price */}
            <div className="bg-base-300 rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-success" />
                <h3 className="font-inter font-bold uppercase tracking-wide text-sm text-base-content/70">USD Price</h3>
              </div>
              {loading ? (
                <div className="text-2xl font-inter font-bold text-success">Loading...</div>
              ) : (
                <div className="space-y-2">
                  <div className="text-4xl font-inter font-bold text-success">${ethToUsd.toFixed(2)}</div>
                  <div className="text-sm font-inter text-base-content/50">Your balance: ${balanceInUsd}</div>
                </div>
              )}
            </div>

            {/* EUR Price */}
            <div className="bg-base-300 rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <Euro className="w-6 h-6 text-accent" />
                <h3 className="font-inter font-bold uppercase tracking-wide text-sm text-base-content/70">EUR Price</h3>
              </div>
              {loading ? (
                <div className="text-2xl font-inter font-bold text-accent">Loading...</div>
              ) : (
                <div className="space-y-2">
                  <div className="text-4xl font-inter font-bold text-accent">€{ethToEur.toFixed(2)}</div>
                  <div className="text-sm font-inter text-base-content/50">Your balance: €{balanceInEur}</div>
                </div>
              )}
            </div>

            {/* 24h Change */}
            <div className="bg-base-300 rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className={`w-6 h-6 ${priceChange24h >= 0 ? 'text-success' : 'text-error'}`} />
                <h3 className="font-inter font-bold uppercase tracking-wide text-sm text-base-content/70">
                  24h Change
                </h3>
              </div>
              {loading ? (
                <div className="text-2xl font-inter font-bold">Loading...</div>
              ) : (
                <div className="space-y-2">
                  <div
                    className={`text-4xl font-inter font-bold ${priceChange24h >= 0 ? 'text-success' : 'text-error'}`}
                  >
                    {priceChange24h >= 0 ? '+' : ''}
                    {priceChange24h.toFixed(2)}%
                  </div>
                  <div className="text-sm font-inter text-base-content/50">Last 24 hours</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wallet Address */}
        <div className="bg-neutral shadow-lg rounded-lg p-6">
          <h3 className="font-inter font-bold uppercase tracking-wider text-sm text-base-content/70 mb-3">
            Wallet Address
          </h3>
          <div className="bg-base-300 rounded-lg p-4 font-mono text-sm flex items-center justify-between gap-3">
            <span className="break-all">{address}</span>
            <button
              onClick={copyAddress}
              className="text-base-content/50 hover:text-accent transition-colors flex-shrink-0"
              title={copied ? 'Copied!' : 'Copy address'}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Transaction History - Mobile */}
        <div className="lg:hidden mt-6">
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
}
