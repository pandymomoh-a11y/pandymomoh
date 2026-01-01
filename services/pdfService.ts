
import { DailyReport, UserProfile } from '../types';

declare const jspdf: any;

export const exportDailyReportToPdf = (report: DailyReport, profile: UserProfile) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // Indigo-600
  doc.text('Suffy Poultry', 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text('Daily Farm Record', 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(`Farm/Owner: ${profile.name}`, 14, 40);
  doc.text(`Report Date: ${new Date(report.date + 'T00:00:00').toLocaleDateString()}`, 14, 45);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 50);

  let currentY = 60;

  // Egg Production Table
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text('1. Egg Production', 14, currentY);
  
  const eggData = report.eggProduction.entries.map(e => {
    const usable = e.totalEggs - e.crackedEggs;
    return [
      e.birdType,
      e.totalEggs,
      e.crackedEggs,
      usable > 0 ? Math.floor(usable / 30) : 0,
      usable > 0 ? usable % 30 : 0
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
    head: [['Bird Type', 'Total Eggs', 'Cracked', 'Crates', 'Pieces']],
    body: [...eggData, ['Total', eggTotals.total, eggTotals.cracked, eggTotals.crates, eggTotals.pieces]],
    headStyles: { fillColor: [79, 70, 229] },
    footStyles: { fillColor: [238, 242, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
    theme: 'grid'
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

  // Mortality Table
  doc.text('2. Mortality Report', 14, currentY);
  const mortalityData = report.mortality.entries.map(e => [e.birdType, e.numberDead]);
  const totalMortality = report.mortality.entries.reduce((acc, e) => acc + e.numberDead, 0);

  (doc as any).autoTable({
    startY: currentY + 5,
    head: [['Bird Type', 'Deaths']],
    body: [...mortalityData, ['Total Deaths', totalMortality]],
    headStyles: { fillColor: [220, 38, 38] },
    theme: 'grid'
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

  // Feed Stock Table
  doc.setTextColor(180, 83, 9); // Amber-700
  doc.text('3. Feed Stock Status', 14, currentY);
  const feedData = report.feedStock.entries.map(e => [
    e.feedType, 
    e.opening, 
    e.used, 
    e.bought, 
    e.opening + e.bought - e.used
  ]);

  (doc as any).autoTable({
    startY: currentY + 5,
    head: [['Feed Type', 'Opening', 'Used', 'Bought', 'Balance']],
    body: feedData,
    headStyles: { fillColor: [180, 83, 9] },
    theme: 'grid'
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page for Sales
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  // Sales Table
  doc.setTextColor(3, 105, 161); // Sky-700
  doc.text('4. Egg Sales', 14, currentY);
  const salesData = report.eggSales.entries.map(e => [
    e.eggType, 
    e.opening, 
    e.sold, 
    e.opening - e.sold
  ]);

  (doc as any).autoTable({
    startY: currentY + 5,
    head: [['Egg Type', 'Opening', 'Sold', 'Balance']],
    body: salesData,
    headStyles: { fillColor: [3, 105, 161] },
    theme: 'grid'
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount} - Suffy Poultry Digital Farm Assistant`, pageWidth / 2, 285, { align: 'center' });
  }

  doc.save(`Suffy-Poultry-Report-${report.date}.pdf`);
};

export const exportSummaryToPdf = (reports: DailyReport[], title: string, period: string, profile: UserProfile) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229);
  doc.text('Suffy Poultry', 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text(title, 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(`Farm/Owner: ${profile.name}`, 14, 40);
  doc.text(`Period: ${period}`, 14, 45);

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
    head: [['Metric', 'Value']],
    body: [
      ['Total Eggs Produced', totals.totalEggs.toLocaleString()],
      ['Total Crates (usable)', totalCrates.toLocaleString()],
      ['Total Cracked Eggs', totals.crackedEggs.toLocaleString()],
      ['Total Bird Mortality', totals.mortality.toLocaleString()],
      ['Total Feed Used (units)', totals.feedUsed.toLocaleString()],
      ['Total Eggs Sold', totals.eggsSold.toLocaleString()]
    ],
    headStyles: { fillColor: [79, 70, 229] },
    theme: 'striped'
  });

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Suffy Poultry Summary - Generated ${new Date().toLocaleString()}`, pageWidth / 2, 285, { align: 'center' });

  doc.save(`Suffy-Poultry-${title.replace(/\s+/g, '-')}.pdf`);
};
