
declare const html2canvas: any;
declare const jspdf: any;

export const exportToPdf = (elementId: string, fileName: string) => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }
  
  const { jsPDF } = jspdf;
  
  html2canvas(input, { scale: 3 }).then((canvas: any) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    
    let finalImgWidth = pdfWidth - 20; // with margin
    let finalImgHeight = finalImgWidth / ratio;
    
    let heightLeft = finalImgHeight;
    let position = 10; // top margin

    pdf.addImage(imgData, 'PNG', 10, position, finalImgWidth, finalImgHeight);
    heightLeft -= (pdfHeight - 20);

    while (heightLeft >= 0) {
      position = heightLeft - finalImgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, finalImgWidth, finalImgHeight);
      heightLeft -= (pdfHeight - 20);
    }
    
    pdf.save(fileName);
  });
};