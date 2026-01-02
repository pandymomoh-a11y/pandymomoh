
import { DailyReport, UserProfile } from '../types';

declare const jspdf: any;

/**
 * Standard colors for the farm record book
 */
const COLORS = {
  PRIMARY: [79, 70, 229], // Indigo
  SECONDARY: [51, 65, 85], // Slate
  TEXT: [30, 41, 59],
  RED: [185, 28, 28],
  AMBER: [180, 83, 9],
  SKY: [3, 105, 161],
  LIGHT_GRAY: [248, 250, 252]
};

const drawHeader = (doc: any, title: string, subtitle: string, profile: UserProfile, reportDate?: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Indigo Top Bar
  doc.setFillColor(...COLORS.PRIMARY);
  doc.rect(0, 0, pageWidth, 15, 'F');
  
  // App Name & Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SUFFY POULTRY - DIGITAL FARM LEDGER', 14, 10);
  
  doc.setTextColor(...COLORS.PRIMARY);
  doc.setFontSize(24);
  doc.text(title.toUpperCase(), 14, 30);
  
  doc.setTextColor(...COLORS.SECONDARY);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, 14, 38);

  // Farm Info Box (Right Aligned)
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.TEXT);
  const infoX = pageWidth - 14;
  doc.text(`FARM OWNER: ${profile.name.toUpperCase()}`, infoX, 30, { align: 'right' });
  if (reportDate) {
    doc.text(`RECORD DATE: ${new Date(reportDate + 'T00:00:00').toLocaleDateString()}`, infoX, 35, { align: 'right' });
  }
  doc.text(`PRINTED ON: ${new Date().toLocaleString()}`, infoX, 40, { align: 'right' });

  // Decorative Line
  doc.setDrawColor(...COLORS.PRIMARY);
  doc.setLineWidth(0.5);
  doc.line(14, 45, pageWidth - 14, 45);
};

const drawFooter = (doc: any) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Signature Area on the last page or every page for formality
    const footerStartY = pageHeight - 35;
    doc.setDrawColor(200);
    doc.setLineWidth(0.2);
    doc.line(14, footerStartY, 80, footerStartY);
    doc.line(pageWidth - 80, footerStartY, pageWidth - 14, footerStartY);
    
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('FARM MANAGER SIGNATURE', 14, footerStartY + 5);
    doc.text('VERIFIED BY / SUPERVISOR', pageWidth - 14, footerStartY + 5, { align: 'right' });

    // Page numbers
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text('© Suffy Poultry - Professional Farm Management Systems', 14, pageHeight - 10);
  }
};

export const exportDailyReportToPdf = (report: DailyReport, profile: UserProfile) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  
  drawHeader(doc, 'Daily Production Record', 'Detailed breakdown of poultry metrics', profile, report.date);

  let currentY = 55;

  // 1. Egg Production
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.PRIMARY);
  doc.text('SECTION 1: EGG PRODUCTION', 14, currentY);
  
  const eggData = report.eggProduction.entries.map(e => {
    const usable = e.totalEggs - e.crackedEggs;
    return [
      e.birdType,
      e.totalEggs.toLocaleString(),
      e.crackedEggs.toLocaleString(),
      usable > 0 ? Math.floor(usable / 30).toLocaleString() : '0',
      usable > 0 ? (usable % 30).toLocaleString() : '0'
    ];
  });
  
  const eggTotals = report.eggProduction.entries.reduce((acc, e) => {
    acc.total += e.totalEggs;
    acc.cracked += e.crackedEggs;
    const usable = e.totalEggs - e.crackedEggs;
    if(usable > 0) {
      acc.crates += Math.floor(usable / 30);
      acc.pieces += usable % 30;
    }
    return acc;
  }, { total: 0, cracked: 0, crates: 0, pieces: 0 });
  eggTotals.crates += Math.floor(eggTotals.pieces / 30);
  eggTotals.pieces %= 30;

  (doc as any).autoTable({
    startY: currentY + 5,
    head: [['BIRD TYPE / PEN', 'TOTAL EGGS', 'CRACKED', 'CRATES (30s)', 'LOOSE PIECES']],
    body: [...eggData, [{content: 'CONSOLIDATED TOTALS', styles: {fontStyle: 'bold'}}, eggTotals.total.toLocaleString(), eggTotals.cracked.toLocaleString(), eggTotals.crates.toLocaleString(), eggTotals.pieces.toLocaleString()]],
    headStyles: { fillColor: COLORS.PRIMARY, textColor: 255, fontSize: 10, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 10, halign: 'center' },
    columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
    theme: 'grid'
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

  // 2. Mortality
  doc.setTextColor(...COLORS.RED);
  doc.text('SECTION 2: BIRD MORTALITY & POPULATION', 14, currentY);
  
  const mortalityData = report.mortality.entries.map(e => [
    e.birdType, 
    e.population.toLocaleString(), 
    e.numberDead.toLocaleString(), 
    (e.population - e.numberDead).toLocaleString()
  ]);
  
  const mortTotals = report.mortality.entries.reduce((acc, e) => {
    acc.pop += e.population;
    acc.dead += e.numberDead;
    acc.bal += (e.population - e.numberDead);
    return acc;
  }, { pop: 0, dead: 0, bal: 0 });

  (doc as any).autoTable({
    startY: currentY + 5,
    head: [['BIRD TYPE', 'STARTING POPULATION', 'DAILY DEATHS', 'CLOSING BALANCE']],
    body: [...mortalityData, [{content: 'TOTALS', styles: {fontStyle: 'bold'}}, mortTotals.pop.toLocaleString(), mortTotals.dead.toLocaleString(), mortTotals.bal.toLocaleString()]],
    headStyles: { fillColor: COLORS.RED, textColor: 255, fontSize: 10, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 10, halign: 'center' },
    columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
    theme: 'grid'
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

  // 3. Feed & Sales (Combined in a row or list)
  if (currentY > 220) { doc.addPage(); currentY = 55; }
  
  doc.setTextColor(...COLORS.AMBER);
  doc.text('SECTION 3: FEED STOCK LOGISTICS', 14, currentY);
  const feedData = report.feedStock.entries.map(e => [
    e.feedType, 
    e.opening.toLocaleString(), 
    e.used.toLocaleString(), 
    e.bought.toLocaleString(), 
    (e.opening + e.bought - e.used).toLocaleString()
  ]);

  (doc as any).autoTable({
    startY: currentY + 5,
    head: [['FEED TYPE', 'OPENING STOCK', 'UNITS USED', 'NEW ARRIVALS', 'CLOSING STOCK']],
    body: feedData,
    headStyles: { fillColor: COLORS.AMBER, fontSize: 10, halign: 'center' },
    bodyStyles: { fontSize: 10, halign: 'center' },
    columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
    theme: 'grid'
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;
  if (currentY > 220) { doc.addPage(); currentY = 55; }

  doc.setTextColor(...COLORS.SKY);
  doc.text('SECTION 4: EGG SALES & INVENTORY', 14, currentY);
  const salesData = report.eggSales.entries.map(e => [
    e.eggType, 
    e.opening.toLocaleString(), 
    e.sold.toLocaleString(), 
    (e.opening - e.sold).toLocaleString()
  ]);

  (doc as any).autoTable({
    startY: currentY + 5,
    head: [['EGG CATEGORY', 'OPENING INVENTORY', 'UNITS SOLD', 'CLOSING BALANCE']],
    body: salesData,
    headStyles: { fillColor: COLORS.SKY, fontSize: 10, halign: 'center' },
    bodyStyles: { fontSize: 10, halign: 'center' },
    columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
    theme: 'grid'
  });

  // Notes Section
  currentY = (doc as any).lastAutoTable.finalY + 15;
  if (report.notes) {
    if (currentY > 240) { doc.addPage(); currentY = 55; }
    doc.setTextColor(...COLORS.SECONDARY);
    doc.text('SECTION 5: GENERAL OBSERVATIONS & NOTES', 14, currentY);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(60);
    const splitNotes = doc.splitTextToSize(report.notes, 180);
    doc.text(splitNotes, 14, currentY + 7);
  }

  drawFooter(doc);
  doc.save(`FARM-REPORT-${report.date}-${profile.name.replace(/\s+/g, '_')}.pdf`);
};

export const exportSummaryToPdf = (reports: DailyReport[], title: string, period: string, profile: UserProfile) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  
  drawHeader(doc, title, `Aggregate performance summary for the period`, profile);

  const totals = reports.reduce((acc, report) => {
    report.eggProduction.entries.forEach(e => {
        acc.totalEggs += e.totalEggs;
        acc.crackedEggs += e.crackedEggs;
    });
    report.mortality.entries.forEach(e => {
        acc.mortality += e.numberDead;
    });
    report.feedStock.entries.forEach(e => {
        acc.feedUsed += e.used;
    });
    report.eggSales.entries.forEach(e => {
        acc.eggsSold += e.sold;
    });
    return acc;
  }, { totalEggs: 0, crackedEggs: 0, mortality: 0, feedUsed: 0, eggsSold: 0 });

  const usableEggs = totals.totalEggs - totals.crackedEggs;
  const totalCrates = usableEggs > 0 ? Math.floor(usableEggs / 30) : 0;

  (doc as any).autoTable({
    startY: 60,
    head: [['PERFORMANCE METRIC', 'TOTAL QUANTITY / UNITS']],
    body: [
      ['Total Eggs Harvested', totals.totalEggs.toLocaleString()],
      ['Market-Ready Crates (Usable)', totalCrates.toLocaleString()],
      ['Damaged/Cracked Eggs', totals.crackedEggs.toLocaleString()],
      ['Bird Mortality (Cumulative)', totals.mortality.toLocaleString()],
      ['Total Feed Consumption', totals.feedUsed.toLocaleString()],
      ['Revenue-Generating Units Sold', totals.eggsSold.toLocaleString()]
    ],
    headStyles: { fillColor: COLORS.PRIMARY, fontSize: 12, halign: 'left' },
    bodyStyles: { fontSize: 12, padding: 8 },
    theme: 'striped',
    styles: { cellPadding: 5 }
  });

  // Summary Statement
  const summaryY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(11);
  doc.setTextColor(60);
  doc.setFont('helvetica', 'normal');
  const summaryText = `This ${title.toLowerCase()} for the period of ${period} comprises data from ${reports.length} individual daily logs. All figures represent cumulative totals as recorded by the Suffy Poultry system for the farm profile: ${profile.name}.`;
  const splitSummary = doc.splitTextToSize(summaryText, 180);
  doc.text(splitSummary, 14, summaryY);

  drawFooter(doc);
  doc.save(`SUMMARY-${title.replace(/\s+/g, '_')}-${new Date().getTime()}.pdf`);
};