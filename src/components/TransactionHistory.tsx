'use client';

import { ArrowDownLeft, ArrowUpRight, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';

import { clientEnv } from '@/lib/env/client';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  isError: string;
}

export function TransactionHistory() {
  const { address, chain } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const [txError, setTxError] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch transaction history
  const fetchTransactions = useCallback(
    async (isManualRefresh = false) => {
      if (!address || !clientEnv.NEXT_PUBLIC_ETHERSCAN_API_KEY) {
        setTxLoading(false);
        if (!clientEnv.NEXT_PUBLIC_ETHERSCAN_API_KEY) {
          setTxError('Etherscan API key not configured');
        }
        return;
      }

      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setTxLoading(true);
      }
      setTxError('');

      try {
        const url = `/api/transactions?address=${address}&chainId=${chain?.id}&limit=10`;

        console.log('🔍 Fetching transactions via proxy');
        console.log('📍 Address:', address);
        console.log('⛓️  Chain ID:', chain?.id);

        const response = await fetch(url, { cache: 'no-store' });
        const data = await response.json();

        console.log('📊 Etherscan API response:', data);

        if (data.status === '1' && Array.isArray(data.result)) {
          console.log('✅ Found', data.result.length, 'transactions');
          setTransactions(data.result);
        } else {
          console.log('ℹ️  No transactions found.');
          setTransactions([]);

          if (data.status !== '1' && data.message && data.message !== 'No transactions found') {
            setTxError(`Etherscan API: ${data.message}`);
          }
        }
        setTxLoading(false);
        setIsRefreshing(false);
      } catch (error) {
        console.error('❌ Failed to fetch transactions:', error);
        setTxError('Failed to load transaction history');
        setTxLoading(false);
        setIsRefreshing(false);
      }
    },
    [address, chain?.id]
  );

  // Auto-fetch transactions on mount and when address/chain changes
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Auto-refresh transactions every 30 seconds
  useEffect(() => {
    if (!address || !clientEnv.NEXT_PUBLIC_ETHERSCAN_API_KEY) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing transactions...');
      fetchTransactions();
    }, 30000);

    return () => clearInterval(interval);
  }, [address, fetchTransactions]);

  return (
    <div className="bg-neutral shadow-lg rounded-lg p-6 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-inter font-bold uppercase tracking-wider text-sm text-base-content/70">
          Transaction History
        </h3>
        <button
          onClick={() => fetchTransactions(true)}
          disabled={isRefreshing || txLoading}
          className="text-xs font-inter text-accent hover:text-accent/80 underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          title="Refresh transactions"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </>
          )}
        </button>
      </div>

      {txLoading ? (
        <div className="bg-base-300 rounded-lg p-8 text-center">
          <div className="loading loading-spinner loading-lg text-primary mx-auto"></div>
          <p className="font-inter text-base-content/50 mt-4">Loading transactions...</p>
        </div>
      ) : txError ? (
        <div className="bg-base-300 rounded-lg p-8 text-center">
          <p className="font-inter text-error text-sm">{txError}</p>
          {txError.includes('API key') && (
            <p className="font-inter text-base-content/50 text-xs mt-2">
              Add your Etherscan API key to .env.local to view transaction history
            </p>
          )}
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-base-300 rounded-lg p-8 text-center">
          <p className="font-inter text-base-content/50">No transactions found for this address.</p>
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          {transactions.map((tx) => {
            const isSent = tx.from.toLowerCase() === address?.toLowerCase();
            const txValue = parseFloat(formatEther(BigInt(tx.value)));
            const date = new Date(parseInt(tx.timeStamp) * 1000);
            const explorerUrl =
              chain?.id === 1
                ? `https://etherscan.io/tx/${tx.hash}`
                : chain?.id === 11155111
                  ? `https://sepolia.etherscan.io/tx/${tx.hash}`
                  : `https://etherscan.io/tx/${tx.hash}`;

            const isMainnet = chain?.id === 1;
            const networkBadge = isMainnet ? (
              <span className="badge badge-primary badge-xs">Mainnet</span>
            ) : (
              <span className="badge badge-info badge-xs">Sepolia</span>
            );

            return (
              <div
                key={tx.hash}
                className={`p-3 hover:bg-base-200 transition-colors border-l-4 ${
                  isMainnet ? 'bg-base-300 border-primary' : 'bg-base-300/80 border-info'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className={`p-1.5 ${isSent ? 'bg-error/20' : 'bg-success/20'} flex-shrink-0`}>
                      {isSent ? (
                        <ArrowUpRight className="w-4 h-4 text-error" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4 text-success" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-inter font-bold text-xs">{isSent ? 'Sent' : 'Received'}</span>
                        {networkBadge}
                      </div>

                      <div className={`font-inter font-bold text-sm mb-1 ${isSent ? 'text-error' : 'text-success'}`}>
                        {isSent ? '-' : '+'}
                        {txValue.toFixed(4)} ETH
                      </div>

                      <div className="text-xs text-base-content/50 font-inter">
                        {date.toLocaleDateString()} {date.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80 transition-colors flex-shrink-0"
                    title="View on Etherscan"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
