
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
  const [notes, setNotes] = useState('');
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
        notes: notes.trim(),
      };
      onSave(fullReport);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset forms
      setFormKey(Date.now());
      setDate(today);
      setNotes('');
    } else {
      alert('Please fill out all report sections before saving.');
    }
  };

  return (
    <div className="space-y-6 pb-8" key={formKey}>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-600">
        <label htmlFor="report-date" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-tight">Record Date</label>
        <input
          type="date"
          id="report-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-black font-medium"
        />
      </div>

      <EggProductionReportForm onUpdate={setEggProductionData} />
      <MortalityReportForm onUpdate={setMortalityData} />
      <FeedStockReportForm onUpdate={setFeedStockData} />
      <EggSalesReportForm onUpdate={setEggSalesData} />

      <div className="bg-white p-4 rounded-lg shadow">
        <label htmlFor="farm-notes" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-tight">Farm Observations / Notes</label>
        <textarea
          id="farm-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., Vaccination day, broken feeder in Pen B, unusual weather..."
          className="w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-black min-h-[100px]"
        />
      </div>

      <div className="mt-8">
        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white font-extrabold text-lg py-4 px-4 rounded-xl shadow-lg hover:bg-indigo-700 transform active:scale-[0.98] transition-all"
        >
          SUBMIT DAILY RECORD
        </button>
      </div>

      {showSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-3 rounded-full shadow-2xl z-50 animate-bounce font-bold">
          Record Logged Successfully!
        </div>
      )}
    </div>
  );
};

export default DailyReports;