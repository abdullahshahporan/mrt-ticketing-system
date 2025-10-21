import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { debugLog } from '../utils/debugHelper';

interface Transaction {
  id: number | string;
  virtual_card_id: number;
  type: string;
  amount: number;
  payment_method: string | null;
  transaction_id: string | null;
  status: string | null;
  description: string | null;
  from_station: string | null;
  to_station: string | null;
  created_at: string | null;
}

const VirtualCardTransactions: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        // ensure auth middleware initialized
        await AuthMiddleware.init();
        const user = AuthMiddleware.getCurrentUser();
        if (!user || !user.email) {
          navigate('/signin');
          return;
        }

        const email = user.email;
        debugLog('Transactions', `Fetching transactions for ${email}`);

        const resp = await fetch(`/api/virtual-card/transactions?email=${encodeURIComponent(email)}`, {
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
          }
        });

        if (!resp.ok) throw new Error('Failed to fetch transactions');
        const data = await resp.json();
        if (!data.success) throw new Error(data.message || 'No transactions');

  setResult(data);
      } catch (err: any) {
        console.error('Transactions load error:', err);
        setError(err.message || 'Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [navigate]);

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }
  if (error) {
    return <div style={{ padding: 40, color: 'red', textAlign: 'center' }}>{error}</div>;
  }
  return (
    <div style={{ padding: 40 }}>
      <h2>Transaction API Raw Result</h2>
      <pre style={{ background: '#f8f8f8', padding: 20, borderRadius: 8, textAlign: 'left' }}>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};

export default VirtualCardTransactions;
