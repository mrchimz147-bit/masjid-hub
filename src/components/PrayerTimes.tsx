'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { formatTime12Hour, getNextPrayer, getTimeUntilPrayer } from '@/lib/offline';
import { Clock, Sun, Sunrise, Sunset, Moon, SunDim } from 'lucide-react';

interface PrayerTime {
  id: string;
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

const prayers = [
  { key: 'fajr', label: 'Fajr', icon: Moon },
  { key: 'sunrise', label: 'Sunrise', icon: Sunrise },
  { key: 'dhuhr', label: 'Dhuhr', icon: Sun },
  { key: 'asr', label: 'Asr', icon: SunDim },
  { key: 'maghrib', label: 'Maghrib', icon: Sunset },
  { key: 'isha', label: 'Isha', icon: Moon },
];

export default function PrayerTimes() {
  const { cachedPrayerTimes, setCachedPrayerTimes, isOffline } = useAppStore();
  const [todayPrayer, setTodayPrayer] = useState<PrayerTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);

  useEffect(() => {
    async function fetchPrayerTimes() {
      try {
        const res = await fetch('/api/prayer-times');
        if (res.ok) {
          const data = await res.json();
          setCachedPrayerTimes(data);
          
          // Find today's prayer time
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const todayData = data.find((pt: PrayerTime) => {
            const ptDate = new Date(pt.date);
            ptDate.setHours(0, 0, 0, 0);
            return ptDate.getTime() === today.getTime();
          });
          
          setTodayPrayer(todayData || data[0]);
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        // Use cached data if available
        if (cachedPrayerTimes.length > 0) {
          setTodayPrayer(cachedPrayerTimes[0]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPrayerTimes();
  }, []);

  useEffect(() => {
    if (todayPrayer) {
      const next = getNextPrayer(todayPrayer);
      setNextPrayer(next);
      
      // Update every minute
      const interval = setInterval(() => {
        const next = getNextPrayer(todayPrayer);
        setNextPrayer(next);
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [todayPrayer]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!todayPrayer) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-gray-500">
          No prayer times available
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Next Prayer Banner */}
      {nextPrayer && (
        <Card className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Next Prayer</p>
                <h3 className="text-2xl font-bold">{nextPrayer.name}</h3>
                <p className="text-green-100">{formatTime12Hour(nextPrayer.time)}</p>
              </div>
              <div className="text-right">
                <Clock className="w-12 h-12 text-green-200 mb-2" />
                <p className="text-sm font-medium bg-white/20 rounded-full px-3 py-1">
                  {getTimeUntilPrayer(nextPrayer.time)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offline Indicator */}
      {isOffline && (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          📴 Offline Mode - Showing cached data
        </Badge>
      )}

      {/* Prayer Times Grid */}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#1B5E20]" />
            Today&apos;s Prayer Times
          </CardTitle>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {prayers.map((prayer) => {
            const Icon = prayer.icon;
            const time = todayPrayer[prayer.key as keyof PrayerTime] as string;
            const isNext = nextPrayer?.name === prayer.label;
            
            return (
              <div
                key={prayer.key}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  isNext
                    ? 'bg-green-50 border-2 border-[#1B5E20] prayer-highlight'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      isNext ? 'bg-[#1B5E20] text-white' : 'bg-gray-200'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className={`font-medium ${isNext ? 'text-[#1B5E20]' : ''}`}>
                    {prayer.label}
                  </span>
                </div>
                <span
                  className={`text-lg font-bold ${
                    isNext ? 'text-[#1B5E20]' : 'text-gray-700'
                  }`}
                >
                  {formatTime12Hour(time)}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Weekly View */}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto scrollbar-thin">
            <div className="flex gap-3 pb-2">
              {cachedPrayerTimes.slice(0, 7).map((pt, index) => {
                const date = new Date(pt.date);
                const isToday = index === 0;
                
                return (
                  <div
                    key={pt.id}
                    className={`flex-shrink-0 w-16 p-2 rounded-lg text-center ${
                      isToday
                        ? 'bg-[#1B5E20] text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <p className={`text-xs ${isToday ? 'text-green-100' : 'text-gray-500'}`}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className={`text-lg font-bold ${isToday ? '' : 'text-gray-700'}`}>
                      {date.getDate()}
                    </p>
                    <p className={`text-xs font-medium ${isToday ? 'text-green-100' : 'text-gray-500'}`}>
                      {formatTime12Hour(pt.maghrib)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
