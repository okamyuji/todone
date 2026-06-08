import { useState, useCallback } from 'react';
import { DailyScreen } from './daily/DailyScreen';
import { CalendarScreen } from './calendar/CalendarScreen';
import { SettingsScreen } from './settings/SettingsScreen';
import { BottomNav } from './ui/BottomNav';
import type { TabId } from './ui/BottomNav';

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('daily');
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<
    string | undefined
  >();

  const handleDateSelect = useCallback((date: string) => {
    setCalendarSelectedDate(date);
    setActiveTab('daily');
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case 'daily':
        return <DailyScreen initialDate={calendarSelectedDate} />;
      case 'calendar':
        return <CalendarScreen onDateSelect={handleDateSelect} />;
      case 'settings':
        return <SettingsScreen />;
    }
  };

  return (
    <>
      <main>{renderScreen()}</main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
