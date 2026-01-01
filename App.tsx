
import React, { useState } from 'react';
import Header from './components/Header';
import Navigation, { View } from './components/Navigation';
import DailyReports from './components/reports/DailyReports';
import HistoryView from './components/history/HistoryView';
import WeeklySummary from './components/summaries/WeeklySummary';
import MonthlySummary from './components/summaries/MonthlySummary';
import ProfileSelector from './components/profiles/ProfileSelector';
import { DailyReport } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useProfiles } from './hooks/useProfiles';

const App: React.FC = () => {
  const { profiles, activeProfile, addProfile, setActiveProfile } = useProfiles();
  const [activeView, setActiveView] = useState<View>('reports');
  
  // Scoped key ensures strict data separation between users
  const storageKey = activeProfile ? `suffy-poultry-reports-${activeProfile.id}` : 'suffy-poultry-reports-none';
  const [reports, setReports] = useLocalStorage<DailyReport[]>(storageKey, []);

  if (!activeProfile) {
    return <ProfileSelector profiles={profiles} onSelect={setActiveProfile} onCreate={addProfile} />;
  }

  const handleAddReport = (newReport: DailyReport) => {
    const existingReportIndex = reports.findIndex(r => r.date === newReport.date);
    let updatedReports: DailyReport[];
    
    if (existingReportIndex > -1) {
      updatedReports = [...reports];
      updatedReports[existingReportIndex] = newReport;
    } else {
      updatedReports = [...reports, newReport].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    setReports(updatedReports);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'reports':
        return <DailyReports onSave={handleAddReport} />;
      case 'history':
        return <HistoryView reports={reports} activeProfile={activeProfile} />;
      case 'weekly':
        return <WeeklySummary reports={reports} activeProfile={activeProfile} />;
      case 'monthly':
        return <MonthlySummary reports={reports} activeProfile={activeProfile} />;
      default:
        return <DailyReports onSave={handleAddReport} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-black bg-gray-100">
      <Header activeProfile={activeProfile} onSwitchProfile={() => setActiveProfile(null)} />
      <main className="pb-24 pt-20">
        <div className="container mx-auto px-4 max-w-lg">
            {renderContent()}
        </div>
      </main>
      <Navigation activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;