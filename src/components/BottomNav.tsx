'use client';

import { useAppStore } from '@/lib/store';
import { Home, Clock, BookOpen, CalendarHeart, MessageCircle } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'prayer', label: 'Prayer', icon: Clock },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'community', label: 'Community', icon: CalendarHeart },
  { id: 'ask', label: 'Ask', icon: MessageCircle },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive
                    ? 'text-[#1B5E20]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div
                  className={`p-1.5 rounded-full transition-all ${
                    isActive ? 'bg-green-50' : ''
                  }`}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? 'text-[#1B5E20]' : ''}
                  />
                </div>
                <span
                  className={`text-[10px] mt-0.5 font-medium ${
                    isActive ? 'text-[#1B5E20]' : ''
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
