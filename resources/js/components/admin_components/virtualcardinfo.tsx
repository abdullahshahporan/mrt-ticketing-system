import React, { useEffect, useState } from 'react';

const VirtualCardInfo: React.FC = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple fetch, like SQL SELECT * FROM virtual_cards
    fetch('/api/admin/virtual-cards')
      .then(res => res.json())
      .then(data => {
        setCards(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full mx-auto" style={{ minHeight: '60vh', maxWidth: '100%', marginTop: '8px' }}>
      <h2 className="text-xl font-bold mb-4 text-green-700">Virtual Card List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border">
          <thead>
            <tr className="bg-green-50">
              <th className="py-1 px-2">Sl. No.</th>
              <th className="py-1 px-2">Card Number</th>
              <th className="py-1 px-2">Name</th>
              <th className="py-1 px-2">NID</th>
              <th className="py-1 px-2">Contact No.</th>
              <th className="py-1 px-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">Loading virtual cards...</td>
              </tr>
            ) : cards.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">No virtual cards found.</td>
              </tr>
            ) : (
              cards.map((c: any, idx: number) => (
                <tr key={c.id} className="border-t">
                  <td className="py-1 px-2">{idx + 1}</td>
                  <td className="py-1 px-2">{c.card_number}</td>
                  <td className="py-1 px-2">{c.name}</td>
                  <td className="py-1 px-2">{c.nid_no}</td>
                  <td className="py-1 px-2">{c.contact_no}</td>
                  <td className="py-1 px-2">{c.balance}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VirtualCardInfo;
