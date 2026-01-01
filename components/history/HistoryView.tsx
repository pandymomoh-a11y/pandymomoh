
import React, { useState } from 'react';
import { DailyReport, UserProfile } from '../../types';
import { ReportCard } from './ReportCard';

interface HistoryViewProps {
  reports: DailyReport[];
  activeProfile: UserProfile;
}

const HistoryView: React.FC<HistoryViewProps> = ({ reports, activeProfile }) => {
  const [openReportDate, setOpenReportDate] = useState<string | null>(null);

  const toggleReport = (date: string) => {
    setOpenReportDate(openReportDate === date ? null : date);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Report History</h2>
      {reports.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No reports saved yet.</p>
      ) : (
        reports.map(report => (
          <ReportCard 
            key={report.date} 
            report={report} 
            isOpen={openReportDate === report.date}
            onToggle={() => toggleReport(report.date)}
            activeProfile={activeProfile}
          />
        ))
      )}
    </div>
  );
};

export default HistoryView;