import React, { useEffect, useState } from 'react';

const ScheduleBookingList: React.FC = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple fetch, like SQL SELECT * FROM schedule_bookings
    fetch('/api/admin/schedule-bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10">Loading schedule bookings...</div>;

  return (
  <div className="bg-white rounded-xl shadow p-6" style={{ marginTop: '8px' }}>
      <h2 className="text-xl font-bold mb-4 text-green-700">Schedule Booking List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border">
          <thead>
            <tr className="bg-green-50">
              <th className="py-1 px-2">ID</th>
              <th className="py-1 px-2">PNR</th>
              <th className="py-1 px-2">From</th>
              <th className="py-1 px-2">To</th>
              <th className="py-1 px-2">Qty</th>
              <th className="py-1 px-2">Travel Date</th>
              <th className="py-1 px-2">Status</th>
              <th className="py-1 px-2">Booking Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-4 text-center text-gray-500">Loading schedule bookings...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-4 text-center text-gray-500">No schedule bookings found.</td>
              </tr>
            ) : (
              bookings.map((b: any) => (
                <tr key={b.id} className="border-t">
                  <td className="py-1 px-2">{b.id}</td>
                  <td className="py-1 px-2">{b.pnr}</td>
                  <td className="py-1 px-2">{b.from_station}</td>
                  <td className="py-1 px-2">{b.to_station}</td>
                  <td className="py-1 px-2">{b.quantity}</td>
                  <td className="py-1 px-2">{b.travel_date}</td>
                  <td className="py-1 px-2">{b.status}</td>
                  <td className="py-1 px-2">{b.booking_time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleBookingList;
