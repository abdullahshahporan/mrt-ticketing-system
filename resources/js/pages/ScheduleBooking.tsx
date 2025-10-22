import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from '../components/schedule/ScheduleBookingForm';
import { downloadTicketQRs } from '../services/TicketQRService';
import RouteVisualization from '../components/instant-booking/RouteVisualization';

interface Station {
  id: string;
  name: string;
  order: number;
}

const ScheduleBooking: React.FC = () => {
  // Handles the booking submission for schedule booking
  const handleBooking = async () => {
    if (!fromStation || !toStation || !quantity || !contactNumber || !bookingDate || !travelTime) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      const payload = {
        from_station: fromStation,
        to_station: toStation,
        quantity,
        contact_number: contactNumber,
        booking_date: bookingDate,
        travel_time: travelTime,
        total_fare: totalFare,
        travel_date: bookingDate
      };
      console.log('Booking payload:', payload);
      const response = await fetch('/api/schedule-booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log('Booking response:', data);
      if (data.success) {
        // Use new QR service for all tickets
        if (data.tickets && data.tickets.length > 0) {
          const qrData = data.tickets.map((ticketPNR: string) => ({
            ticketPNR,
            from: data.booking_details.from,
            to: data.booking_details.to,
            price: data.booking_details.base_fare,
            validity: `${data.booking_details.valid_from} - ${data.booking_details.valid_until}`
          }));
          await downloadTicketQRs(qrData);
        }
        // Navigate to confirmation page with base PNR (show base PNR, not just first ticket)
        navigate('/booking-confirmation', {
          state: {
            pnr: data.base_pnr || (data.tickets && data.tickets.length > 0 ? data.tickets[0] : undefined),
            message: 'Your schedule booking is confirmed. Please save your PNR for future reference.'
          }
        });
        setBookingResult(null); // Do not show QR on confirmation page
      } else {
        // Show full error details if available
        if (data.errors) {
          alert('Booking failed: ' + JSON.stringify(data.errors));
        } else {
          alert(data.message || 'Booking failed.');
        }
      }
    } catch (error) {
      alert('An error occurred while booking.');
      console.error('Booking error:', error);
    }
  };
  const navigate = useNavigate();
  const [fromStation, setFromStation] = useState<string>('');
  const [toStation, setToStation] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [contactNumber, setContactNumber] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [travelTime, setTravelTime] = useState<string>('');
  const [fare, setFare] = useState<number>(0);
  const [totalFare, setTotalFare] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [bookingResult, setBookingResult] = useState<any>(null);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch('/api/instant-booking/stations');
      const data = await response.json();
      if (data.success) {
        setStations(data.stations);
      }
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    }
  };

  useEffect(() => {
    if (fromStation && toStation && quantity > 0) {
      calculateFare();
    }
  }, [fromStation, toStation, quantity]);

  const calculateFare = async () => {
    if (!fromStation || !toStation) return;

    setIsCalculating(true);
    try {
      const response = await fetch('/api/schedule-booking/calculate-fare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          from_station: fromStation,
          to_station: toStation,
          quantity: quantity
        })
      });

      const data = await response.json();
      if (data.success) {
        setFare(data.base_fare);
        setTotalFare(data.total_fare);
      }
    } catch (error) {
      console.error('Failed to calculate fare:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Show QR download after booking */}
          {/* No QR or confirmation page shown after booking. Auto-download QR tickets instead. */}
          {(!bookingResult || !bookingResult.tickets) && (
            <div>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule For Later</h1>
                <p className="text-lg text-gray-600">Plan your journey in advance</p>
              </div>
              {/* Features Section */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Book up to 30 days ahead</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Choose specific time slots</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Email & SMS reminders</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Flexible cancellation</span>
                  </div>
                </div>
              </div>
              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Booking Form */}
                <BookingForm
                  fromStation={fromStation}
                  setFromStation={setFromStation}
                  toStation={toStation}
                  setToStation={setToStation}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  contactNumber={contactNumber}
                  setContactNumber={setContactNumber}
                  bookingDate={bookingDate}
                  setBookingDate={setBookingDate}
                  travelTime={travelTime}
                  setTravelTime={setTravelTime}
                  fare={fare}
                  totalFare={totalFare}
                  isCalculating={isCalculating}
                  onBook={handleBooking}
                  stations={stations}
                />

                {/* Right Side - Route Visualization */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Journey Route</h2>
                  <RouteVisualization fromStation={fromStation} toStation={toStation} />
                  {bookingDate && travelTime && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <h3 className="text-sm font-semibold text-green-800 mb-2">Scheduled Journey</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-semibold text-gray-900">
                            {new Date(bookingDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Time Window:</span>
                          <span className="font-semibold text-gray-900">
                            {(() => {
                              const [hours, minutes] = travelTime.split(':');
                              const startHour = parseInt(hours);
                              const endHour = (startHour + 1) % 24;
                              const formatTime = (h: number) => {
                                const period = h >= 12 ? 'PM' : 'AM';
                                const displayHour = h % 12 || 12;
                                return `${displayHour}:${minutes} ${period}`;
                              };
                              return `${formatTime(startHour)} - ${formatTime(endHour)}`;
                            })()}
                          </span>
                        </div>
                        <p className="text-xs text-green-700 mt-2">✓ Valid for 1 hour from selected time</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Info Banner */}
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Watch-Type Ticket Information</h3>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Select your preferred travel time between <strong>7:00 AM to 10:00 PM</strong></li>
                      <li>• Your ticket will be valid for <strong>1 hour</strong> from your selected time</li>
                      <li>• Example: Select 9:30 AM → Valid from 9:30 AM to 10:30 AM</li>
                      <li>• You will receive SMS and email confirmation with your PNR</li>
                      <li>• Each ticket in your booking gets a unique PNR (e.g., MRT123456789-1, MRT123456789-2)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleBooking;
