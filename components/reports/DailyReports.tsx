
import React, { useState } from 'react';
import EggProductionReportForm from './EggProductionReport';
import MortalityReportForm from './MortalityReport';
import FeedStockReportForm from './FeedStockReport';
import EggSalesReportForm from './EggSalesReport';
import { DailyReport, EggProductionReport, MortalityReport, FeedStockReport, EggSalesReport } from '../../types';

interface DailyReportsProps {
  onSave: (report: DailyReport) => void;
}

const DailyReports: React.FC<DailyReportsProps> = ({ onSave }) => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [eggProductionData, setEggProductionData] = useState<EggProductionReport | null>(null);
  const [mortalityData, setMortalityData] = useState<MortalityReport | null>(null);
  const [feedStockData, setFeedStockData] = useState<FeedStockReport | null>(null);
  const [eggSalesData, setEggSalesData] = useState<EggSalesReport | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formKey, setFormKey] = useState(Date.now());

  const handleSave = () => {
    if (eggProductionData && mortalityData && feedStockData && eggSalesData) {
      const fullReport: DailyReport = {
        date,
        eggProduction: eggProductionData,
        mortality: mortalityData,
        feedStock: feedStockData,
        eggSales: eggSalesData,
      };
      onSave(fullReport);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset forms by changing key, which forces remount
      setFormKey(Date.now());
      setDate(today);
    } else {
      alert('Please fill out all report sections before saving.');
    }
  };

  return (
    <div className="space-y-6" key={formKey}>
      <div className="bg-white p-4 rounded-lg shadow">
        <label htmlFor="report-date" className="block text-sm font-medium text-black mb-1">Report Date</label>
        <input
          type="date"
          id="report-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-black"
        />
      </div>

      <EggProductionReportForm onUpdate={setEggProductionData} />
      <MortalityReportForm onUpdate={setMortalityData} />
      <FeedStockReportForm onUpdate={setFeedStockData} />
      <EggSalesReportForm onUpdate={setEggSalesData} />

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Daily Report
        </button>
      </div>

      {showSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full shadow-lg">
          Report Saved! Form has been reset.
        </div>
      )}
    </div>
  );
};

export default DailyReports;