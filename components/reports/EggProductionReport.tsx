
import React, { useState, useEffect } from 'react';
import { EggProductionEntry, EggProductionReport } from '../../types';
import { BIRD_TYPES_PRODUCTION } from '../../constants';
import { EggIcon } from '../icons/EggIcon';

interface EggProductionReportFormProps {
  onUpdate: (data: EggProductionReport) => void;
}

const EggProductionReportForm: React.FC<EggProductionReportFormProps> = ({ onUpdate }) => {
  const initialEntries = BIRD_TYPES_PRODUCTION.map(bt => ({ birdType: bt, totalEggs: 0, crackedEggs: 0 }));
  const [entries, setEntries] = useState<EggProductionEntry[]>(initialEntries);

  useEffect(() => {
    onUpdate({ entries });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  const handleEntryChange = (index: number, field: keyof EggProductionEntry, value: string) => {
    const newEntries = [...entries];
    const numValue = parseInt(value, 10);
    newEntries[index] = { ...newEntries[index], [field]: isNaN(numValue) ? 0 : numValue };
    setEntries(newEntries);
  };

  const calculateTotals = () => {
    let totalEggs = 0, totalCracked = 0, totalCrates = 0, totalPieces = 0;
    entries.forEach(entry => {
      totalEggs += entry.totalEggs;
      totalCracked += entry.crackedEggs;
      const usableEggs = entry.totalEggs - entry.crackedEggs;
      if (usableEggs > 0) {
        totalCrates += Math.floor(usableEggs / 30);
        totalPieces += usableEggs % 30;
      }
    });
    // Consolidate pieces into crates
    totalCrates += Math.floor(totalPieces / 30);
    totalPieces %= 30;
    
    return { totalEggs, totalCracked, totalCrates, totalPieces };
  };

  const totals = calculateTotals();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-indigo-700 flex items-center"><EggIcon className="w-6 h-6 mr-2" />Egg Production</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-indigo-200 text-black uppercase text-xs">
            <tr>
              <th className="py-2 px-2">Birds</th>
              <th className="py-2 px-2">Total Eggs</th>
              <th className="py-2 px-2">Cracked</th>
              <th className="py-2 px-2">Crates</th>
              <th className="py-2 px-2">Pieces</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const usableEggs = entry.totalEggs - entry.crackedEggs;
              const crates = usableEggs > 0 ? Math.floor(usableEggs / 30) : 0;
              const pieces = usableEggs > 0 ? usableEggs % 30 : 0;
              return (
                <tr key={index} className="border-b">
                  <td className="py-2 px-2 font-medium text-gray-900">{entry.birdType}</td>
                  <td className="py-2 px-2"><input type="number" value={entry.totalEggs || ''} onChange={e => handleEntryChange(index, 'totalEggs', e.target.value)} className="w-20 p-1 border rounded bg-white text-black text-base" /></td>
                  <td className="py-2 px-2"><input type="number" value={entry.crackedEggs || ''} onChange={e => handleEntryChange(index, 'crackedEggs', e.target.value)} className="w-20 p-1 border rounded bg-white text-black text-base" /></td>
                  <td className="py-2 px-2 text-gray-900">{crates}</td>
                  <td className="py-2 px-2 text-gray-900">{pieces}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="font-bold bg-indigo-200 text-black">
            <tr>
              <td className="py-2 px-2">Total</td>
              <td className="py-2 px-2">{totals.totalEggs}</td>
              <td className="py-2 px-2">{totals.totalCracked}</td>
              <td className="py-2 px-2">{totals.totalCrates}</td>
              <td className="py-2 px-2">{totals.totalPieces}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default EggProductionReportForm;