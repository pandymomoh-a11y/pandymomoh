
import React from 'react';
import { DailyReport } from '../../types';
import { exportToPdf } from '../../services/pdfService';
import { PdfIcon } from '../icons/PdfIcon';
import { EggIcon } from '../icons/EggIcon';
import { SkullIcon } from '../icons/SkullIcon';
import { FeedIcon } from '../icons/FeedIcon';
import { SalesIcon } from '../icons/SalesIcon';

interface ReportCardProps {
    report: DailyReport;
    isOpen: boolean;
    onToggle: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, isOpen, onToggle }) => {
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

    const mortalityTotal = report.mortality.entries.reduce((acc, entry) => acc + entry.numberDead, 0);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
            <button onClick={onToggle} className="w-full text-left p-4 flex justify-between items-center">
                <span className="font-bold text-lg text-black">{new Date(report.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <svg className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="p-4 border-t" id={reportId}>
                    <div className="space-y-6">
                        {/* Egg Production */}
                        <div>
                            <h3 className="text-lg font-semibold text-indigo-700 flex items-center mb-2"><EggIcon className="w-5 h-5 mr-2" />Egg Production</h3>
                            <table className="w-full text-sm">
                                <thead className="bg-indigo-200 text-black"><tr><th className="p-2 text-left">Birds</th><th className="p-2 text-right">Total</th><th className="p-2 text-right">Cracked</th><th className="p-2 text-right">Crates</th><th className="p-2 text-right">Pieces</th></tr></thead>
                                <tbody>{report.eggProduction.entries.map((e, i) => {
                                     const usable = e.totalEggs - e.crackedEggs;
                                     const crates = usable > 0 ? Math.floor(usable / 30) : 0;
                                     const pieces = usable > 0 ? usable % 30 : 0;
                                     return <tr key={i} className="border-b text-gray-900"><td className="p-2">{e.birdType}</td><td className="p-2 text-right">{e.totalEggs}</td><td className="p-2 text-right">{e.crackedEggs}</td><td className="p-2 text-right">{crates}</td><td className="p-2 text-right">{pieces}</td></tr>
                                })}</tbody>
                                <tfoot className="font-bold bg-indigo-200 text-black"><tr><td className="p-2">Total</td><td className="p-2 text-right">{eggTotals.totalEggs}</td><td className="p-2 text-right">{eggTotals.crackedEggs}</td><td className="p-2 text-right">{eggTotals.crates}</td><td className="p-2 text-right">{eggTotals.pieces}</td></tr></tfoot>
                            </table>
                        </div>
                         {/* Mortality */}
                         <div>
                            <h3 className="text-lg font-semibold text-red-700 flex items-center mb-2"><SkullIcon className="w-5 h-5 mr-2" />Mortality</h3>
                             <table className="w-full text-sm">
                                <thead className="bg-red-200 text-black"><tr><th className="p-2 text-left">Bird Type</th><th className="p-2 text-right">Number Dead</th></tr></thead>
                                <tbody>{report.mortality.entries.map((e, i) => <tr key={i} className="border-b text-gray-900"><td className="p-2">{e.birdType}</td><td className="p-2 text-right">{e.numberDead}</td></tr>)}</tbody>
                                <tfoot className="font-bold bg-red-200 text-black"><tr><td className="p-2">Total</td><td className="p-2 text-right">{mortalityTotal}</td></tr></tfoot>
                            </table>
                        </div>
                        {/* Feed Stock */}
                        <div>
                            <h3 className="text-lg font-semibold text-amber-700 flex items-center mb-2"><FeedIcon className="w-5 h-5 mr-2" />Feed Stock</h3>
                             <table className="w-full text-sm">
                                <thead className="bg-amber-200 text-black"><tr><th className="p-2 text-left">Feed</th><th className="p-2 text-right">Opening</th><th className="p-2 text-right">Used</th><th className="p-2 text-right">Bought</th><th className="p-2 text-right">Balance</th></tr></thead>
                                <tbody>{report.feedStock.entries.map((e, i) => <tr key={i} className="border-b text-gray-900"><td className="p-2">{e.feedType}</td><td className="p-2 text-right">{e.opening}</td><td className="p-2 text-right">{e.used}</td><td className="p-2 text-right">{e.bought}</td><td className="p-2 text-right">{e.opening + e.bought - e.used}</td></tr>)}</tbody>
                            </table>
                        </div>
                        {/* Egg Sales */}
                        <div>
                            <h3 className="text-lg font-semibold text-sky-700 flex items-center mb-2"><SalesIcon className="w-5 h-5 mr-2" />Egg Sales</h3>
                             <table className="w-full text-sm">
                                <thead className="bg-sky-200 text-black"><tr><th className="p-2 text-left">Egg Type</th><th className="p-2 text-right">Opening</th><th className="p-2 text-right">Sold</th><th className="p-2 text-right">Balance</th></tr></thead>
                                <tbody>{report.eggSales.entries.map((e, i) => <tr key={i} className="border-b text-gray-900"><td className="p-2">{e.eggType}</td><td className="p-2 text-right">{e.opening}</td><td className="p-2 text-right">{e.sold}</td><td className="p-2 text-right">{e.opening - e.sold}</td></tr>)}</tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => exportToPdf(reportId, `Suffy-Poultry-Report-${report.date}.pdf`)}
                            className="inline-flex items-center px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <PdfIcon className="w-5 h-5 mr-2" />
                            Export to PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};