// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// Official Certificate of Completion Generator using jsPDF

import { jsPDF } from 'jspdf';

export function generateEventCertificate({
  studentName = 'Harsh Yadav',
  studentRoll = '129',
  studentDept = 'Computer Science',
  eventTitle = 'WebCraft Workshop: Modern Web Apps',
  eventDate = '2026-03-18',
  eventVenue = 'Seminar Hall A',
  ticketId = 'EH-2026-WEBC9',
  guideName = 'Faculty In-Charge'
}) {
  // Create A4 Landscape document (297mm x 210mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Double Borders (Navy Blue & Gold)
  doc.setDrawColor(24, 32, 72); // Deep Navy
  doc.setLineWidth(3);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  doc.setDrawColor(202, 138, 4); // Rich Amber/Gold
  doc.setLineWidth(1);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Decorative corner triangles
  doc.setFillColor(202, 138, 4);
  doc.triangle(12, 12, 24, 12, 12, 24, 'F');
  doc.triangle(pageWidth - 12, 12, pageWidth - 24, 12, pageWidth - 12, 24, 'F');
  doc.triangle(12, pageHeight - 12, 24, pageHeight - 12, 12, pageHeight - 24, 'F');
  doc.triangle(pageWidth - 12, pageHeight - 12, pageWidth - 24, pageHeight - 12, pageWidth - 12, pageHeight - 24, 'F');

  // 2. College & Department Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text('DEPARTMENT OF COMPUTER SCIENCE & INFORMATION TECHNOLOGY', pageWidth / 2, 28, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('ANNUAL COLLEGE TECH FEST & EVENT MANAGEMENT COUNCIL 2026', pageWidth / 2, 34, { align: 'center' });

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 60, 38, pageWidth / 2 + 60, 38);

  // 3. Certificate Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(24, 32, 72); // Navy
  doc.text('CERTIFICATE OF PARTICIPATION', pageWidth / 2, 50, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text('This is to certify that', pageWidth / 2, 60, { align: 'center' });

  // 4. Candidate Name (Prominent & Elegant)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(124, 58, 237); // Royal Purple accent
  doc.text(studentName.toUpperCase(), pageWidth / 2, 75, { align: 'center' });

  // Subtitle / Roll info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(`Roll No: ${studentRoll}  |  Department: ${studentDept}  |  Class: TYCS-B`, pageWidth / 2, 84, { align: 'center' });

  // 5. Participation Statement
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.text('has successfully attended and actively participated in the college event:', pageWidth / 2, 98, { align: 'center' });

  // 6. Event Title Badge Box
  doc.setFillColor(245, 243, 255); // Soft brand tint
  doc.setDrawColor(196, 181, 253);
  doc.roundedRect(pageWidth / 2 - 85, 105, 170, 16, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(91, 33, 182);
  doc.text(eventTitle, pageWidth / 2, 115, { align: 'center' });

  // 7. Venue & Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Conducted on ${eventDate}  at  ${eventVenue}`, pageWidth / 2, 132, { align: 'center' });

  // 8. Official Seal / Badge
  doc.setDrawColor(202, 138, 4);
  doc.setLineWidth(1);
  doc.circle(pageWidth / 2, 155, 13);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(161, 98, 7);
  doc.text('EVENTHUB', pageWidth / 2, 153, { align: 'center' });
  doc.text('OFFICIAL VERIFIED', pageWidth / 2, 157, { align: 'center' });
  doc.text('2026', pageWidth / 2, 161, { align: 'center' });

  // 9. Signatures Block
  // Left: Student Project Author
  const leftX = 45;
  doc.setDrawColor(148, 163, 184);
  doc.line(leftX - 25, 175, leftX + 25, 175);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('Harsh Yadav', leftX, 181, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Lead Developer (Roll 129, TYCS-B)', leftX, 186, { align: 'center' });
  doc.text('EventHub Technical Head', leftX, 190, { align: 'center' });

  // Right: Faculty Authority
  const rightX = pageWidth - 45;
  doc.setDrawColor(148, 163, 184);
  doc.line(rightX - 30, 175, rightX + 30, 175);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(guideName, rightX, 181, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Faculty In-Charge & Convener', rightX, 186, { align: 'center' });
  doc.text('Dept. of Computer Science', rightX, 190, { align: 'center' });

  // 10. Security Hash Footer
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Digital Verification ID: ${ticketId}  |  Certified on: ${new Date().toLocaleDateString()}`, 16, pageHeight - 14);

  // Save the PDF directly to user downloads
  const sanitizedTitle = eventTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
  const fileName = `EventHub_Certificate_${studentName.replace(/ /g, '_')}_${sanitizedTitle}.pdf`;
  doc.save(fileName);
  return fileName;
}
