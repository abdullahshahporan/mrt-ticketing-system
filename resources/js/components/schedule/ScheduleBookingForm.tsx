import React, { useState } from 'react';
import { Button } from '@ui/button';

interface Station {
  id: string;
  name: string;
  order: number;
}

interface ScheduleBookingFormProps {
  fromStation: string;
  setFromStation: (value: string) => void;
  toStation: string;
  setToStation: (value: string) => void;
  quantity: number;
  setQuantity: (value: number) => void;
  contactNumber: string;
  setContactNumber: (value: string) => void;
  bookingDate: string;
  setBookingDate: (value: string) => void;
  travelTime: string;
  setTravelTime: (value: string) => void;
  fare: number;
  totalFare: number;
  isCalculating: boolean;
  onBook: () => void;
  stations: Station[];
}

const ScheduleBookingForm: React.FC<ScheduleBookingFormProps> = ({
  fromStation,
  setFromStation,
  toStation,
  setToStation,
  quantity,
  setQuantity,
  contactNumber,
  setContactNumber,
  bookingDate,
  setBookingDate,
  travelTime,
  setTravelTime,
  fare,
  totalFare,
  isCalculating,
  onBook,
  stations
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [hour, setHour] = useState<number>(9);
  const [minute, setMinute] = useState<number>(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  // Get minimum date (today) and maximum date (30 days from now)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const isFormValid = fromStation && toStation && quantity > 0 && contactNumber && bookingDate && travelTime && totalFare > 0;

  const formatContactNumber = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 11 digits
    return digits.substring(0, 11);
  };

  const formatTimeDisplay = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const applyTime = () => {
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) {
      hour24 = hour + 12;
    } else if (period === 'AM' && hour === 12) {
      hour24 = 0;
    }

    // Validate time is between 7 AM and 10 PM
    if (hour24 < 7 || hour24 > 22) {
      alert('Please select a time between 7:00 AM and 10:00 PM');
      return;
    }

    const timeString = `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    setTravelTime(timeString);
    setShowTimePicker(false);
  };

  const incrementHour = () => {
    setHour(prev => prev === 12 ? 1 : prev + 1);
  };

  const decrementHour = () => {
    setHour(prev => prev === 1 ? 12 : prev - 1);
  };

  const incrementMinute = () => {
    setMinute(prev => prev === 59 ? 0 : prev + 1);
  };

  const decrementMinute = () => {
    setMinute(prev => prev === 0 ? 59 : prev - 1);
  };

  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatContactNumber(e.target.value);
    setContactNumber(formatted);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Schedule Your Journey</h2>

      <div className="space-y-6">
        {/* From Station */}
        <div>
          <label htmlFor="from" className="block text-sm font-semibold text-gray-700 mb-2">
            From Station *
          </label>
          <select
            id="from"
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select departure station</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id} disabled={station.id === toStation}>
                {station.name}
              </option>
            ))}
          </select>
        </div>

        {/* To Station */}
        <div>
          <label htmlFor="to" className="block text-sm font-semibold text-gray-700 mb-2">
            To Station *
          </label>
          <select
            id="to"
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select destination station</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id} disabled={station.id === fromStation}>
                {station.name}
              </option>
            ))}
          </select>
        </div>

        {/* Booking Date */}
        <div>
          <label htmlFor="bookingDate" className="block text-sm font-semibold text-gray-700 mb-2">
            Journey Date *
          </label>
          <input
            type="date"
            id="bookingDate"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            min={minDate}
            max={maxDate}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">You can book up to 30 days in advance</p>
        </div>

        {/* Travel Time Picker */}
        <div>
          <label htmlFor="travelTime" className="block text-sm font-semibold text-gray-700 mb-2">
            Select Travel Time *
          </label>
          <div
            onClick={() => setShowTimePicker(!showTimePicker)}
            className="w-full px-4 py-3 text-left text-lg font-medium border-2 border-green-500 rounded-lg bg-white hover:bg-green-50 focus:ring-2 focus:ring-green-500 cursor-pointer transition-all flex items-center justify-between"
          >
            <span className={travelTime ? 'text-gray-900' : 'text-gray-400'}>
              {travelTime ? formatTimeDisplay(travelTime) : 'Select time'}
            </span>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Inline Time Picker */}
          {showTimePicker && (
            <div className="mt-2 p-4 bg-white border-2 border-green-500 rounded-lg shadow-lg">
              <div className="text-center mb-3">
                <p className="text-sm font-semibold text-gray-700">ENTER TIME</p>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                {/* Hour Picker */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={incrementHour}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={String(hour).padStart(2, '0')}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      if (val >= 1 && val <= 12) setHour(val);
                    }}
                    className="w-16 h-16 text-3xl font-bold text-center border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={decrementHour}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <p className="text-xs text-gray-500 mt-1">Hour</p>
                </div>

                {/* Colon Separator */}
                <div className="text-3xl font-bold text-gray-700 mb-6">:</div>

                {/* Minute Picker */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={incrementMinute}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={String(minute).padStart(2, '0')}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      if (val >= 0 && val <= 59) setMinute(val);
                    }}
                    className="w-16 h-16 text-3xl font-bold text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={decrementMinute}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <p className="text-xs text-gray-500 mt-1">Minute</p>
                </div>

                {/* AM/PM Toggle */}
                <div className="flex flex-col space-y-2 ml-3">
                  <button
                    type="button"
                    onClick={() => setPeriod('AM')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all ${
                      period === 'AM'
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setPeriod('PM')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all ${
                      period === 'PM'
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowTimePicker(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowTimePicker(false)}
                    className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    onClick={applyTime}
                    className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-xs text-blue-800">
                <p className="font-semibold mb-1">Select time between 7:00 AM to 10:00 PM</p>
                <p>Your ticket will be valid for <strong>1 hour</strong> from selected time</p>
                {travelTime && (
                  <p className="mt-1 text-green-700 font-medium">
                    ✓ Valid: {(() => {
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
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Tickets *
          </label>
          <select
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Ticket' : 'Tickets'}
              </option>
            ))}
          </select>
        </div>

        {/* Contact Number */}
        <div>
          <label htmlFor="contactNumber" className="block text-sm font-semibold text-gray-700 mb-2">
            Contact Number *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-500">+880</span>
            <input
              type="tel"
              id="contactNumber"
              value={contactNumber}
              onChange={handleContactNumberChange}
              placeholder="1712345678"
              maxLength={11}
              className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">We'll send booking confirmation to this number</p>
        </div>

        {/* Fare Display */}
        {totalFare > 0 && (
          <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Base Fare (per ticket):</span>
                <span className="font-semibold text-gray-900">৳{fare}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Quantity:</span>
                <span className="font-semibold text-gray-900">{quantity} {quantity === 1 ? 'ticket' : 'tickets'}</span>
              </div>
              <div className="pt-2 border-t-2 border-green-300 flex justify-between items-center">
                <span className="text-lg font-bold text-green-800">Total Fare:</span>
                <span className="text-2xl font-bold text-green-600">
                  {isCalculating ? (
                    <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    `৳${totalFare}`
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Book Button */}
        <Button
          onClick={onBook}
          disabled={!isFormValid || isCalculating}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all ${
            !isFormValid || isCalculating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg'
          }`}
        >
          {isCalculating ? (
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Calculating...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Journey
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ScheduleBookingForm;
