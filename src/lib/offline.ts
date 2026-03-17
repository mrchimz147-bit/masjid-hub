// Offline utility functions for Masjid Hub

const CACHE_PREFIX = 'masjid-hub-';
const CACHE_EXPIRY_HOURS = 24;

interface CacheData<T> {
  data: T;
  timestamp: number;
}

export function saveToCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  
  const cacheKey = `${CACHE_PREFIX}${key}`;
  const cacheData: CacheData<T> = {
    data,
    timestamp: Date.now(),
  };
  
  try {
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
}

export function getFromCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  const cacheKey = `${CACHE_PREFIX}${key}`;
  
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;
    
    const cacheData: CacheData<T> = JSON.parse(cached);
    
    // Check if cache is expired
    const expiryMs = CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
    if (Date.now() - cacheData.timestamp > expiryMs) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return cacheData.data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

export function clearCache(key?: string): void {
  if (typeof window === 'undefined') return;
  
  if (key) {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } else {
    // Clear all masjid hub cache
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const lsKey = localStorage.key(i);
      if (lsKey?.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(lsKey);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }
}

export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

export function formatTime12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getNextPrayer(prayerTimes: {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}): { name: string; time: string } | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr },
    { name: 'Sunrise', time: prayerTimes.sunrise },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isha', time: prayerTimes.isha },
  ];
  
  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerMinutes = hours * 60 + minutes;
    
    if (prayerMinutes > currentMinutes) {
      return prayer;
    }
  }
  
  // If all prayers have passed, return first prayer of next day
  return { name: 'Fajr', time: prayerTimes.fajr };
}

export function getTimeUntilPrayer(prayerTime: string): string {
  const now = new Date();
  const [hours, minutes] = prayerTime.split(':').map(Number);
  
  const prayerDate = new Date();
  prayerDate.setHours(hours, minutes, 0, 0);
  
  // If prayer time has passed, it's for tomorrow
  if (prayerDate <= now) {
    prayerDate.setDate(prayerDate.getDate() + 1);
  }
  
  const diff = prayerDate.getTime() - now.getTime();
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) {
    return `in ${diffHours}h ${diffMinutes}m`;
  }
  return `in ${diffMinutes}m`;
}
