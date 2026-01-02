
import React, { useState, useEffect } from 'react';
import { MortalityEntry, MortalityReport } from '../../types';
import { BIRD_TYPES_MORTALITY } from '../../constants';
import { SkullIcon } from '../icons/SkullIcon';

interface MortalityReportFormProps {
  onUpdate: (data: MortalityReport) => void;
}

const MortalityReportForm: React.FC<MortalityReportFormProps> = ({ onUpdate }) => {
  const initialEntries = BIRD_TYPES_MORTALITY.map(bt => ({ birdType: bt, population: 0, numberDead: 0 }));
  const [entries, setEntries] = useState<MortalityEntry[]>(initialEntries);

  useEffect(() => {
    onUpdate({ entries });
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  const handleEntryChange = (index: number, field: keyof MortalityEntry, value: string) => {
    const newEntries = [...entries];
    const numValue = parseInt(value, 10);
    newEntries[index] = { ...newEntries[index], [field]: isNaN(numValue) ? 0 : numValue };
    setEntries(newEntries);
  };
  
  const calculateTotals = () => {
    return entries.reduce((acc, entry) => {
      acc.pop += entry.population;
      acc.dead += entry.numberDead;
      acc.bal += (entry.population - entry.numberDead);
      return acc;
    }, { pop: 0, dead: 0, bal: 0 });
  };

  const totals = calculateTotals();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-red-700 flex items-center"><SkullIcon className="w-6 h-6 mr-2"/>Mortality Report</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-red-200 text-black uppercase text-xs">
            <tr>
              <th className="py-2 px-2">Type</th>
              <th className="py-2 px-2">Population</th>
              <th className="py-2 px-2">Dead</th>
              <th className="py-2 px-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const balance = entry.population - entry.numberDead;
              return (
                <tr key={index} className="border-b">
                  <td className="py-2 px-2 font-medium text-gray-900">{entry.birdType}</td>
                  <td className="py-2 px-2">
                    <input 
                      type="number" 
                      value={entry.population || ''} 
                      onChange={e => handleEntryChange(index, 'population', e.target.value)} 
                      className="w-full p-1 border rounded bg-white text-black text-base" 
                      placeholder="0"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input 
                      type="number" 
                      value={entry.numberDead || ''} 
                      onChange={e => handleEntryChange(index, 'numberDead', e.target.value)} 
                      className="w-full p-1 border rounded bg-white text-black text-base"
                      placeholder="0"
                    />
                  </td>
                  <td className="py-2 px-2 text-gray-900 font-bold">{balance}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="font-bold bg-red-200 text-black">
            <tr>
              <td className="py-2 px-2">Total</td>
              <td className="py-2 px-2">{totals.pop}</td>
              <td className="py-2 px-2">{totals.dead}</td>
              <td className="py-2 px-2">{totals.bal}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default MortalityReportForm;