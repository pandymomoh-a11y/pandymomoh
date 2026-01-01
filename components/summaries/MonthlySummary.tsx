
import React from 'react';
import { DailyReport, UserProfile } from '../../types';
import SummaryCard from './SummaryCard';

interface MonthlySummaryProps {
  reports: DailyReport[];
  activeProfile: UserProfile;
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ reports, activeProfile }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthlyReports = reports.filter(report => {
    const reportDate = new Date(report.date + 'T00:00:00');
    return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
  });

  const period = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  return (
    <div>
       <h2 className="text-2xl font-bold text-gray-800 mb-4">Monthly Summary</h2>
       <SummaryCard reports={monthlyReports} period={period} title="Monthly Summary" activeProfile={activeProfile} />
    </div>
  );
};

export default MonthlySummary;