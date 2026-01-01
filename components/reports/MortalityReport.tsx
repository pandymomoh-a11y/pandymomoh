
import React, { useState, useEffect } from 'react';
import { MortalityEntry, MortalityReport } from '../../types';
import { BIRD_TYPES_MORTALITY } from '../../constants';
import { SkullIcon } from '../icons/SkullIcon';

interface MortalityReportFormProps {
  onUpdate: (data: MortalityReport) => void;
}

const MortalityReportForm: React.FC<MortalityReportFormProps> = ({ onUpdate }) => {
  const initialEntries = BIRD_TYPES_MORTALITY.map(bt => ({ birdType: bt, numberDead: 0 }));
  const [entries, setEntries] = useState<MortalityEntry[]>(initialEntries);

  useEffect(() => {
    onUpdate({ entries });
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  const handleEntryChange = (index: number, value: string) => {
    const newEntries = [...entries];
    const numValue = parseInt(value, 10);
    newEntries[index] = { ...newEntries[index], numberDead: isNaN(numValue) ? 0 : numValue };
    setEntries(newEntries);
  };
  
  const totalDeaths = entries.reduce((acc, entry) => acc + entry.numberDead, 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-red-700 flex items-center"><SkullIcon className="w-6 h-6 mr-2"/>Mortality Report</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-red-200 text-black uppercase text-xs">
            <tr>
              <th className="py-2 px-2">Type of Bird</th>
              <th className="py-2 px-2">Number Dead</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-2 font-medium text-gray-900">{entry.birdType}</td>
                <td className="py-2 px-2"><input type="number" value={entry.numberDead || ''} onChange={e => handleEntryChange(index, e.target.value)} className="w-24 p-1 border rounded bg-white text-black text-base" /></td>
              </tr>
            ))}
          </tbody>
          <tfoot className="font-bold bg-red-200 text-black">
            <tr>
              <td className="py-2 px-2">Total Deaths</td>
              <td className="py-2 px-2">{totalDeaths}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default MortalityReportForm;