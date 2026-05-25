// ==========================================
// FILE PATH:
// client/src/utils/generateInvoice.js
// ==========================================

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { dateTime } from './format';

export const generateInvoice = (order) => {

  const doc = new jsPDF('p', 'mm', 'a4');

  // ==========================================
  // COLORS
  // ==========================================
  const BRAND = [230, 57, 70];
  const DARK = [25, 25, 25];
  const GRAY = [110, 110, 110];
  const LIGHT = [248, 248, 248];
  const SUCCESS = [34, 197, 94];
  const WARNING = [245, 158, 11];
  const DANGER = [239, 68, 68];

  // ==========================================
  // CALCULATIONS
  // ==========================================
  const subtotal = order.items.reduce(
    (acc, item) => acc + (item.priceAtOrder * item.qty),
    0
  );

  const tax = subtotal * 0.05;

  const deliveryFee =
    order.totalAmount - subtotal - tax;

  // ==========================================
  // BACKGROUND
  // ==========================================
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  // ==========================================
  // HEADER
  // ==========================================
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, 210, 38, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);

  doc.text('Pizza Palace', 20, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  doc.text('Premium Pizza Invoice', 20, 29);

  // ==========================================
  // TITLE
  // ==========================================
  doc.setTextColor(...DARK);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);

  doc.text('INVOICE', 20, 56);

  // ==========================================
  // ORDER CARD
  // ==========================================
  doc.setFillColor(...LIGHT);

  doc.roundedRect(20, 65, 170, 30, 4, 4, 'F');

  doc.setFontSize(9);
  doc.setTextColor(...GRAY);

  doc.setFont('helvetica', 'bold');

  doc.text('ORDER ID', 25, 77);
  doc.text('DATE', 85, 77);
  doc.text('STATUS', 145, 77);

  doc.setTextColor(...DARK);

  doc.setFontSize(11);

  doc.text(
    `#${order._id.slice(-8).toUpperCase()}`,
    25,
    87
  );

  doc.text(
    `${dateTime(order.createdAt)}`,
    85,
    87
  );

  // STATUS COLOR
  if (order.status === 'Delivered') {

    doc.setTextColor(...SUCCESS);

  } else if (order.status === 'Cancelled') {

    doc.setTextColor(...DANGER);

  } else {

    doc.setTextColor(...WARNING);
  }

  doc.text(order.status, 145, 87);

  // ==========================================
  // PAYMENT DETAILS LEFT
  // ==========================================
  doc.setTextColor(...DARK);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);

  doc.text('Payment Details', 20, 112);

  doc.setDrawColor(...BRAND);

  doc.line(20, 115, 58, 115);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  doc.text(
    `Method: ${order.paymentMethod || 'Online Payment'}`,
    20,
    127
  );

  doc.text(
    `Payment Status: ${order.paymentStatus || 'Paid'}`,
    20,
    135
  );

  // ==========================================
  // CUSTOMER DETAILS RIGHT SIDE
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);

  doc.text('Customer Details', 110, 112);

  doc.line(110, 115, 162, 115);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  doc.text(
    `Name: ${order.deliveryAddress?.fullName || 'Customer'}`,
    110,
    127
  );

  doc.text(
    `Phone: ${order.deliveryAddress?.phone || '-'}`,
    110,
    135
  );

  doc.text(
    `City: ${order.deliveryAddress?.city || '-'}`,
    110,
    143
  );

  doc.text(
    `Pincode: ${order.deliveryAddress?.pincode || '-'}`,
    110,
    151
  );

  // ==========================================
  // ORDERED ITEMS TITLE
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);

  doc.text('Ordered Items', 20, 176);

  doc.line(20, 179, 58, 179);

  // ==========================================
  // TABLE
  // ==========================================
  autoTable(doc, {

    startY: 186,

    head: [['Pizza', 'Size', 'Qty', 'Unit Price', 'Total']],

    body: order.items.map((item) => [

      item.name,

      item.size,

      item.qty,

      `Rs. ${item.priceAtOrder.toFixed(2)}`,

      `Rs. ${(item.priceAtOrder * item.qty).toFixed(2)}`
    ]),

    styles: {

      font: 'helvetica',

      fontSize: 10,

      cellPadding: 4,

      lineColor: [230, 230, 230],

      lineWidth: 0.2,
    },

    headStyles: {

      fillColor: BRAND,

      textColor: [255, 255, 255],

      fontStyle: 'bold',

      halign: 'center',
    },

    alternateRowStyles: {

      fillColor: [250, 250, 250],
    },

    margin: {

      left: 20,

      right: 20,
    },
  });

  // ==========================================
  // SUMMARY SECTION
  // ==========================================
  const summaryY = doc.lastAutoTable.finalY + 12;

  // THANK YOU LEFT
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);

  doc.setTextColor(...BRAND);

  doc.text(
    'Thank you for ordering from Pizza Palace!',
    20,
    summaryY + 10
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  doc.setTextColor(...GRAY);

  doc.text(
    'Freshly baked happiness delivered to your door.',
    20,
    summaryY + 18
  );

  // ==========================================
  // BILL SUMMARY BOX RIGHT
  // ==========================================
  doc.setFillColor(252, 252, 252);

  doc.roundedRect(
    118,
    summaryY,
    72,
    38,
    4,
    4,
    'F'
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);

  doc.setTextColor(...DARK);

  doc.text('Bill Summary', 125, summaryY + 8);

  // SUBTOTAL
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  doc.text('Subtotal', 125, summaryY + 18);

  doc.text(
    `Rs. ${subtotal.toFixed(2)}`,
    182,
    summaryY + 18,
    { align: 'right' }
  );

  // TAX
  doc.text('Tax (5%)', 125, summaryY + 25);

  doc.text(
    `Rs. ${tax.toFixed(2)}`,
    182,
    summaryY + 25,
    { align: 'right' }
  );

  // DELIVERY
  doc.text('Delivery Fee', 125, summaryY + 32);

  doc.text(
    `Rs. ${deliveryFee.toFixed(2)}`,
    182,
    summaryY + 32,
    { align: 'right' }
  );

  // ==========================================
  // GRAND TOTAL BAR
  // ==========================================
  doc.setFillColor(...BRAND);

  doc.roundedRect(
    118,
    summaryY + 44,
    72,
    16,
    3,
    3,
    'F'
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);

  doc.setTextColor(255, 255, 255);

  doc.text(
    `Total: Rs. ${order.totalAmount.toFixed(2)}`,
    154,
    summaryY + 54,
    { align: 'center' }
  );

  // ==========================================
  // FOOTER
  // ==========================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  doc.setTextColor(...GRAY);

  doc.text(
    'Pizza Palace © 2026',
    190,
    290,
    { align: 'right' }
  );

  // ==========================================
  // SAVE PDF
  // ==========================================
  doc.save(
    `pizza-palace-${order._id.slice(-8)}.pdf`
  );
};