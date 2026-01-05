
import React, { useState, useEffect } from 'react';
import { EggSaleEntry, EggSalesReport } from '../../types';
import { EGG_SALE_TYPES } from '../../constants';
import { SalesIcon } from '../icons/SalesIcon';

interface EggSalesReportFormProps {
  onUpdate: (data: EggSalesReport) => void;
}

const EggSalesReportForm: React.FC<EggSalesReportFormProps> = ({ onUpdate }) => {
  const initialEntries = EGG_SALE_TYPES.map(et => ({ eggType: et, opening: 0, production: 0, sold: 0 }));
  const [entries, setEntries] = useState<EggSaleEntry[]>(initialEntries);

  useEffect(() => {
    onUpdate({ entries });
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  const handleEntryChange = (index: number, field: keyof EggSaleEntry, value: string) => {
    const newEntries = [...entries];
    const numValue = parseInt(value, 10);
    newEntries[index] = { ...newEntries[index], [field]: isNaN(numValue) ? 0 : numValue };
    setEntries(newEntries);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-sky-700 flex items-center"><SalesIcon className="w-6 h-6 mr-2" />Egg Sales</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-sky-200 text-black uppercase text-xs">
            <tr>
              <th className="py-2 px-2">Type</th>
              <th className="py-2 px-2">Opening</th>
              <th className="py-2 px-2">Production</th>
              <th className="py-2 px-2">Total</th>
              <th className="py-2 px-2">Sold</th>
              <th className="py-2 px-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const total = entry.opening + entry.production;
              const balance = total - entry.sold;
              return (
                <tr key={index} className="border-b">
                  <td className="py-2 px-2 font-medium text-gray-900">{entry.eggType}</td>
                  <td className="py-2 px-2"><input type="number" value={entry.opening || ''} onChange={e => handleEntryChange(index, 'opening', e.target.value)} className="w-full p-1 border rounded bg-white text-black text-base" placeholder="0" /></td>
                  <td className="py-2 px-2"><input type="number" value={entry.production || ''} onChange={e => handleEntryChange(index, 'production', e.target.value)} className="w-full p-1 border rounded bg-white text-black text-base" placeholder="0" /></td>
                  <td className="py-2 px-2 font-bold text-gray-900">{total}</td>
                  <td className="py-2 px-2"><input type="number" value={entry.sold || ''} onChange={e => handleEntryChange(index, 'sold', e.target.value)} className="w-full p-1 border rounded bg-white text-black text-base" placeholder="0" /></td>
                  <td className="py-2 px-2 font-bold text-gray-900">{balance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EggSalesReportForm;