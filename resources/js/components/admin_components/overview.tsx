
import React from 'react';

const Overview = () => {
  const [stats, setStats] = React.useState({
    one_time_ticket: {
      ticket_sold_today: 0,
      total_ticket_sold: 0,
      total_income: 0
    },
    virtual_card: {
      total_card_holder: 0,
      total_income: 0,
      block_money: 0
    }
  });

  React.useEffect(() => {
    fetch('/admin/overview-stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
      })
      .catch(() => {
        // Optionally handle error
      });
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-full py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-[80vh]">
      <div className="flex flex-col gap-12 w-full max-w-3xl">
        {/* One Time Ticket Info */}
        <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center border-t-4 border-blue-400 transition hover:scale-[1.03]">
          <h2 className="text-2xl font-extrabold text-blue-700 mb-8 tracking-wide flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2m-6 0h6" /></svg>
            One Time Ticket Info
          </h2>
          <div className="flex flex-row gap-6 w-full justify-center">
            <div className="flex flex-col items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-6 shadow min-w-[140px]">
              <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zm0 0v6m0-6a2 2 0 012-2h2a2 2 0 012 2v6" /></svg>
              <div className="text-3xl font-bold text-blue-700">{stats.one_time_ticket.ticket_sold_today}</div>
              <div className="text-base text-blue-600 font-semibold">Ticket Sold Today</div>
            </div>
            <div className="flex flex-col items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-6 shadow min-w-[140px]">
              <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z" /></svg>
              <div className="text-3xl font-bold text-blue-700">{stats.one_time_ticket.total_ticket_sold}</div>
              <div className="text-base text-blue-600 font-semibold">Total Ticket Sold</div>
            </div>
            <div className="flex flex-col items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-6 shadow min-w-[140px]">
              <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 12v4" /></svg>
              <div className="text-3xl font-bold text-blue-700">৳ {stats.one_time_ticket.total_income.toLocaleString()}</div>
              <div className="text-base text-blue-600 font-semibold">Total Income</div>
            </div>
          </div>
        </div>
        {/* Virtual Card Info */}
        <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center border-t-4 border-green-400 transition hover:scale-[1.03]">
          <h2 className="text-2xl font-extrabold text-green-700 mb-8 tracking-wide flex items-center gap-2">
            <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z" /></svg>
            MRT Virtual Card Info
          </h2>
          <div className="flex flex-row gap-6 w-full justify-center">
            <div className="flex flex-col items-center gap-2 bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-6 shadow min-w-[140px]">
              <svg className="w-8 h-8 text-green-700 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zm0 0v6m0-6a2 2 0 012-2h2a2 2 0 012 2v6" /></svg>
              <div className="text-3xl font-bold text-green-700">{stats.virtual_card.total_card_holder}</div>
              <div className="text-base text-green-700 font-semibold">Total Card Holder</div>
            </div>
            <div className="flex flex-col items-center gap-2 bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-6 shadow min-w-[140px]">
              <svg className="w-8 h-8 text-green-700 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 12v4" /></svg>
              <div className="text-3xl font-bold text-green-700">৳ {stats.virtual_card.total_income.toLocaleString()}</div>
              <div className="text-base text-green-700 font-semibold">Total Income</div>
            </div>
            <div className="flex flex-col items-center gap-2 bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-6 shadow min-w-[140px]">
              <svg className="w-8 h-8 text-green-700 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z" /></svg>
              <div className="text-3xl font-bold text-green-700">৳ {stats.virtual_card.block_money.toLocaleString()}</div>
              <div className="text-base text-green-700 font-semibold">Block Money</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
