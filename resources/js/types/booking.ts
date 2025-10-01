export interface Station {
  id: string;
  name: string;
  order: number;
}

export interface BookingFormData {
  from_station: string;
  to_station: string;
  quantity: number;
}

export interface FareCalculation {
  success: boolean;
  base_fare: number;
  total_fare: number;
  distance: number;
  quantity: number;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  pnr?: string;
  booking_id?: number;
  ticket_details?: {
    from: string;
    to: string;
    quantity: number;
    total_fare: number;
    booking_time: string;
  };
}