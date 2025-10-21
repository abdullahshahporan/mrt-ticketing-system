import jsPDF from 'jspdf';
import React from 'react';
import ReactDOM from 'react-dom';
import { QRCodeCanvas } from 'qrcode.react';

export function getTicketQRValue({ ticketPNR, from, to, price, validity }: { ticketPNR: string, from: string, to: string, price: number|string, validity: string }) {
	return `MRT-TICKET|PNR:${ticketPNR}|FROM:${from}|TO:${to}|PRICE:${price}|VALID:${validity}`;
}

export async function downloadTicketQRs(qrData: Array<{ ticketPNR: string, from: string, to: string, price: number|string, validity: string }>) {
	const container = document.createElement('div');
	container.style.position = 'fixed';
	container.style.left = '-9999px';
	container.style.top = '0';
	document.body.appendChild(container);

	try {
		const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [220, 220] });
		let pageIndex = 0;
		for (const data of qrData) {
			const value = getTicketQRValue(data);
			const qrDiv = document.createElement('div');
			qrDiv.style.width = '220px';
			qrDiv.style.height = '220px';
			container.appendChild(qrDiv);
			ReactDOM.render(<QRCodeCanvas value={value} size={200} bgColor="#fff" fgColor="#111" level="H" includeMargin={true} />, qrDiv);
			await new Promise((r) => setTimeout(r, 80));
			const canvasEl = qrDiv.querySelector('canvas') as HTMLCanvasElement | null;
			if (!canvasEl) throw new Error('QR canvas not found after render');
			const imgData = canvasEl.toDataURL('image/png');
			if (pageIndex > 0) pdf.addPage([220, 220], 'portrait');
			pdf.addImage(imgData, 'PNG', 10, 10, 200, 200);
			pageIndex++;
			ReactDOM.unmountComponentAtNode(qrDiv);
			container.removeChild(qrDiv);
		}
		document.body.removeChild(container);
		pdf.save('tickets_qr_only.pdf');
	} catch (err) {
		try { document.body.removeChild(container); } catch (e) {}
		throw err;
	}
}

export async function downloadTicketQRsFromBase(basePNR: string, quantity: number, from: string, to: string, price: number|string, validity: string) {
	if (!basePNR || quantity < 1) return;
	const qrData = [];
	for (let i = 1; i <= quantity; i++) {
		qrData.push({ ticketPNR: `${basePNR}-${i}`, from, to, price, validity });
	}
	await downloadTicketQRs(qrData);
}
