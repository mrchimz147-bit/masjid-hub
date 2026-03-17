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

// ============================================
// SHAFI'I PRAYER TIME CALCULATIONS
// ============================================

// Convert degrees to radians
const toRadians = (deg: number) => deg * Math.PI / 180

// Convert radians to degrees
const toDegrees = (rad: number) => rad * 180 / Math.PI

// Trigonometric functions using degrees
const sin = (deg: number) => Math.sin(toRadians(deg))
const cos = (deg: number) => Math.cos(toRadians(deg))
const tan = (deg: number) => Math.tan(toRadians(deg))
const arcsin = (x: number) => toDegrees(Math.asin(x))
const arccos = (x: number) => toDegrees(Math.acos(x))
const arctan2 = (y: number, x: number) => toDegrees(Math.atan2(y, x))

// Calculate Julian Date
function getJulianDate(date: Date): number {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  
  let y = year
  let m = month
  
  if (m <= 2) {
    y -= 1
    m += 12
  }
  
  const a = Math.floor(y / 100)
  const b = 2 - a + Math.floor(a / 4)
  
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5
}

// Calculate sun position
function getSunPosition(jd: number): { declination: number; equation: number } {
  // Julian centuries from J2000.0
  const t = (jd - 2451545.0) / 36525
  
  // Mean longitude of the sun
  const l0 = (280.46646 + 36000.76983 * t + 0.0003032 * t * t) % 360
  
  // Mean anomaly of the sun
  const m = (357.52911 + 35999.05029 * t - 0.0001537 * t * t) % 360
  
  // Eccentricity of Earth's orbit
  const e = 0.016708634 - 0.000042037 * t - 0.0000001267 * t * t
  
  // Equation of center
  const c = sin(m) * (1.914602 - 0.004817 * t - 0.000014 * t * t) +
            sin(2 * m) * (0.019993 - 0.000101 * t) +
            sin(3 * m) * 0.000289
  
  // Sun's true longitude
  const sunLon = l0 + c
  
  // Sun's apparent longitude (corrected for nutation and aberration)
  const omega = 125.04 - 1934.136 * t
  const lambda = sunLon - 0.00569 - 0.00478 * sin(omega)
  
  // Mean obliquity of the ecliptic
  const epsilon0 = 23 + (26 + (21.448 - 46.8150 * t - 0.00059 * t * t + 0.001813 * t * t * t) / 60) / 60
  
  // Obliquity corrected for nutation
  const epsilon = epsilon0 + 0.00256 * cos(omega)
  
  // Sun's declination
  const declination = arcsin(sin(epsilon) * sin(lambda))
  
  // Equation of time (in minutes)
  const y = tan(epsilon / 2) * tan(epsilon / 2)
  const eqTime = 4 * toDegrees(arccos(
    (cos(lambda) - y * sin(sunLon)) / (cos(declination) * (1 + y))
  ) - 180) * -1
  
  return { declination, equation: eqTime }
}

// Calculate prayer time for a given sun angle
function getPrayerTime(
  date: Date,
  latitude: number,
  longitude: number,
  angle: number,
  isRising: boolean = false,
  isAsr: boolean = false,
  asrFactor: number = 1 // 1 for Shafi'i, 2 for Hanafi
): string {
  const jd = getJulianDate(date)
  const { declination, equation } = getSunPosition(jd)
  
  // Calculate hour angle
  let hourAngle: number
  
  if (isAsr) {
    // Asr calculation: shadow length = asrFactor * object length
    // The formula for Asr altitude is: arctan(1 / (asrFactor + tan(|lat - decl|)))
    const latDiff = Math.abs(latitude - declination)
    const asrAlt = arctan2(1, asrFactor + tan(latDiff))
    const cosH = (sin(asrAlt) - sin(latitude) * sin(declination)) / 
                 (cos(latitude) * cos(declination))
    
    if (Math.abs(cosH) > 1) {
      return '--:--' // Sun doesn't reach this altitude
    }
    
    hourAngle = arccos(cosH)
  } else {
    // For Fajr, Sunrise, Maghrib, Isha - angle is the sun's altitude below horizon
    // For sunrise/sunset, angle = 0.833 (accounting for atmospheric refraction and sun's radius)
    const zenith = 90 - angle
    const cosH = (cos(zenith) - sin(latitude) * sin(declination)) / 
                 (cos(latitude) * cos(declination))
    
    if (Math.abs(cosH) > 1) {
      return '--:--' // Sun doesn't reach this angle (polar day/night)
    }
    
    hourAngle = arccos(cosH)
    
    if (isRising) {
      hourAngle = -hourAngle
    }
  }
  
  // Calculate local solar time
  const solarTime = hourAngle - equation
  
  // Convert to UTC
  const utcHours = solarTime / 15 - longitude / 15
  
  // Convert to local time (CAT = UTC+2 for Bulawayo)
  const localHours = utcHours + 2
  
  // Format time
  const hours = Math.floor(localHours) % 24
  const minutes = Math.round((localHours - Math.floor(localHours)) * 60)
  
  // Handle minute overflow
  const adjustedHours = minutes === 60 ? hours + 1 : hours
  const adjustedMinutes = minutes === 60 ? 0 : minutes
  
  return `${String(adjustedHours).padStart(2, '0')}:${String(adjustedMinutes).padStart(2, '0')}`
}

/**
 * Calculate all prayer times for Bulawayo using Shafi'i methodology
 * 
 * Shafi'i Method:
 * - Fajr: Sun is 18° below horizon (dawn)
 * - Sunrise: Sun's upper limb appears on horizon (0.833° below)
 * - Dhuhr: Solar noon (sun at its highest point)
 * - Asr: Shadow length equals object length (factor = 1)
 * - Maghrib: Sunset (sun's upper limb disappears, 0.833° below)
 * - Isha: Sun is 17° below horizon (end of twilight)
 * 
 * @param date - The date to calculate prayer times for
 * @returns Object containing all prayer times as HH:MM strings
 */
export function calculateShafiPrayerTimes(date: Date = new Date()): {
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
} {
  const { latitude, longitude } = MASJID_LOCATION
  
  // Get sun position for Dhuhr calculation
  const jd = getJulianDate(date)
  const { equation } = getSunPosition(jd)
  
  // Calculate Dhuhr (solar noon) - when sun is due south
  // Dhuhr = 12:00 + timezone offset - equation of time - longitude/15
  const dhuhrTime = 12 - equation / 60 - longitude / 15 + 2 // +2 for CAT timezone
  const dhuhrHours = Math.floor(dhuhrTime) % 24
  const dhuhrMins = Math.round((dhuhrTime - Math.floor(dhuhrTime)) * 60)
  
  return {
    // Fajr: Sun 18° below horizon (Shafi'i standard)
    fajr: getPrayerTime(date, latitude, longitude, 18, true),
    
    // Sunrise: Sun's upper limb at horizon (accounting for refraction)
    sunrise: getPrayerTime(date, latitude, longitude, 0.833, true),
    
    // Dhuhr: Solar noon
    dhuhr: `${String(dhuhrHours).padStart(2, '0')}:${String(dhuhrMins).padStart(2, '0')}`,
    
    // Asr (Shafi'i): Shadow length = object length (factor = 1)
    asr: getPrayerTime(date, latitude, longitude, 0, false, true, 1),
    
    // Maghrib: Sunset
    maghrib: getPrayerTime(date, latitude, longitude, 0.833, false),
    
    // Isha: Sun 17° below horizon (Shafi'i standard for end of twilight)
    isha: getPrayerTime(date, latitude, longitude, 17, false),
  }
}

/**
 * Get prayer times for a specific date
 * Returns calculated times for Bulawayo following Shafi'i/Salafi methodology
 */
export function getPrayerTimesForDate(date: Date): typeof DEFAULT_PRAYER_TIMES {
  const times = calculateShafiPrayerTimes(date)
  
  // Return formatted times, falling back to defaults if calculation fails
  return {
    fajr: times.fajr !== '--:--' ? times.fajr : DEFAULT_PRAYER_TIMES.fajr,
    sunrise: times.sunrise !== '--:--' ? times.sunrise : DEFAULT_PRAYER_TIMES.sunrise,
    dhuhr: times.dhuhr !== '--:--' ? times.dhuhr : DEFAULT_PRAYER_TIMES.dhuhr,
    asr: times.asr !== '--:--' ? times.asr : DEFAULT_PRAYER_TIMES.asr,
    maghrib: times.maghrib !== '--:--' ? times.maghrib : DEFAULT_PRAYER_TIMES.maghrib,
    isha: times.isha !== '--:--' ? times.isha : DEFAULT_PRAYER_TIMES.isha,
  }
}

/**
 * Get Qibla direction from Bulawayo
 * Returns the direction in degrees from North
 */
export function getQiblaDirection(): number {
  // Kaaba coordinates
  const kaabaLat = 21.4225
  const kaabaLng = 39.8262
  
  const { latitude, longitude } = MASJID_LOCATION
  
  // Calculate Qibla direction using spherical trigonometry
  const latDiff = toRadians(kaabaLat - latitude)
  const lngDiff = toRadians(kaabaLng - longitude)
  
  const x = sin(lngDiff) * cos(toRadians(kaabaLat))
  const y = cos(toRadians(latitude)) * sin(toRadians(kaabaLat)) - 
            sin(toRadians(latitude)) * cos(toRadians(kaabaLat)) * cos(lngDiff)
  
  let qiblaAngle = toDegrees(Math.atan2(x, y))
  
  // Normalize to 0-360 range
  if (qiblaAngle < 0) {
    qiblaAngle += 360
  }
  
  return Math.round(qiblaAngle)
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
