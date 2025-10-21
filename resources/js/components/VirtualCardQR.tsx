import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface VirtualCardQRProps {
  name: string;
  cardNumber: string;
  balance: number;
}

const VirtualCardQR: React.FC<VirtualCardQRProps> = ({ name, cardNumber, balance }) => {
  const qrValue = JSON.stringify({ name, cardNumber, balance });
  return (
    <div className="flex flex-col items-center justify-center">
      <QRCodeSVG
        value={qrValue}
        size={120}
        bgColor="#ffffff"
        fgColor="#22c55e"
        level="H"
        includeMargin={true}
      />
      <span className="text-xs text-green-100 mt-2">Scan QR for card info</span>
    </div>
  );
};

export default VirtualCardQR;
