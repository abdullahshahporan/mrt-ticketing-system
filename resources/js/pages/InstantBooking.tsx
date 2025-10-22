import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketQR from '../components/TicketQR';
import { downloadTicketQRs, downloadTicketQRsFromBase } from '../services/TicketQRService';
import BookingForm from '../components/instant-booking/BookingForm';
import RouteVisualization from '../components/instant-booking/RouteVisualization';
import { Station } from '../types/booking';

const InstantBooking: React.FC = () => {
  const [fromStation, setFromStation] = useState<string>('');
  const [toStation, setToStation] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [totalFare, setTotalFare] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showPNRNotification, setShowPNRNotification] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [autoDownload, setAutoDownload] = useState(false);
  const ticketRef = useRef<any>(null);
  const [ticketBlob, setTicketBlob] = useState<Blob | null>(null);
  const navigate = useNavigate();

  // When ticketData appears, try to pre-generate PDF blob (so download can be synchronous)
  useEffect(() => {
    let mounted = true;
    const makeBlob = async () => {
      if (!ticketData) return;
      try {
        // small delay to ensure hidden DOM has rendered (increase slightly)
        await new Promise((r) => setTimeout(r, 500));
        if (ticketRef.current && typeof ticketRef.current.generatePDFBlob === 'function') {
          const blob = await ticketRef.current.generatePDFBlob();
          console.debug('InstantBooking: pre-generated blob', blob);
          if (mounted) setTicketBlob(blob);
        }
      } catch (e) {
        console.error('Pre-generate PDF blob failed', e);
      }
    };
    makeBlob();
    return () => { mounted = false; };
  }, [ticketData]);

  // Calculate fare when from, to, or quantity changes
  useEffect(() => {
    if (fromStation && toStation && fromStation !== toStation) {
      calculateFare();
    } else {
      setTotalFare(0);
    }
  }, [fromStation, toStation, quantity]);

  const calculateFare = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/instant-booking/calculate-fare', {
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
        setTotalFare(data.total_fare);
      }
    } catch (error) {
      console.error('Fare calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleBookTicket = async () => {
    if (!fromStation || !toStation || quantity < 1) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('/api/instant-booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          from_station: fromStation,
          to_station: toStation,
          quantity: quantity,
          total_fare: totalFare
        })
      });

      const data = await response.json();
      if (data.success) {
        // Always use the tickets array if present for QR generation
        if (Array.isArray(data.tickets) && data.tickets.length > 0) {
          // Generate a QR for each ticket PNR
          const qrData = data.tickets.map((pnr: string, idx: number) => ({
            ticketPNR: pnr,
            from: data.from_station || fromStation,
            to: data.to_station || toStation,
            price: data.price || totalFare,
            validity: data.validity || 'Valid for 1 hour'
          }));
          await downloadTicketQRs(qrData);
        } else if (data.base_pnr && (data.quantity && data.quantity > 1)) {
          // fallback: use basePNR and quantity if tickets array missing
          await downloadTicketQRsFromBase(
            data.base_pnr,
            data.quantity,
            data.from_station || fromStation,
            data.to_station || toStation,
            data.price || totalFare,
            data.validity || 'Valid for 1 hour'
          );
        } else if (data.pnr) {
          await downloadTicketQRs([
            {
              ticketPNR: data.pnr,
              from: data.from_station || fromStation,
              to: data.to_station || toStation,
              price: data.price || totalFare,
              validity: data.validity || 'Valid for 1 hour'
            }
          ]);
        }
        // Navigate to confirmation page with PNR
        navigate('/booking-confirmation', {
          state: {
            pnr: data.pnr,
            message: 'Your ticket has been booked successfully. Please save your PNR for future reference.'
          }
        });
      } else {
        alert('Booking failed: ' + data.message);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  return (
  // removed duplicate return
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Instant Booking
            </h1>
            <p className="text-lg text-gray-600">
              Book your ticket now and travel within the next hour
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Booking Form */}
            <BookingForm
              fromStation={fromStation}
              toStation={toStation}
              quantity={quantity}
              totalFare={totalFare}
              isCalculating={isCalculating}
              onFromStationChange={setFromStation}
              onToStationChange={setToStation}
              onQuantityChange={setQuantity}
              onBookTicket={handleBookTicket}
            />

            {/* Right Side - Route Visualization */}
            <RouteVisualization
              fromStation={fromStation}
              toStation={toStation}
            />
          </div>
        </div>
      </div>
    );
};

export default InstantBooking;