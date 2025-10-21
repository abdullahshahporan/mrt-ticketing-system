import React, { useEffect, useState } from 'react';

const InstantBookingList: React.FC = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simple fetch, like SQL SELECT * FROM instant_bookings
		fetch('/api/admin/instant-bookings')
			.then(res => res.json())
			.then(data => {
				setBookings(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, []);

	return (
		<div className="bg-white rounded shadow p-2 w-full mx-auto" style={{ minHeight: '60vh', maxWidth: '100%', margin: '12px 0' }}>
			<h2 className="text-lg font-bold mb-2 text-blue-700">Instant Booking List</h2>
			{loading ? (
				<div className="text-center py-6">Loading instant bookings...</div>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full text-left border">
									<thead>
										<tr className="bg-blue-50">
											<th className="py-1 px-2">ID</th>
											<th className="py-1 px-2">PNR</th>
											<th className="py-1 px-2">From</th>
											<th className="py-1 px-2">To</th>
											<th className="py-1 px-2">Qty</th>
											<th className="py-1 px-2">Status</th>
											<th className="py-1 px-2">Booking Time</th>
										</tr>
									</thead>
									<tbody>
										{bookings.length === 0 ? (
											<tr>
												<td colSpan={7} className="py-4 text-center text-gray-500">No instant bookings found.</td>
											</tr>
										) : (
											bookings.map((b: any) => (
												<tr key={b.id} className="border-t">
													<td className="py-1 px-2">{b.id}</td>
													<td className="py-1 px-2">{b.pnr}</td>
													<td className="py-1 px-2">{b.from_station}</td>
													<td className="py-1 px-2">{b.to_station}</td>
													<td className="py-1 px-2">{b.quantity}</td>
													<td className="py-1 px-2">{b.status}</td>
													<td className="py-1 px-2">{b.booking_time}</td>
												</tr>
											))
										)}
									</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default InstantBookingList;
