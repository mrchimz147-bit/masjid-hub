'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { DEFAULT_PRAYER_TIMES, JUMUAH_TIME } from '@/lib/prayer-utils'

interface PrayerAlarmHook {
  playAdhan: () => void
  stopAdhan: () => void
  isPlaying: boolean
  nextPrayer: { name: string; time: string; remaining: string } | null
  jumuahCountdown: { days: number; hours: number; minutes: number; isToday: boolean } | null
  requestNotificationPermission: () => void
  hasNotificationPermission: boolean
}

export function usePrayerAlarm(): PrayerAlarmHook {
  const [isPlaying, setIsPlaying] = useState(false)
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; remaining: string } | null>(null)
  const [jumuahCountdown, setJumuahCountdown] = useState<{ days: number; hours: number; minutes: number; isToday: boolean } | null>(null)
  // Check notification permission in useState initializer (not in effect)
  const [hasNotificationPermission, setHasNotificationPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission === 'granted'
    }
    return false
  })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Request notification permission
  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        setHasNotificationPermission(permission === 'granted')
      })
    }
  }, [])

  // Play Adhan
  const playAdhan = useCallback(() => {
    // In production, use actual Adhan audio file
    // For now, use a simple notification sound or text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Allahu Akbar, Allahu Akbar...')
      utterance.lang = 'ar'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
      setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
    }
  }, [])

  // Stop Adhan
  const stopAdhan = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    speechSynthesis.cancel()
    setIsPlaying(false)
  }, [])

  // Check prayer times and trigger alarm
  useEffect(() => {
    const checkPrayerTime = () => {
      const now = new Date()
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      
      // Get prayer times from localStorage (admin can update)
      const savedTimes = localStorage.getItem('masjid-admin-prayer')
      const prayerTimes = savedTimes ? JSON.parse(savedTimes) : DEFAULT_PRAYER_TIMES
      
      // Calculate next prayer
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
          setNextPrayer({
            name: prayer.name,
            time: prayer.time,
            remaining: hours > 0 ? `${hours}h ${mins}m` : `${mins} min`
          })
          break
        }
      }

      // Check if it's exactly prayer time (for alarm)
      const prayerMinutesList = [
        { name: 'Fajr', time: prayerTimes.fajr },
        { name: 'Dhuhr', time: prayerTimes.dhuhr },
        { name: 'Asr', time: prayerTimes.asr },
        { name: 'Maghrib', time: prayerTimes.maghrib },
        { name: 'Isha', time: prayerTimes.isha },
      ]

      for (const prayer of prayerMinutesList) {
        const [h, m] = prayer.time.split(':').map(Number)
        if (h === now.getHours() && m === now.getMinutes() && now.getSeconds() === 0) {
          // Check if alarm is enabled
          const alarmEnabled = localStorage.getItem('masjid-prayer-alarm-enabled')
          if (alarmEnabled !== 'false') {
            // Send notification
            if (Notification.permission === 'granted') {
              new Notification(`Time for ${prayer.name}`, {
                body: `It's time for ${prayer.name} prayer at Zeenat-ul-Islam Masjid`,
                icon: '/icon-192.png',
                tag: `prayer-${prayer.name}`,
                requireInteraction: true,
              })
            }
            // Play Adhan
            playAdhan()
          }
          break
        }
      }

      // Calculate Jumu'ah countdown
      const dayOfWeek = now.getDay() // 0 = Sunday, 5 = Friday
      let daysUntilFriday = (5 - dayOfWeek + 7) % 7
      
      if (daysUntilFriday === 0) {
        const [h, m] = JUMUAH_TIME.khutbah.split(':').map(Number)
        const khutbahMinutes = h * 60 + m
        
        if (currentMinutes < khutbahMinutes) {
          setJumuahCountdown({
            days: 0,
            hours: Math.floor((khutbahMinutes - currentMinutes) / 60),
            minutes: (khutbahMinutes - currentMinutes) % 60,
            isToday: true
          })
        } else {
          daysUntilFriday = 7
        }
      }

      if (daysUntilFriday > 0 || !jumuahCountdown?.isToday) {
        const nextFriday = new Date(now)
        nextFriday.setDate(now.getDate() + daysUntilFriday)
        nextFriday.setHours(parseInt(JUMUAH_TIME.khutbah.split(':')[0]), parseInt(JUMUAH_TIME.khutbah.split(':')[1]), 0, 0)

        const diffMs = nextFriday.getTime() - now.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

        setJumuahCountdown({
          days: diffDays,
          hours: diffHours,
          minutes: diffMins,
          isToday: false
        })
      }
    }

    // Check every second
    checkPrayerTime()
    intervalRef.current = setInterval(checkPrayerTime, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [playAdhan])

  // Check notification permission on mount - use initial state instead of effect
  // Permission is checked in the useState initializer below

  return {
    playAdhan,
    stopAdhan,
    isPlaying,
    nextPrayer,
    jumuahCountdown,
    requestNotificationPermission,
    hasNotificationPermission,
  }
}
