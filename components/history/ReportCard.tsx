
import React from 'react';
import { DailyReport, UserProfile } from '../../types';
import { exportDailyReportToPdf } from '../../services/pdfService';
import { PdfIcon } from '../icons/PdfIcon';
import { EggIcon } from '../icons/EggIcon';
import { SkullIcon } from '../icons/SkullIcon';
import { FeedIcon } from '../icons/FeedIcon';
import { SalesIcon } from '../icons/SalesIcon';

interface ReportCardProps {
    report: DailyReport;
    isOpen: boolean;
    onToggle: () => void;
    activeProfile: UserProfile;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, isOpen, onToggle, activeProfile }) => {
    const reportId = `report-${report.date}`;

    const eggTotals = report.eggProduction.entries.reduce((acc, entry) => {
        const usable = entry.totalEggs - entry.crackedEggs;
        acc.totalEggs += entry.totalEggs;
        acc.crackedEggs += entry.crackedEggs;
        if(usable > 0) {
            acc.crates += Math.floor(usable / 30);
            acc.pieces += usable % 30;
        }
        return acc;
    }, { totalEggs: 0, crackedEggs: 0, crates: 0, pieces: 0 });

    eggTotals.crates += Math.floor(eggTotals.pieces / 30);
    eggTotals.pieces %= 30;

    const mortalityTotals = report.mortality.entries.reduce((acc, entry) => {
        acc.pop += entry.population;
        acc.dead += entry.numberDead;
        acc.bal += (entry.population - entry.numberDead);
        return acc;
    }, { pop: 0, dead: 0, bal: 0 });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
            <button 
                onClick={onToggle} 
                className={`w-full text-left p-5 flex justify-between items-center transition-colors ${isOpen ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
            >
                <div>
                  <span className="block font-extrabold text-lg text-gray-900">{new Date(report.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Record Summary Available</span>
                </div>
                <svg className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="p-4 sm:p-6 border-t border-gray-100" id={reportId}>
                    <div className="space-y-8">
                        {/* Egg Production */}
                        <div>
                            <h3 className="text-sm font-black text-indigo-700 uppercase tracking-widest mb-3 flex items-center"><EggIcon className="w-5 h-5 mr-2" /> 01. Egg Production</h3>
                            <div className="overflow-x-auto rounded-lg border border-indigo-100">
                              <table className="w-full text-sm">
                                  <thead className="bg-indigo-600 text-white font-bold"><tr><th className="p-3 text-left">Birds</th><th className="p-3 text-right">Total</th><th className="p-3 text-right">Cracked</th><th className="p-3 text-right">Crates</th><th className="p-3 text-right">Pieces</th></tr></thead>
                                  <tbody>{report.eggProduction.entries.map((e, i) => {
                                      const usable = e.totalEggs - e.crackedEggs;
                                      const crates = usable > 0 ? Math.floor(usable / 30) : 0;
                                      const pieces = usable > 0 ? usable % 30 : 0;
                                      return <tr key={i} className="border-b border-indigo-50 text-gray-900 hover:bg-indigo-50/30 transition-colors"><td className="p-3 font-semibold">{e.birdType}</td><td className="p-3 text-right font-medium">{e.totalEggs}</td><td className="p-3 text-right text-red-500">{e.crackedEggs}</td><td className="p-3 text-right font-bold text-indigo-600">{crates}</td><td className="p-3 text-right">{pieces}</td></tr>
                                  })}</tbody>
                                  <tfoot className="font-black bg-indigo-100 text-indigo-900 border-t-2 border-indigo-200"><tr><td className="p-3">TOTALS</td><td className="p-3 text-right">{eggTotals.totalEggs}</td><td className="p-3 text-right">{eggTotals.crackedEggs}</td><td className="p-3 text-right">{eggTotals.crates}</td><td className="p-3 text-right">{eggTotals.pieces}</td></tr></tfoot>
                              </table>
                            </div>
                        </div>
                         {/* Mortality */}
                         <div>
                            <h3 className="text-sm font-black text-red-700 uppercase tracking-widest mb-3 flex items-center"><SkullIcon className="w-5 h-5 mr-2" /> 02. Mortality & Balance</h3>
                            <div className="overflow-x-auto rounded-lg border border-red-100">
                              <table className="w-full text-sm">
                                  <thead className="bg-red-600 text-white font-bold"><tr><th className="p-3 text-left">Type</th><th className="p-3 text-right">Start Pop.</th><th className="p-3 text-right">Dead</th><th className="p-3 text-right">Balance</th></tr></thead>
                                  <tbody>{report.mortality.entries.map((e, i) => <tr key={i} className="border-b border-red-50 text-gray-900"><td className="p-3 font-semibold">{e.birdType}</td><td className="p-3 text-right font-medium">{e.population}</td><td className="p-3 text-right text-red-600 font-bold">{e.numberDead}</td><td className="p-3 text-right font-bold">{e.population - e.numberDead}</td></tr>)}</tbody>
                                  <tfoot className="font-black bg-red-100 text-red-900 border-t-2 border-red-200"><tr><td className="p-3">TOTALS</td><td className="p-3 text-right">{mortalityTotals.pop}</td><td className="p-3 text-right">{mortalityTotals.dead}</td><td className="p-3 text-right">{mortalityTotals.bal}</td></tr></tfoot>
                              </table>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Feed Stock */}
                            <div>
                                <h3 className="text-sm font-black text-amber-700 uppercase tracking-widest mb-3 flex items-center"><FeedIcon className="w-5 h-5 mr-2" /> 03. Feed Stock</h3>
                                <div className="rounded-lg border border-amber-100 overflow-hidden">
                                  <table className="w-full text-xs">
                                      <thead className="bg-amber-600 text-white"><tr><th className="p-2 text-left">Feed</th><th className="p-2 text-right">Used</th><th className="p-2 text-right">Balance</th></tr></thead>
                                      <tbody>{report.feedStock.entries.map((e, i) => <tr key={i} className="border-b border-amber-50 text-gray-900"><td className="p-2 font-semibold">{e.feedType}</td><td className="p-2 text-right">{e.used}</td><td className="p-2 text-right font-bold">{e.opening + e.bought - e.used}</td></tr>)}</tbody>
                                  </table>
                                </div>
                            </div>
                            {/* Egg Sales */}
                            <div>
                                <h3 className="text-sm font-black text-sky-700 uppercase tracking-widest mb-3 flex items-center"><SalesIcon className="w-5 h-5 mr-2" /> 04. Egg Sales</h3>
                                <div className="rounded-lg border border-sky-100 overflow-hidden">
                                  <table className="w-full text-xs">
                                      <thead className="bg-sky-600 text-white"><tr><th className="p-2 text-left">Type</th><th className="p-2 text-right">Sold</th><th className="p-2 text-right">Balance</th></tr></thead>
                                      <tbody>{report.eggSales.entries.map((e, i) => <tr key={i} className="border-b border-sky-50 text-gray-900"><td className="p-2 font-semibold">{e.eggType}</td><td className="p-2 text-right">{e.sold}</td><td className="p-2 text-right font-bold">{e.opening - e.sold}</td></tr>)}</tbody>
                                  </table>
                                </div>
                            </div>
                        </div>

                        {report.notes && (
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Manager's Notes</h4>
                            <p className="text-gray-700 italic text-sm">"{report.notes}"</p>
                          </div>
                        )}
                    </div>
                    
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => exportDailyReportToPdf(report, activeProfile)}
                            className="group flex items-center px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black hover:shadow-xl transform active:scale-95 transition-all"
                        >
                            <PdfIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                            GENERATE OFFICIAL PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};