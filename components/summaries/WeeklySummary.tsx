
import React from 'react';
import { DailyReport, UserProfile } from '../../types';
import SummaryCard from './SummaryCard';

interface WeeklySummaryProps {
  reports: DailyReport[];
  activeProfile: UserProfile;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ reports, activeProfile }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const weeklyReports = reports.filter(report => {
    const reportDate = new Date(report.date + 'T00:00:00');
    return reportDate >= sevenDaysAgo && reportDate <= today;
  });
  
  const period = `${sevenDaysAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Summary</h2>
       <SummaryCard reports={weeklyReports} period={period} title="Weekly Summary" activeProfile={activeProfile} />
    </div>
  );
};

export default WeeklySummary;