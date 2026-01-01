
import React from 'react';
import { DailyReport, UserProfile } from '../../types';
import { exportSummaryToPdf } from '../../services/pdfService';
import { PdfIcon } from '../icons/PdfIcon';

interface SummaryCardProps {
    reports: DailyReport[];
    period: string;
    title: string;
    activeProfile: UserProfile;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ reports, period, title, activeProfile }) => {
    if (reports.length === 0) {
        return <p className="text-center text-gray-500 mt-8">No data available for this period.</p>;
    }

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

    const summaryItems = [
        { label: "Total Eggs Produced", value: totals.totalEggs.toLocaleString() },
        { label: "Total Crates (from usable)", value: totalCrates.toLocaleString() },
        { label: "Total Cracked Eggs", value: totals.crackedEggs.toLocaleString() },
        { label: "Total Bird Mortality", value: totals.mortality.toLocaleString() },
        { label: "Total Feed Used (units)", value: totals.feedUsed.toLocaleString() },
        { label: "Total Eggs Sold", value: totals.eggsSold.toLocaleString() }
    ];

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div>
                <h3 className="text-xl font-bold text-black">{title}</h3>
                <p className="text-sm text-gray-500 mb-4">{period}</p>
                
                <div className="grid grid-cols-2 gap-4">
                    {summaryItems.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-black">{item.label}</p>
                            <p className="text-xl font-bold text-indigo-600">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-6 text-center">
                <button
                    onClick={() => exportSummaryToPdf(reports, title, period, activeProfile)}
                    className="inline-flex items-center px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                >
                    <PdfIcon className="w-5 h-5 mr-2" />
                    Export to PDF
                </button>
            </div>
        </div>
    );
};

export default SummaryCard;