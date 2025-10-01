export interface Station {
  id: string;
  name: string;
  order: number;
}

export const stations: Station[] = [
  { id: 'uttara_north', name: 'Uttara North', order: 1 },
  { id: 'uttara_center', name: 'Uttara Center', order: 2 },
  { id: 'uttara_south', name: 'Uttara South', order: 3 },
  { id: 'pallabi', name: 'Pallabi', order: 4 },
  { id: 'mirpur_11', name: 'Mirpur 11', order: 5 },
  { id: 'mirpur_10', name: 'Mirpur 10', order: 6 },
  { id: 'kazipara', name: 'Kazipara', order: 7 },
  { id: 'shewrapara', name: 'Shewrapara', order: 8 },
  { id: 'agargaon', name: 'Agargaon', order: 9 },
  { id: 'bijoy_sarani', name: 'Bijoy Sarani', order: 10 },
  { id: 'farmgate', name: 'Farmgate', order: 11 },
  { id: 'karwan_bazar', name: 'Karwan Bazar', order: 12 },
  { id: 'shahbag', name: 'Shahbag', order: 13 },
  { id: 'dhaka_university', name: 'Dhaka University', order: 14 },
  { id: 'bangladesh_secretariat', name: 'Bangladesh Secretariat', order: 15 },
  { id: 'motijheel', name: 'Motijheel', order: 16 }
];