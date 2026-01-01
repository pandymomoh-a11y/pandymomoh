
import React, { useState, useEffect } from 'react';
import { FeedStockEntry, FeedStockReport } from '../../types';
import { FEED_TYPES } from '../../constants';
import { FeedIcon } from '../icons/FeedIcon';

interface FeedStockReportFormProps {
  onUpdate: (data: FeedStockReport) => void;
}

const FeedStockReportForm: React.FC<FeedStockReportFormProps> = ({ onUpdate }) => {
  const initialEntries = FEED_TYPES.map(ft => ({ feedType: ft, opening: 0, used: 0, bought: 0 }));
  const [entries, setEntries] = useState<FeedStockEntry[]>(initialEntries);

  useEffect(() => {
    onUpdate({ entries });
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  const handleEntryChange = (index: number, field: keyof FeedStockEntry, value: string) => {
    const newEntries = [...entries];
    const numValue = parseInt(value, 10);
    newEntries[index] = { ...newEntries[index], [field]: isNaN(numValue) ? 0 : numValue };
    setEntries(newEntries);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-amber-700 flex items-center"><FeedIcon className="w-6 h-6 mr-2" />Feed Stock</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-amber-200 text-black uppercase text-xs">
            <tr>
              <th className="py-2 px-2">Type of Feed</th>
              <th className="py-2 px-2">Opening</th>
              <th className="py-2 px-2">Used</th>
              <th className="py-2 px-2">Bought</th>
              <th className="py-2 px-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const balance = entry.opening + entry.bought - entry.used;
              return (
                <tr key={index} className="border-b">
                  <td className="py-2 px-2 font-medium text-gray-900">{entry.feedType}</td>
                  <td className="py-2 px-2"><input type="number" value={entry.opening || ''} onChange={e => handleEntryChange(index, 'opening', e.target.value)} className="w-20 p-1 border rounded bg-white text-black text-base" /></td>
                  <td className="py-2 px-2"><input type="number" value={entry.used || ''} onChange={e => handleEntryChange(index, 'used', e.target.value)} className="w-20 p-1 border rounded bg-white text-black text-base" /></td>
                  <td className="py-2 px-2"><input type="number" value={entry.bought || ''} onChange={e => handleEntryChange(index, 'bought', e.target.value)} className="w-20 p-1 border rounded bg-white text-black text-base" /></td>
                  <td className="py-2 px-2 text-gray-900">{balance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedStockReportForm;