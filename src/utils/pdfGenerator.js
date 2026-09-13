import { jsPDF } from 'jspdf';

/**
 * Generates and downloads an official NCPOR Publication Document in native PDF format.
 * @param {Object} pub - The publication object containing metadata, authors, abstract, doi, etc.
 */
export function downloadPublicationPDF(pub) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner - Navy Blue
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Header Top Line: Government of India / MoES
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // #94a3b8
  doc.text('GOVERNMENT OF INDIA • MINISTRY OF EARTH SCIENCES', margin, 11);

  // Main Header Title: NCPOR
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH (NCPOR)', margin, 18);

  // Subheader: Open-Access Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(56, 189, 248); // #38bdf8
  doc.text('PEER-REVIEWED SCIENTIFIC RESEARCH ARCHIVE • OPEN ACCESS', margin, 25);

  let currentY = 44;

  // Category & Year Tag
  doc.setFillColor(236, 253, 245); // #ecfdf5
  doc.setDrawColor(167, 243, 208); // #a7f3d0
  doc.roundedRect(margin, currentY, contentWidth, 9, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(4, 120, 87); // #047857
  const categoryText = `${pub.category || 'Polar Research'}  |  Year: ${pub.year}  |  Peer-Reviewed  |  ${pub.citations || 0} Citations`;
  doc.text(categoryText, margin + 4, currentY + 6);

  currentY += 16;

  // Publication Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(pub.title, contentWidth);
  doc.text(titleLines, margin, currentY);
  currentY += titleLines.length * 6.5 + 4;

  // Authors
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85); // #334155
  const authorsText = `Authors: ${(pub.authors || ['NCPOR Scientific Team']).join(', ')}`;
  const authorLines = doc.splitTextToSize(authorsText, contentWidth);
  doc.text(authorLines, margin, currentY);
  currentY += authorLines.length * 5 + 3;

  // Journal and DOI
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(3, 105, 161); // #0369a1
  doc.text(`Published in: ${pub.journal} (${pub.year})`, margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Digital Object Identifier (DOI): https://doi.org/${pub.doi}`, margin, currentY);
  currentY += 8;

  // Divider Line
  doc.setDrawColor(226, 232, 240); // #e2e8f0
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // Abstract & Key Findings Section Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ABSTRACT & SCIENTIFIC SUMMARY', margin, currentY);
  currentY += 5;

  // Abstract Box Background
  const abstractText = pub.abstract || 'This publication presents original polar research findings collected and peer-reviewed under the NCPOR scientific expedition mandate.';
  const abstractLines = doc.splitTextToSize(abstractText, contentWidth - 8);
  const boxHeight = abstractLines.length * 5 + 8;

  doc.setFillColor(248, 250, 252); // #f8fafc
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, boxHeight, 2, 2, 'FD');

  // Left accent line
  doc.setFillColor(2, 132, 199); // #0284c7
  doc.rect(margin, currentY, 2, boxHeight, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(abstractLines, margin + 5, currentY + 6);
  currentY += boxHeight + 10;

  // Formatted Citation Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('RECOMMENDED CITATION (APA FORMAT)', margin, currentY);
  currentY += 5;

  const authorsFormatted = pub.authors && pub.authors.length > 0 ? pub.authors.join(', ') : 'NCPOR Scientific Team';
  const citationText = `${authorsFormatted} (${pub.year}). ${pub.title}. ${pub.journal}. https://doi.org/${pub.doi}`;
  const citationLines = doc.splitTextToSize(citationText, contentWidth - 8);
  const citeBoxHeight = citationLines.length * 4.8 + 8;

  doc.setFillColor(241, 245, 249); // #f1f5f9
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, citeBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(citationLines, margin + 4, currentY + 5.5);
  currentY += citeBoxHeight + 10;

  // Mission & Repository Notes
  if (pub.expeditionId) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Expedition Reference: ${pub.expeditionId.toUpperCase()}`, margin, currentY);
  }

  // Footer Banner
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Official NCPOR Polar Science Outreach & Research Repository • https://ncpor.res.in', margin, pageHeight - 12);
  doc.text(`Document Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`, pageWidth - margin - 45, pageHeight - 12);

  // Trigger Native PDF Download
  const safeTitle = (pub.title || 'publication')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 40);

  doc.save(`NCPOR_Publication_${safeTitle}_${pub.year}.pdf`);
}
