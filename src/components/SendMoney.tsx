'use client';

import { AlertCircle, CheckCircle, ExternalLink, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatEther, parseEther } from 'viem';
import { useAccount, useBalance, useSendTransaction } from 'wagmi';

import { TransactionHistory } from './TransactionHistory';

export function SendMoney() {
  const { address, isConnected, chain } = useAccount();
  const { sendTransaction, isPending, isSuccess, data: txHash } = useSendTransaction();
  const { data: balance } = useBalance({ address });
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [ethToEur, setEthToEur] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ recipient: '', amount: '' });

  // Fetch ETH price from API route
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('/api/prices');
        const data = await response.json();
        setEthToEur(data.ethereum.eur);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch ETH price:', error);
        // Fallback to mock data if API fails
        setEthToEur(3250.5);
        setLoading(false);
      }
    };

    fetchPrice();
    // Refresh price every 30 seconds
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const eurValue = amount ? (parseFloat(amount) * ethToEur).toFixed(2) : '0.00';
  const availableBalance = balance ? parseFloat(formatEther(balance.value)) : 0;

  const isMainnet = chain?.id === 1;

  const setQuickAmount = (percentage: number) => {
    if (balance) {
      const value = availableBalance * (percentage / 100);
      setAmount(value.toFixed(6));
      validateAmount(value.toString());
    }
  };

  const validateRecipient = (value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, recipient: 'Recipient address is required' }));
      return false;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
      setErrors((prev) => ({ ...prev, recipient: 'Invalid Ethereum address' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, recipient: '' }));
    return true;
  };

  const validateAmount = (value: string) => {
    if (!value || parseFloat(value) <= 0) {
      setErrors((prev) => ({ ...prev, amount: 'Amount must be greater than 0' }));
      return false;
    }
    if (parseFloat(value) > availableBalance) {
      setErrors((prev) => ({ ...prev, amount: 'Insufficient balance' }));
      return false;
    }
    if (parseFloat(value) < 0.000001) {
      setErrors((prev) => ({ ...prev, amount: 'Amount too small (min: 0.000001 ETH)' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, amount: '' }));
    return true;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    const isRecipientValid = validateRecipient(recipient);
    const isAmountValid = validateAmount(amount);

    if (!isRecipientValid || !isAmountValid) return;

    sendTransaction({
      to: recipient as `0x${string}`,
      value: parseEther(amount),
    });
  };

  const isFormValid = recipient && amount && !errors.recipient && !errors.amount;

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

      {/* Send Form */}
      <div className="pb-6 lg:pr-[21rem]">
        <div className="bg-neutral shadow-lg rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <h2 className="text-xl font-inter font-bold uppercase tracking-wider bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Send ETH {chain?.name && `- ${chain.name}`}
            </h2>
            {isMainnet && (
              <div className="badge badge-error badge-lg font-inter font-bold uppercase tracking-wide shadow-sm h-10 flex items-center">
                Mainnet Warning
              </div>
            )}
          </div>

          {isMainnet && (
            <div className="bg-error/20 border border-error/50 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold font-inter text-sm text-error">Mainnet Detected</div>
                <div className="text-xs font-inter text-base-content/70">
                  You are connected to Ethereum Mainnet. Please switch to a testnet (Sepolia) for safe testing. Real ETH
                  will be used on Mainnet!
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-8">
            {/* Recipient Address */}
            <div className="space-y-3">
              <label className="block">
                <span className="font-inter font-bold uppercase tracking-wider text-xs text-base-content/70 mb-3 block">
                  Recipient Address
                </span>
                <input
                  type="text"
                  placeholder="0x..."
                  className={`input input-bordered font-inter bg-base-300 w-full input-smart text-base px-4 py-3 h-14 ${
                    errors.recipient ? 'input-error border-error' : ''
                  }`}
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    if (e.target.value) validateRecipient(e.target.value);
                  }}
                  onBlur={() => recipient && validateRecipient(recipient)}
                  autoFocus
                  required
                />
                {errors.recipient && (
                  <span className="text-error text-xs font-inter mt-1 block">{errors.recipient}</span>
                )}
              </label>
            </div>

            {/* Amount Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <span className="font-inter font-bold uppercase tracking-wider text-xs text-base-content/70">
                  Amount
                </span>
                <span className="font-inter text-xs text-base-content/50">
                  Available: {availableBalance.toFixed(6)} ETH
                </span>
              </div>

              {/* Amount Input with EUR Display */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="0.00"
                  className={`input input-bordered font-inter bg-base-300 w-full text-2xl font-bold px-4 py-3 h-16 ${
                    errors.amount ? 'input-error border-error' : ''
                  }`}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (e.target.value) validateAmount(e.target.value);
                  }}
                  onBlur={() => amount && validateAmount(amount)}
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-right pointer-events-none">
                  <div className="font-inter text-sm font-bold text-base-content">ETH</div>
                  <div className="font-inter text-xs text-accent">≈ €{eurValue}</div>
                </div>
              </div>
              {errors.amount && <span className="text-error text-xs font-inter block">{errors.amount}</span>}

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => setAmount('0.001')}
                  className="relative h-10 font-inter text-xs font-semibold uppercase tracking-wider overflow-hidden rounded-lg transition-all group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 group-hover:from-primary/40 group-hover:to-accent/40 transition-all"></div>
                  <span className="relative z-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Min
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAmount(25)}
                  className="relative h-10 font-inter text-xs font-semibold uppercase tracking-wider overflow-hidden rounded-lg transition-all group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 group-hover:from-primary/40 group-hover:to-accent/40 transition-all"></div>
                  <span className="relative z-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    25%
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAmount(50)}
                  className="relative h-10 font-inter text-xs font-semibold uppercase tracking-wider overflow-hidden rounded-lg transition-all group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 group-hover:from-primary/40 group-hover:to-accent/40 transition-all"></div>
                  <span className="relative z-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    50%
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAmount(75)}
                  className="relative h-10 font-inter text-xs font-semibold uppercase tracking-wider overflow-hidden rounded-lg transition-all group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 group-hover:from-primary/40 group-hover:to-accent/40 transition-all"></div>
                  <span className="relative z-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    75%
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAmount(100)}
                  className="relative h-10 font-inter text-xs font-semibold uppercase tracking-wider overflow-hidden rounded-lg transition-all group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 group-hover:from-primary/40 group-hover:to-accent/40 transition-all"></div>
                  <span className="relative z-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Max
                  </span>
                </button>
              </div>

              {/* Transaction Summary */}
              <div className="bg-base-300 rounded-lg p-4 space-y-2">
                <div className="flex justify-between font-inter text-sm">
                  <span className="text-base-content/70">You Send</span>
                  <span className="font-bold">{amount || '0.00'} ETH</span>
                </div>
                <div className="flex justify-between font-inter text-sm">
                  <span className="text-base-content/70">Value in EUR</span>
                  <span className="font-bold text-accent">€{eurValue}</span>
                </div>
                <div className="border-t border-base-content/10 my-2"></div>
                <div className="flex justify-between font-inter text-xs text-base-content/50">
                  <span>Exchange Rate</span>
                  <span>1 ETH = €{ethToEur.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="relative w-full h-16 font-inter font-bold uppercase tracking-wider text-lg overflow-hidden rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                disabled={isPending || !isFormValid || loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-accent opacity-100 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-accent via-purple-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 text-white drop-shadow-lg">
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      Processing Transaction...
                    </span>
                  ) : (
                    <span>
                      Send {amount || '0.00'} ETH {amount && `(€${eurValue})`}
                    </span>
                  )}
                </span>
              </button>
              {!isFormValid && (recipient || amount) && (
                <p className="text-xs text-base-content/50 text-center mt-2 font-inter">
                  Please fix the errors above to continue
                </p>
              )}
            </div>

            {isSuccess && txHash && (
              <div className="bg-success/20 border border-success/50 rounded-lg p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-inter font-bold text-sm text-success">Transaction sent successfully!</span>
                </div>

                <div className="space-y-2 text-sm font-inter">
                  <div className="flex items-center gap-2">
                    <span className="text-base-content/70">Transaction Hash:</span>
                    <a
                      href={`${
                        chain?.id === 1
                          ? 'https://etherscan.io'
                          : chain?.id === 11155111
                            ? 'https://sepolia.etherscan.io'
                            : 'https://etherscan.io'
                      }/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 transition-colors flex items-center gap-1 font-mono text-xs"
                    >
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="text-base-content/70">
                    Track your transaction in the{' '}
                    <Link href="/portfolio" className="text-accent hover:text-accent/80 transition-colors font-bold">
                      Portfolio
                    </Link>{' '}
                    page or view it on Etherscan above.
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Transaction History - Mobile */}
        <div className="lg:hidden mt-6">
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
}
