// Prayer times for Bulawayo, Zimbabwe (adjustable by admin)
export const DEFAULT_PRAYER_TIMES = {
  fajr: '04:45',
  sunrise: '06:05',
  dhuhr: '12:15',
  asr: '15:30',
  maghrib: '18:10',
  isha: '19:25',
}

// Jumu'ah time (adjustable by admin)
export const JUMUAH_TIME = {
  khutbah: '12:45',
  prayer: '13:15',
}

// Masjid location for GPS directions
export const MASJID_LOCATION = {
  name: 'Zeenat-ul-Islam Masjid',
  address: 'Bulawayo, Zimbabwe',
  // Approximate coordinates for Bulawayo - update with exact masjid location
  latitude: -20.1573,
  longitude: 28.5806,
}

// Calculate time remaining until next prayer
export function getNextPrayer(prayerTimes: typeof DEFAULT_PRAYER_TIMES): { name: string; time: string; remaining: string } {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr },
    { name: 'Sunrise', time: prayerTimes.sunrise },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isha', time: prayerTimes.isha },
  ]

  for (const prayer of prayers) {
    const [h, m] = prayer.time.split(':').map(Number)
    const prayerMinutes = h * 60 + m
    
    if (prayerMinutes > currentMinutes) {
      const diff = prayerMinutes - currentMinutes
      const hours = Math.floor(diff / 60)
      const mins = diff % 60
      return {
        name: prayer.name,
        time: prayer.time,
        remaining: hours > 0 ? `${hours}h ${mins}m` : `${mins} minutes`
      }
    }
  }

  // If past Isha, return Fajr for next day
  return {
    name: 'Fajr',
    time: prayerTimes.fajr,
    remaining: 'Tomorrow'
  }
}

// Calculate time until Jumu'ah
export function getTimeUntilJumuah(): { days: number; hours: number; minutes: number; isToday: boolean } {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = Sunday, 5 = Friday
  
  let daysUntilFriday = (5 - dayOfWeek + 7) % 7
  if (daysUntilFriday === 0) {
    // It's Friday!
    const [h, m] = JUMUAH_TIME.khutbah.split(':').map(Number)
    const khutbahMinutes = h * 60 + m
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    
    if (currentMinutes < khutbahMinutes) {
      // Jumu'ah hasn't started yet today
      return {
        days: 0,
        hours: Math.floor((khutbahMinutes - currentMinutes) / 60),
        minutes: (khutbahMinutes - currentMinutes) % 60,
        isToday: true
      }
    }
    // Jumu'ah already passed today, next week
    daysUntilFriday = 7
  }

  const nextFriday = new Date(now)
  nextFriday.setDate(now.getDate() + daysUntilFriday)
  nextFriday.setHours(parseInt(JUMUAH_TIME.khutbah.split(':')[0]), parseInt(JUMUAH_TIME.khutbah.split(':')[1]), 0, 0)

  const diffMs = nextFriday.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  return {
    days: daysUntilFriday,
    hours: diffHours % 24,
    minutes: diffMins,
    isToday: false
  }
}

// Check if it's time for Adhan
export function isAdhanTime(prayerTimes: typeof DEFAULT_PRAYER_TIMES): boolean {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  
  const prayerMinutesList = [
    prayerTimes.fajr,
    prayerTimes.dhuhr,
    prayerTimes.asr,
    prayerTimes.maghrib,
    prayerTimes.isha,
  ]
  
  for (const time of prayerMinutesList) {
    const [h, m] = time.split(':').map(Number)
    if (h === now.getHours() && m === now.getMinutes()) {
      return true
    }
  }
  
  return false
}

// Get directions to masjid via Google Maps
export function getDirectionsToMasjid(userLat?: number, userLng?: number): string {
  const { latitude, longitude } = MASJID_LOCATION
  
  if (userLat && userLng) {
    return `https://www.google.com/maps/dir/${userLat},${userLng}/${latitude},${longitude}`
  }
  
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
}

// Get current user location
export function getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  })
}

// Calculate distance to masjid in km
export function getDistanceToMasjid(userLat: number, userLng: number): number {
  const { latitude, longitude } = MASJID_LOCATION
  
  const R = 6371 // Earth's radius in km
  const dLat = (latitude - userLat) * Math.PI / 180
  const dLon = (longitude - userLng) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(userLat * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  
  return Math.round(R * c * 10) / 10
}
